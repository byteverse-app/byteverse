import { NextRequest, NextResponse } from 'next/server';
import { buildOutlinePrompt } from '@/lib/prompts/outlinePrompt';
import { retrieveContext, formatContextForPrompt } from '@/lib/rag/retrieval';
import { getVectorStoreForRequest, ensureSessionVectorStore } from '@/lib/rag/sessionVectorStore';
import { Chunk } from '@/lib/rag/chunker';
import { CourseConfig, CourseData } from '@/types/course';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { validateJSONCompleteness, checkCourseCompleteness, retryWithBackoff } from '@/lib/ai/qualityGuardrails';
import { AIProvider, ProviderRequestConfig } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';
import { trackOutlineCompletion } from '@/lib/access/generationSessions';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { config, provider = 'platform', providerConfig, chatHistory = [], contextSessionId, sourceChunks = [], projectId }: { 
      config: CourseConfig; 
      provider?: AIProvider;
      providerConfig?: ProviderRequestConfig;
      chatHistory?: Array<{ role: string; content: string }>;
      contextSessionId?: string;
      sourceChunks?: Chunk[];
      projectId?: string;
    } = await request.json();

    const aiProvider = resolveProvider(provider, providerConfigFromBody(provider, providerConfig));
    if (!aiProvider) {
      return NextResponse.json(
        { error: `Provider "${provider}" is not configured. Add your API key in workspace settings.` },
        { status: 400 }
      );
    }

    // Retrieve relevant context from session-scoped vector store
    let contextText = '';
    const vectorStore = contextSessionId
      ? await ensureSessionVectorStore(user.id, contextSessionId, sourceChunks)
      : getVectorStoreForRequest(user.id, contextSessionId);
    if (vectorStore.size() > 0) {
      const query = `${config.topic} ${config.description}`;
      const results = await retrieveContext(query, vectorStore, 5, true);
      contextText = formatContextForPrompt(results, 2000);
    }

    // Build prompt
    const prompt = buildOutlinePrompt(config, contextText);

    // Build conversation context from chat history
    const conversationContext = chatHistory.length > 0 
      ? `\n\nIMPORTANT: The user has provided the following feedback and requirements during our conversation:\n${chatHistory
          .slice(-10) // Last 10 messages
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n')}\n\nPlease incorporate these requirements and feedback into the course outline.`
      : '';

    // Generate outline with retry and validation
    const outline = await retryWithBackoff(async () => {
      // For TogetherAI, try multiple models if one fails
      let result;
      let lastError;
      
      if (provider === 'together') {
        const modelsToTry = [
          'meta-llama/Llama-3.2-3B-Instruct-Turbo', // Primary model
          'openai/gpt-oss-20b', // Fallback model
          MODELS.CHAT, // Qwen/Qwen3-Next-80B-A3b-Instruct
          'meta-llama/Llama-3.1-70B-Instruct-Turbo',
        ];
        
        for (const model of modelsToTry) {
          try {
            result = await aiProvider.generateJSON<{ course: CourseData['course'] }>(
              [
                {
                  role: 'system',
                  content:
                    'You are an expert instructional designer. You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. The response must be a valid JSON object matching the requested structure exactly. Start your response with { and end with }.',
                },
                {
                  role: 'user',
                  content: prompt + conversationContext + '\n\nIMPORTANT: Respond with ONLY valid JSON. No explanations, no text before or after. Just the JSON object.',
                },
              ],
              {
                model,
                temperature: 0.3,
                maxTokens: 8000,
                retries: 1, // Reduced since we're trying multiple models
              }
            );
            console.log(`Outline generation succeeded with model: ${model}`);
            break;
          } catch (error) {
            lastError = error;
            console.log(`Model ${model} failed for outline, trying next...`);
          }
        }
        
        if (!result) {
          throw lastError || new Error('All models failed for outline generation');
        }
      } else {
        result = await aiProvider.generateJSON<{ course: CourseData['course'] }>(
          [
            {
              role: 'system',
              content:
                'You are an expert instructional designer. You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. The response must be a valid JSON object matching the requested structure exactly. Start your response with { and end with }.',
            },
            {
              role: 'user',
              content: prompt + '\n\nIMPORTANT: Respond with ONLY valid JSON. No explanations, no text before or after. Just the JSON object.',
            },
          ],
          {
            temperature: 0.3,
            maxTokens: 8000,
            retries: 2,
          }
        );
      }

      // Validate outline structure (outline doesn't need content fields - those are generated separately)
      const validation = validateJSONCompleteness(result, ['course'], [
        { field: 'course', required: ['title', 'description', 'duration', 'stages'] },
        { field: 'course.stages', required: ['id', 'title', 'objective'] },
      ]);

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check outline completeness (stages should have id, title, objective, and keyPoints)
      if (!result.course.stages || result.course.stages.length === 0) {
        throw new Error('No stages generated in outline');
      }

      // Validate stage count matches requested count
      const generatedStageCount = result.course.stages.length;
      const requestedStageCount = config.stageCount;
      
      if (generatedStageCount !== requestedStageCount) {
        console.warn(`Stage count mismatch: requested ${requestedStageCount}, got ${generatedStageCount}`);
        
        // If significantly different, throw error to trigger retry
        if (Math.abs(generatedStageCount - requestedStageCount) > 2) {
          throw new Error(`Stage count mismatch: requested ${requestedStageCount} stages but got ${generatedStageCount}. Please generate exactly ${requestedStageCount} stages.`);
        }
        
        // If close (within 2), adjust the stages array
        if (generatedStageCount < requestedStageCount) {
          // Add missing stages by duplicating and modifying last stage
          const lastStage = result.course.stages[result.course.stages.length - 1];
          while (result.course.stages.length < requestedStageCount) {
            const newStage = {
              ...lastStage,
              id: result.course.stages.length + 1,
              title: `${lastStage.title} (Continued)`,
            };
            result.course.stages.push(newStage);
          }
        } else if (generatedStageCount > requestedStageCount) {
          // Remove extra stages (keep first N)
          result.course.stages = result.course.stages.slice(0, requestedStageCount);
        }
        
        // Re-number stages to ensure sequential IDs
        result.course.stages.forEach((stage: any, index: number) => {
          stage.id = index + 1;
        });
      }

      // Verify each stage has required outline fields (not content - that comes later)
      const missingFields: string[] = [];
      result.course.stages.forEach((stage: any, index: number) => {
        if (!stage.id) missingFields.push(`course.stages[${index}].id`);
        if (!stage.title) missingFields.push(`course.stages[${index}].title`);
        if (!stage.objective) missingFields.push(`course.stages[${index}].objective`);
      });

      if (missingFields.length > 0) {
        throw new Error(`Incomplete outline: ${missingFields.join(', ')}`);
      }

      return result;
    }, 3, 1000);

    if (projectId) {
      const userConfig = providerConfigFromBody(provider, providerConfig);
      await trackOutlineCompletion(
        user.id,
        projectId,
        provider,
        userConfig,
        outline.course?.stages?.length ?? config.stageCount
      );
    }

    return NextResponse.json(outline);
  } catch (error) {
    return internalError(error, 'generate/outline');
  }
}

