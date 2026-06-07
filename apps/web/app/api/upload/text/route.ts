import { NextRequest, NextResponse } from 'next/server';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { chunkText } from '@/lib/rag/chunker';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';
import { textUploadSchema, parseJsonBody } from '@/lib/validation/apiSchemas';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const parsed = parseJsonBody(textUploadSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { text, filename = 'pasted-text.txt', contextSessionId } = parsed.data;

    if (text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Text content is too short (minimum 50 characters)' },
        { status: 400 }
      );
    }

    const chunks = chunkText(text, undefined, 200, filename);
    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    await vectorStore.addChunks(chunks);

    const safeFilename = filename.replace(/[^a-z0-9.-]/gi, '-') || 'pasted-text.txt';

    return NextResponse.json({
      success: true,
      filename: safeFilename,
      size: text.length,
      chunks: chunks.length,
      totalChunks: vectorStore.size(),
    });
  } catch (error) {
    return internalError(error, 'upload/text');
  }
}
