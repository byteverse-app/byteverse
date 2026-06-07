import { NextRequest, NextResponse } from 'next/server';
import { retrieveContext, formatContextForPrompt } from '@/lib/rag/retrieval';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { providerManager } from '@/lib/ai/providers';
import { ChatMessage } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { labId, state, language = 'English', contextSessionId: bodySessionId } = await request.json();
    const contextSessionId = bodySessionId || state?.contextSessionId;
    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);

    if (vectorStore.size() === 0) {
      return NextResponse.json(
        { error: 'No sources available. Please upload sources first.' },
        { status: 400 }
      );
    }

    const aiProvider = providerManager.getProvider('together');
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not available' },
        { status: 500 }
      );
    }

    const allChunks = vectorStore.getAllChunks();
    const sampleText = allChunks.slice(0, 30).map(c => c.text).join('\n\n').substring(0, 8000);

    const prompt = `Based on the following content, create an audio overview script that:
1. Provides a 3-5 minute spoken overview (approximately 500-800 words)
2. Introduces the main topics
3. Highlights key concepts
4. Concludes with a summary

Write in a conversational, engaging style suitable for audio narration.

Content:
${sampleText}

Language: ${language}

Create the script as plain text, ready for text-to-speech conversion.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert script writer for educational audio content. Create engaging, conversational scripts.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await aiProvider.chatCompletion(messages, {
      model: MODELS.CHAT_FREE || 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
      temperature: 0.7,
      maxTokens: 2000,
    });

    return NextResponse.json({
      type: 'audio',
      script: response.content,
      language,
      generatedAt: Date.now(),
    });
  } catch (error) {
    return internalError(error, 'studio/audio');
  }
}
