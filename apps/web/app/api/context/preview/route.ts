import { NextRequest, NextResponse } from 'next/server';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { retrieveContext } from '@/lib/rag/retrieval';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'ai', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || 'course content topics main themes';
    const contextSessionId = searchParams.get('contextSessionId') || undefined;

    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);

    if (vectorStore.size() === 0) {
      return NextResponse.json({
        totalChunks: 0,
        topics: [],
        sampleChunks: [],
        message: 'No context available. Please upload files first.',
      });
    }

    const results = await retrieveContext(query, vectorStore, 10, false);

    const topics = new Set<string>();
    results.forEach(result => {
      const text = result.text.toLowerCase();
      const words = text.split(/\s+/).filter(w => w.length > 4);
      words.forEach(word => {
        if (word.length > 4 && !word.match(/^(the|this|that|with|from|about|which|their|there)/)) {
          topics.add(word);
        }
      });
    });

    const fileSources = new Set<string>();
    results.forEach(result => {
      if (result.metadata?.source) {
        fileSources.add(result.metadata.source);
      }
    });

    return NextResponse.json({
      totalChunks: vectorStore.size(),
      topics: Array.from(topics).slice(0, 20),
      sampleChunks: results.slice(0, 5).map(r => ({
        text: r.text.substring(0, 200) + '...',
        source: r.metadata?.source || 'Unknown',
        score: r.score,
      })),
      fileSources: Array.from(fileSources),
      message: `Found ${vectorStore.size()} chunks from ${fileSources.size} file(s)`,
    });
  } catch (error) {
    return internalError(error, 'context/preview');
  }
}
