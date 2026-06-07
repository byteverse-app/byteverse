import { NextRequest, NextResponse } from 'next/server';
import { retrieveContext, formatContextForPrompt } from '@/lib/rag/retrieval';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { AIProvider, ChatMessage, ProviderRequestConfig } from '@/lib/ai/providers/types';
import { PROVIDER_REGISTRY } from '@/lib/ai/providers/registry';
import { MODELS } from '@/lib/together/client';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';
import { chatBodySchema, parseJsonBody } from '@/lib/validation/apiSchemas';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const parsed = parseJsonBody(chatBodySchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { message, history, provider = 'together', providerConfig, uploadedFiles = [], contextSessionId } = parsed.data;

    const normalizedMessage = message.trim().toLowerCase();
    const approvalKeywords = ['approved', 'approve', 'looks good', 'sounds good', 'proceed', 'go ahead'];
    const isApproval = approvalKeywords.some(keyword =>
      normalizedMessage === keyword ||
      normalizedMessage.startsWith(keyword + ' ') ||
      normalizedMessage === keyword + '.'
    );

    if (isApproval && normalizedMessage.length < 50) {
      return NextResponse.json({
        response: '✓ Acknowledged. The outline has been approved and content generation will begin.',
      });
    }

    const aiProvider = resolveProvider(
      provider as AIProvider,
      providerConfigFromBody(provider as AIProvider, providerConfig)
    );
    if (!aiProvider) {
      return NextResponse.json(
        { error: `Provider "${provider}" is not configured. Add your API key in workspace settings.` },
        { status: 400 }
      );
    }

    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    let contextText = '';
    let fileListText = '';

    if (uploadedFiles.length > 0) {
      fileListText = `The user has uploaded the following files: ${uploadedFiles.map(f => f.name).join(', ')}. `;
    }

    if (vectorStore.size() > 0) {
      const results = await retrieveContext(message, vectorStore, 5, true);
      contextText = formatContextForPrompt(results, 2000);
    }

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are an expert instructional designer helping users create microlearning courses. 
${fileListText}${contextText ? `\n\nHere is relevant context extracted from the uploaded files:\n${contextText}\n\n` : uploadedFiles.length > 0 ? '\n\nYou have access to the content from these files and can reference them in your responses.\n\n' : ''}
Provide helpful, specific advice about course structure, learning objectives, content organization, and best practices for microlearning.
Be conversational and engaging. When the user mentions "the file" or "uploaded file", they are referring to the files listed above.`,
      },
      ...(history || []).slice(-10).map((msg: Record<string, unknown>) => ({
        role: msg.role as 'user' | 'assistant',
        content: String(msg.content ?? ''),
      })),
      { role: 'user', content: message },
    ];

    let response;
    let lastError;

    if (provider === 'together') {
      const modelsToTry = [
        'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        'openai/gpt-oss-20b',
        MODELS.CHAT_FREE,
        MODELS.CHAT,
      ];

      for (const model of modelsToTry) {
        try {
          response = await aiProvider.chatCompletion(messages, {
            model,
            temperature: 0.7,
            maxTokens: 2000,
          });
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!response) {
        throw lastError || new Error('All TogetherAI models failed');
      }
    } else {
      const meta = PROVIDER_REGISTRY[provider as AIProvider];
      response = await aiProvider.chatCompletion(messages, {
        model: providerConfig?.model || meta?.defaultModel,
        temperature: 0.7,
        maxTokens: 2000,
      });
    }

    return NextResponse.json({ response: response.content });
  } catch (error) {
    return internalError(error, 'chat');
  }
}
