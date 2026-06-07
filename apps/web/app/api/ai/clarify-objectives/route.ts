import { NextRequest, NextResponse } from 'next/server';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { AIProvider } from '@/lib/ai/providers/types';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { retrieveContext, formatContextForPrompt } from '@/lib/rag/retrieval';
import { ChatMessage } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { chatHistory, uploadedFiles = [], contextSessionId, provider = 'platform', providerConfig } = await request.json();

    const aiProvider = resolveProvider(provider as AIProvider, providerConfigFromBody(provider, providerConfig));
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not available' },
        { status: 500 }
      );
    }

    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    let contextText = '';
    if (vectorStore.size() > 0) {
      const results = await retrieveContext('course objectives learning goals', vectorStore, 3, false);
      contextText = formatContextForPrompt(results, 1000);
    }

    const clarificationPrompt = `You are an expert instructional designer helping create a microlearning course.

${contextText ? `Content context from uploaded files:\n${contextText}\n\n` : ''}
${uploadedFiles.length > 0 ? `The user has uploaded: ${uploadedFiles.map((f: { name: string }) => f.name).join(', ')}\n\n` : ''}
Based on the conversation history, identify what information is still needed to create an effective course. Generate 3-5 specific, actionable clarification questions that will help define:

1. Learning objectives and goals
2. Target audience characteristics
3. Course duration and format preferences
4. Content style and tone
5. Assessment and interaction needs

${chatHistory && chatHistory.length > 0 ? `Recent conversation:\n${chatHistory.slice(-5).map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`).join('\n')}\n\n` : ''}

Generate questions that are:
- Specific and actionable
- Based on what's already been discussed (don't repeat)
- Focused on missing critical information
- Conversational and helpful

Return ONLY the questions, one per line, formatted as a simple list.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert instructional designer. Generate specific, actionable clarification questions to help create effective microlearning courses.',
      },
      {
        role: 'user',
        content: clarificationPrompt,
      },
    ];

    let response;
    try {
      response = await aiProvider.chatCompletion(messages, {
        model: MODELS.CHAT_FREE || 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        temperature: 0.7,
        maxTokens: 500,
      });
    } catch (error) {
      console.error('Clarification questions generation failed:', error);
      return NextResponse.json({
        questions: [
          'What are the main learning objectives for this course?',
          'Who is your target audience?',
          'How long should each learning module be?',
          'What style of content do you prefer (formal, conversational, technical)?',
        ],
      });
    }

    const content = String(response.content || response);
    const questions = content
      .split('\n')
      .map((q: string) => q.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
      .filter((q: string) => q.length > 10 && q.endsWith('?'))
      .slice(0, 5);

    if (questions.length === 0) {
      questions.push(
        'What are the main learning objectives for this course?',
        'Who is your target audience?',
        'How long should each learning module be?',
      );
    }

    return NextResponse.json({
      questions,
    });
  } catch (error) {
    return internalError(error, 'ai/clarify-objectives');
  }
}
