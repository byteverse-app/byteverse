import { NextRequest, NextResponse } from 'next/server';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { providerManager } from '@/lib/ai/providers';
import { ChatMessage } from '@/lib/ai/providers/types';
import { MODELS } from '@/lib/together/client';
import { markdownToSafeHtml } from '@/lib/security/sanitizeHtml';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { searchParams } = new URL(request.url);
    const contextSessionId = searchParams.get('contextSessionId') || undefined;
    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);

    if (vectorStore.size() === 0) {
      return NextResponse.json({
        summary: '',
        relatedTopics: [],
        suggestedQuestions: [],
      });
    }

    const allChunks = vectorStore.getAllChunks();
    const sampleChunks = allChunks.slice(0, 20);
    const sampleText = sampleChunks.map(c => c.text).join('\n\n').substring(0, 5000);

    const aiProvider = providerManager.getProvider('together');
    if (!aiProvider) {
      return NextResponse.json(
        { error: 'AI provider not available' },
        { status: 500 }
      );
    }

    const guidePrompt = `Based on the following content from uploaded sources, create a concise source guide that:

1. Provides a 2-3 paragraph summary of the main topics and themes
2. Identifies 3-5 key terms or concepts (bold these in markdown format: **term**)
3. Lists 3-5 related topics or sub-disciplines
4. Suggests 3 thoughtful questions that would help someone explore this content

Content sample:
${sampleText}

Format your response as JSON with this structure:
{
  "summary": "A 2-3 paragraph summary with **key terms** in bold markdown format",
  "relatedTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "suggestedQuestions": ["Question 1?", "Question 2?", "Question 3?"]
}`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: 'You are an expert at analyzing and summarizing educational content. Always respond with valid JSON only, no additional text.',
      },
      {
        role: 'user',
        content: guidePrompt,
      },
    ];

    let response;
    try {
      response = await aiProvider.chatCompletion(messages, {
        model: MODELS.CHAT_FREE || 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
        temperature: 0.5,
        maxTokens: 1500,
      });
    } catch (error) {
      console.error('AI guide generation failed, using fallback:', error);
      const sources = new Set(allChunks.map(c => c.metadata?.source).filter(Boolean));
      return NextResponse.json({
        summary: `This content contains ${allChunks.length} chunks from ${sources.size} source(s). Upload more sources or ask questions to explore the content.`,
        relatedTopics: [],
        suggestedQuestions: [
          'What are the main topics covered in these sources?',
          'Can you summarize the key concepts?',
          'What questions should I explore further?',
        ],
      });
    }

    let guideData;
    try {
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        guideData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse guide JSON:', parseError);
      guideData = {
        summary: response.content.substring(0, 500),
        relatedTopics: [],
        suggestedQuestions: [
          'What are the main topics covered?',
          'Can you explain the key concepts?',
          'What should I explore further?',
        ],
      };
    }

    return NextResponse.json({
      summary: markdownToSafeHtml(guideData.summary || ''),
      relatedTopics: guideData.relatedTopics || [],
      suggestedQuestions: guideData.suggestedQuestions || [],
    });
  } catch (error) {
    return internalError(error, 'context/guide');
  }
}
