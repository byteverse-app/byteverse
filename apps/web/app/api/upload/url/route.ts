import { NextRequest, NextResponse } from 'next/server';
import { safeFetch } from '@/lib/security/ssrfGuard';
import { chunkText } from '@/lib/rag/chunker';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';
import { urlUploadSchema, parseJsonBody } from '@/lib/validation/apiSchemas';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const parsed = parseJsonBody(urlUploadSchema, await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { url, contextSessionId } = parsed.data;

    const fetchResponse = await safeFetch(url);
    if (!fetchResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch URL' },
        { status: fetchResponse.status }
      );
    }

    const html = await fetchResponse.text();
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!textContent || textContent.length < 100) {
      return NextResponse.json(
        { error: 'Unable to extract meaningful content from URL' },
        { status: 400 }
      );
    }

    const urlObj = new URL(url);
    const chunks = chunkText(textContent, undefined, 200, url);
    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    await vectorStore.addChunks(chunks);

    const filename = urlObj.pathname.split('/').pop() || 'webpage.txt';
    const safeFilename = filename.replace(/[^a-z0-9.-]/gi, '-');

    return NextResponse.json({
      success: true,
      filename: safeFilename,
      size: textContent.length,
      chunks: chunks.length,
      totalChunks: vectorStore.size(),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('not allowed')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return internalError(error, 'upload/url');
  }
}
