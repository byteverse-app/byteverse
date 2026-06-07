import { NextRequest, NextResponse } from 'next/server';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { AIProvider } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const { text, action, context, provider = 'platform', providerConfig }: {
      text: string;
      action: 'rewrite' | 'expand' | 'simplify' | 'summarize';
      context?: { courseTitle?: string; stageTitle?: string };
      provider?: AIProvider;
      providerConfig?: { apiKey?: string; baseUrl?: string; model?: string };
    } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!['rewrite', 'expand', 'simplify', 'summarize'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    const aiProvider = resolveProvider(provider, providerConfigFromBody(provider, providerConfig));
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not available' },
        { status: 500 }
      );
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (action) {
      case 'rewrite':
        systemPrompt = 'You are a professional content editor. Rewrite the given text to improve clarity, flow, and engagement while maintaining the original meaning and tone.';
        userPrompt = `Rewrite the following text:\n\n${text}`;
        break;
      case 'expand':
        systemPrompt = 'You are a content writer. Expand the given text by adding more detail, examples, and explanations while keeping it relevant and engaging.';
        userPrompt = `Expand the following text with more detail and examples:\n\n${text}`;
        break;
      case 'simplify':
        systemPrompt = 'You are an educational content writer. Simplify the given text to make it easier to understand for learners, using simpler language and shorter sentences.';
        userPrompt = `Simplify the following text for better understanding:\n\n${text}`;
        break;
      case 'summarize':
        systemPrompt = 'You are a content summarizer. Create a concise summary of the given text, capturing the key points and main ideas.';
        userPrompt = `Summarize the following text:\n\n${text}`;
        break;
    }

    if (context) {
      if (context.courseTitle) {
        userPrompt += `\n\nContext: This is from a course titled "${context.courseTitle}".`;
      }
      if (context.stageTitle) {
        userPrompt += ` This text is from the stage "${context.stageTitle}".`;
      }
    }

    let result;
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
          result = await aiProvider.chatCompletion([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ], {
            model,
            temperature: 0.7,
            maxTokens: 2000,
          });
          break;
        } catch (error) {
          lastError = error;
          console.log(`Model ${model} failed, trying next...`);
        }
      }

      if (!result) {
        throw lastError || new Error('All models failed');
      }
    } else {
      result = await aiProvider.chatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ], {
        temperature: 0.7,
        maxTokens: 2000,
      });
    }

    return NextResponse.json({
      result: result.content,
      action,
    });
  } catch (error) {
    return internalError(error, 'ai/transform-text');
  }
}
