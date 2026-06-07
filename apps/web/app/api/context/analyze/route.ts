import { NextRequest, NextResponse } from 'next/server';
import { getVectorStoreForRequest } from '@/lib/rag/sessionVectorStore';
import { embedText } from '@/lib/together/embeddings';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { parseFileByExtension } from '@/lib/parsers/textParser';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const contextSessionId = (formData.get('contextSessionId') as string) || undefined;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const vectorStore = getVectorStoreForRequest(user.id, contextSessionId);
    const existingChunks = vectorStore.getAllChunks();
    if (existingChunks.length === 0) {
      return NextResponse.json({
        related: false,
        similarity: 0,
        suggestion: 'clear',
        reason: 'No existing context found. This will start a fresh session.',
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    let text = '';

    if (extension === 'pdf') {
      text = await parsePDF(buffer);
    } else if (extension === 'docx') {
      text = await parseDOCX(buffer);
    } else if (extension === 'txt' || extension === 'md') {
      text = await parseFileByExtension(buffer.toString('utf-8'), `.${extension}`);
    } else {
      return NextResponse.json(
        { error: `Unsupported file type: ${extension}` },
        { status: 400 }
      );
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'File appears to be empty or could not be parsed' },
        { status: 400 }
      );
    }

    const sampleText = text.substring(0, 2000);
    const newFileEmbedding = await embedText(sampleText);

    let maxSimilarity = 0;
    let totalSimilarity = 0;
    let comparedCount = 0;

    const sampleSize = Math.min(10, existingChunks.length);
    const sampledChunks = existingChunks
      .sort(() => Math.random() - 0.5)
      .slice(0, sampleSize);

    for (const chunk of sampledChunks) {
      const similarity = cosineSimilarity(newFileEmbedding, chunk.embedding);
      maxSimilarity = Math.max(maxSimilarity, similarity);
      totalSimilarity += similarity;
      comparedCount++;
    }

    const avgSimilarity = comparedCount > 0 ? totalSimilarity / comparedCount : 0;
    const finalSimilarity = Math.max(maxSimilarity, avgSimilarity * 0.8);

    const related = finalSimilarity >= 0.6;
    const suggestion = related ? 'merge' : 'clear';

    let reason = '';
    if (related) {
      reason = `This file appears related to your existing context (${(finalSimilarity * 100).toFixed(0)}% similarity). You can merge it with existing files or start fresh.`;
    } else {
      reason = `This file appears unrelated to your existing context (${(finalSimilarity * 100).toFixed(0)}% similarity). Starting fresh is recommended to avoid confusion.`;
    }

    return NextResponse.json({
      related,
      similarity: finalSimilarity,
      suggestion,
      reason,
    });
  } catch (error) {
    return internalError(error, 'context/analyze');
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) {
    return 0;
  }

  return dotProduct / (magA * magB);
}
