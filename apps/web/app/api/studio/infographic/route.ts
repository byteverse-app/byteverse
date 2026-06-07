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

    const allChunks = vectorStore.getAllChunks();
    const sampleText = allChunks.slice(0, 30).map(c => c.text).join('\n\n').substring(0, 7000);

    const prompt = `Based on the following content, create an infographic data structure with:
- title: Main title
- sections: Array of sections, each with:
  - heading: Section heading
  - data: Key statistics, facts, or points
  - visualType: Suggested visual type (chart, diagram, icon, etc.)

Content:
${sampleText}

Return ONLY valid JSON in this format:
{
  "title": "Infographic Title",
  "sections": [
    {
      "heading": "Section 1",
      "data": ["Fact 1", "Fact 2", "Fact 3"],
      "visualType": "chart"
    }
  ]
}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at creating infographic data structures. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const response = await aiProvider.chatCompletion(messages, {
      model: MODELS.CHAT_FREE || 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
      temperature: 0.6,
      maxTokens: 2000,
    });

    let infographic;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        infographic = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      infographic = {
        title: 'Infographic',
        sections: [
          {
            heading: 'Section 1',
            data: ['Key point 1', 'Key point 2'],
            visualType: 'chart',
          },
        ],
      };
    }

    return NextResponse.json({
      type: 'infographic',
      data: infographic,
      generatedAt: Date.now(),
    });
  } catch (error) {
    return internalError(error, 'studio/infographic');
  }
}
