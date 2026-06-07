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
    const { labId, state, contextSessionId: bodySessionId } = await request.json();
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

    // Retrieve broad context
    const allChunks = vectorStore.getAllChunks();
    const sampleText = allChunks.slice(0, 30).map(c => c.text).join('\n\n').substring(0, 8000);

    const prompt = `Based on the following content, create a comprehensive report that includes:

1. Executive Summary (2-3 paragraphs)
2. Key Findings (bullet points)
3. Main Topics Covered
4. Important Concepts
5. Conclusions and Recommendations

Content:
${sampleText}

Format as a structured report with clear sections.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert report writer. Create well-structured, professional reports.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await aiProvider.chatCompletion(messages, {
      model: MODELS.CHAT_FREE || 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
      temperature: 0.5,
      maxTokens: 3000,
    });

    return NextResponse.json({
      type: 'reports',
      content: response.content,
      generatedAt: Date.now(),
    });
  } catch (error) {
    return internalError(error, 'studio/reports');
  }
}
