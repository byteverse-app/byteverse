import { NextRequest, NextResponse } from 'next/server';
import { buildContentPrompt } from '@/lib/prompts/contentPrompt';
import { retrieveContext, formatContextForPrompt } from '@/lib/rag/retrieval';
import { getVectorStoreForRequest, ensureSessionVectorStore } from '@/lib/rag/sessionVectorStore';
import { Chunk } from '@/lib/rag/chunker';
import { CourseConfig } from '@/types/course';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { validateJSONCompleteness, retryWithBackoff } from '@/lib/ai/qualityGuardrails';
import { AIProvider, ProviderRequestConfig } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { validateContent } from '@/lib/validation/contentValidator';
import { fetchImageForContent } from '@/lib/media/imageFetcher';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';
import { trackContentStageCompletion } from '@/lib/access/generationSessions';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const {
      config,
      stage,
      provider = 'platform',
      providerConfig,
      contextSessionId,
      sourceChunks = [],
      projectId,
      stageIndex,
      totalStages,
    }: {
      config: CourseConfig;
      stage: { id: number; title: string; objective: string; keyPoints: string[] };
      provider?: AIProvider;
      providerConfig?: ProviderRequestConfig;
      contextSessionId?: string;
      sourceChunks?: Chunk[];
      projectId?: string;
      stageIndex?: number;
      totalStages?: number;
    } = await request.json();

    const aiProvider = resolveProvider(provider, providerConfigFromBody(provider, providerConfig));
    if (!aiProvider) {
      return NextResponse.json(
        { error: `Provider "${provider}" is not configured. Add your API key in workspace settings.` },
        { status: 400 }
      );
    }

    let contextText = '';
    const vectorStore = contextSessionId
      ? await ensureSessionVectorStore(user.id, contextSessionId, sourceChunks)
      : getVectorStoreForRequest(user.id, contextSessionId);
    if (vectorStore.size() > 0) {
      const query = `${stage.title} ${stage.objective} ${stage.keyPoints.join(' ')}`;
      const results = await retrieveContext(query, vectorStore, 3, true);
      contextText = formatContextForPrompt(results, 1500);
    }

    // Build prompt
    const prompt = buildContentPrompt(config, stage, contextText);

    // Generate content with retry and validation
    const content = await retryWithBackoff(async () => {
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
            result = await aiProvider.generateJSON<{
              introduction: string;
              sections: any[];
              summary: string;
              interactiveElements: any[];
              sideCard: any;
            }>(
              [
                {
                  role: 'system',
                  content:
                    'You are an expert instructional designer creating engaging microlearning content. You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. The response must be a valid JSON object matching the requested structure exactly. Start your response with { and end with }.',
                },
                {
                  role: 'user',
                  content: prompt + '\n\nIMPORTANT: Respond with ONLY valid JSON. No explanations, no text before or after. Just the JSON object.',
                },
              ],
              {
                model,
                temperature: 0.3,
                maxTokens: 8000,
                retries: 1,
              }
            );
            console.log(`Content generation succeeded with model: ${model}`);
            break;
          } catch (error) {
            lastError = error;
            console.log(`Model ${model} failed for content, trying next...`);
          }
        }
        
        if (!result) {
          throw lastError || new Error('All models failed for content generation');
        }
      } else {
        result = await aiProvider.generateJSON<{
          introduction: string;
          sections: any[];
          summary: string;
          interactiveElements: any[];
          sideCard: any;
        }>(
          [
            {
              role: 'system',
              content:
                'You are an expert instructional designer creating engaging microlearning content. You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON. The response must be a valid JSON object matching the requested structure exactly. Start your response with { and end with }.',
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

      // Validate completeness
      const validation = validateJSONCompleteness(result, ['introduction', 'sections', 'summary'], [
        { field: 'sections', required: ['heading', 'content'] },
      ]);

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Enhanced content quality validation
      const errors: string[] = [];

      // Introduction validation
      if (!result.introduction || result.introduction.length < 100) {
        errors.push(`Introduction must be at least 100 characters (got ${result.introduction?.length || 0})`);
      }

      // Sections validation
      if (!result.sections || result.sections.length < 2) {
        errors.push(`Must have at least 2 sections (got ${result.sections?.length || 0})`);
      } else {
        // Validate each section has meaningful content
        result.sections.forEach((section: any, index: number) => {
          if (!section.heading || section.heading.length < 5) {
            errors.push(`Section ${index + 1} heading is too short or missing`);
          }
          if (!section.content || section.content.length < 50) {
            errors.push(`Section ${index + 1} content is too short (minimum 50 characters)`);
          }
        });
      }

      // Quiz validation
      if (result.interactiveElements && result.interactiveElements.length > 0) {
        result.interactiveElements.forEach((element: any, index: number) => {
          if (element.type === 'quiz' && element.data) {
            const quiz = element.data;
            if (!quiz.question || quiz.question.length < 10) {
              errors.push(`Quiz ${index + 1} question is too short or missing`);
            }
            if (!quiz.options || !Array.isArray(quiz.options) || quiz.options.length < 3) {
              errors.push(`Quiz ${index + 1} must have at least 3 options (got ${quiz.options?.length || 0})`);
            } else {
              // Validate each option is meaningful (not just letters)
              quiz.options.forEach((option: string, optIndex: number) => {
                if (!option || option.length < 10) {
                  errors.push(`Quiz ${index + 1} option ${optIndex + 1} is too short or just a letter (minimum 10 characters)`);
                }
                // Check if option is just a single letter (A, B, C, D)
                if (option.trim().length === 1 && /^[A-Z]$/.test(option.trim())) {
                  errors.push(`Quiz ${index + 1} option ${optIndex + 1} is just a letter "${option}" - must be a meaningful answer`);
                }
              });
            }
            if (!quiz.correctAnswer) {
              errors.push(`Quiz ${index + 1} missing correctAnswer`);
            }
          }
        });
      }

      if (errors.length > 0) {
        throw new Error(`Content quality validation failed: ${errors.join('; ')}`);
      }

      return result;
    }, 3, 1000);

    // Content validation (if enabled)
    let validationResult = null;
    const enableValidation = config.enableContentValidation !== false; // Default to true
    if (enableValidation) {
      try {
        validationResult = await validateContent(
          {
            introduction: content.introduction,
            sections: content.sections,
            summary: content.summary,
          },
          config.topic,
          enableValidation
        );

        // Log validation issues but don't fail generation
        if (!validationResult.isValid && validationResult.issues.length > 0) {
          console.warn('Content validation found issues:', validationResult.issues);
        }
      } catch (error) {
        console.error('Content validation error (non-blocking):', error);
        // Continue without validation if it fails
      }
    }

    // Image fetching (if enabled)
    const enableAutoImages = config.enableAutoImages !== false; // Default to true
    const imageProvider = config.imageProvider || 'both';
    
    if (enableAutoImages && content.sections) {
      try {
        // Fetch images sequentially with delays to avoid rate limits
        const imageResults: Array<{ heading: string; image: any } | null> = [];
        
        for (const section of content.sections) {
          try {
            // Add delay between image fetches to respect API rate limits
            if (imageResults.length > 0) {
              await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
            }
            
            const image = await fetchImageForContent(
              section.content,
              section.heading,
              imageProvider
            );
            
            if (image) {
              imageResults.push({
                heading: section.heading,
                image: {
                  url: image.url,
                  thumbnailUrl: image.thumbnailUrl,
                  attribution: image.attribution,
                  photographer: image.photographer,
                  photographerUrl: image.photographerUrl,
                  width: image.width,
                  height: image.height,
                  provider: image.provider,
                },
              });
            } else {
              imageResults.push(null);
            }
          } catch (error) {
            console.error(`Error fetching image for section "${section.heading}":`, error);
            imageResults.push(null);
          }
        }
        
        // Add images to sections
        imageResults.forEach((result) => {
          if (result) {
            const section = content.sections.find((s: any) => s.heading === result.heading);
            if (section && result.image) {
              section.image = result.image;
            }
          }
        });
      } catch (error) {
        console.error('Image fetching error (non-blocking):', error);
        // Continue without images if fetching fails
      }
    }

    let completionMeta = null;
    if (projectId) {
      const userConfig = providerConfigFromBody(provider, providerConfig);
      completionMeta = await trackContentStageCompletion(
        user.id,
        projectId,
        provider,
        userConfig,
        stageIndex,
        totalStages
      );

      if (completionMeta.quotaExceeded) {
        return NextResponse.json(
          {
            error: 'Platform quota exceeded. Add your API key in settings for unlimited creation.',
            code: 'QUOTA_EXCEEDED',
            resetAt: completionMeta.resetAt,
            upsell: 'settings',
            ...content,
            validated: validationResult?.isValid ?? true,
            validationResult: validationResult,
          },
          { status: 402 }
        );
      }
    }

    return NextResponse.json({
      ...content,
      validated: validationResult?.isValid ?? true,
      validationResult: validationResult,
      completion: completionMeta,
    });
  } catch (error) {
    return internalError(error, 'generate/content');
  }
}

