import { NextRequest, NextResponse } from 'next/server';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const searchParams = request.nextUrl.searchParams;
    const fileId = searchParams.get('fileId');
    const contextSessionId = searchParams.get('contextSessionId') || undefined;

    if (!fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      );
    }

    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    const allChunks = vectorStore.getAllChunks();
    const fileChunks = allChunks.filter(chunk => {
      const source = chunk.metadata?.source || '';
      return source.includes(fileId) || source === fileId;
    });

    if (fileChunks.length === 0) {
      return NextResponse.json(
        { error: 'File not found or no content available' },
        { status: 404 }
      );
    }

    const previewText = fileChunks
      .map(chunk => chunk.text)
      .join('\n\n')
      .substring(0, 5000);

    return NextResponse.json({
      content: previewText,
      totalChunks: fileChunks.length,
      previewLength: previewText.length,
    });
  } catch (error) {
    return internalError(error, 'files/preview');
  }
}
