import { NextRequest, NextResponse } from 'next/server';
import { providerManager } from '@/lib/ai/providers';
import { AIProvider } from '@/lib/ai/providers/types';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const { chatHistory, provider = 'together' }: { chatHistory: string; provider?: AIProvider } = await request.json();

    const aiProvider = providerManager.getProvider(provider);
    if (!aiProvider) {
      return NextResponse.json({ insights: null });
    }

    const prompt = `Extract course configuration insights from this conversation. Return ONLY a JSON object with these fields if mentioned:
- suggestedTitle: string (course title)
- suggestedTopic: string (main topic)
- suggestedDescription: string (brief description)
- suggestedObjectives: string[] (learning objectives as array)
- suggestedTargetAudience: string (target audience)
- suggestedStageCount: number (number of stages)
- suggestedContentStyle: "formal" | "conversational" | "technical"

Conversation:
${chatHistory}

Return ONLY the JSON object, no other text.`;

    const response = await aiProvider.chatCompletion([
      {
        role: 'system',
        content: 'You are a data extraction assistant. Extract structured information from conversations and return ONLY valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ], {
      temperature: 0.3,
      maxTokens: 1000,
      responseFormat: 'json_object',
    });

    try {
      const insights = JSON.parse(response.content);
      return NextResponse.json({ insights });
    } catch {
      return NextResponse.json({ insights: null });
    }
  } catch (error) {
    return internalError(error, 'extract-insights');
  }
}
