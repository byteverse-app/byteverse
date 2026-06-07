import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/parsers/pdfParser';
import { parseDOCX } from '@/lib/parsers/docxParser';
import { parseFileByExtension } from '@/lib/parsers/textParser';
import { chunkText } from '@/lib/rag/chunker';
import { getSessionVectorStore, clearSessionVectorStore } from '@/lib/rag/sessionVectorStore';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_EXTENSIONS = new Set(['pdf', 'docx', 'txt', 'md']);

interface ContentQuality {
  score: number;
  textLength: number;
  hasHeadings: boolean;
  hasParagraphs: boolean;
  wordCount: number;
  suggestions: string[];
}

function analyzeContentQuality(text: string): ContentQuality {
  const textLength = text.length;
  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length;
  const hasHeadings = /^#+\s|^[A-Z][^\n]{0,100}$/m.test(text) ||
                      /<h[1-6]|Heading|Chapter|Section/i.test(text);
  const hasParagraphs = text.split(/\n\n/).length > 3 ||
                        text.split(/\.\s+/).length > 5;

  let score = 0;
  const suggestions: string[] = [];

  if (textLength >= 2000) score += 30;
  else if (textLength >= 1000) { score += 20; suggestions.push('Document is relatively short.'); }
  else if (textLength >= 500) { score += 10; suggestions.push('Document is quite short.'); }
  else suggestions.push('Document is very short.');

  if (wordCount >= 500) score += 20;
  else if (wordCount >= 250) score += 15;
  else if (wordCount >= 100) score += 10;
  else suggestions.push('Low word count.');

  if (hasHeadings && hasParagraphs) score += 30;
  else if (hasHeadings || hasParagraphs) score += 15;

  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 3) wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  const maxFreq = Math.max(...Object.values(wordFreq), 0);
  const uniqueWords = Object.keys(wordFreq).length;
  const diversity = words.length > 0 ? uniqueWords / words.length : 0;

  if (diversity > 0.3 && maxFreq < words.length * 0.1) score += 20;
  else if (diversity > 0.2) score += 10;

  score = Math.min(100, Math.max(0, score));

  return { score, textLength, hasHeadings, hasParagraphs, wordCount, suggestions };
}

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const clearExisting = formData.get('clearExisting') === 'true';
    const contextSessionId = (formData.get('contextSessionId') as string) || 'default';

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const vectorStore = getSessionVectorStore(user.id, contextSessionId);

    if (clearExisting) {
      vectorStore.clear();
    }

    const processedFiles = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: `File too large: ${file.name}` }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return NextResponse.json({ error: `Unsupported file type: ${extension}` }, { status: 400 });
      }

      let text = '';
      if (extension === 'pdf') text = await parsePDF(buffer);
      else if (extension === 'docx') text = await parseDOCX(buffer);
      else text = await parseFileByExtension(buffer.toString('utf-8'), `.${extension}`);

      const qualityAnalysis = analyzeContentQuality(text);
      const chunks = chunkText(text, undefined, 200, file.name);
      await vectorStore.addChunks(chunks);

      processedFiles.push({
        name: file.name,
        size: file.size,
        chunks: chunks.length,
        textLength: text.length,
        quality: qualityAnalysis,
      });
    }

    return NextResponse.json({
      success: true,
      files: processedFiles,
      totalChunks: vectorStore.size(),
    });
  } catch (error) {
    return internalError(error, 'upload');
  }
}

export async function DELETE(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user } = authResult.ctx;

  try {
    const { searchParams } = new URL(request.url);
    const contextSessionId = searchParams.get('contextSessionId') || 'default';
    clearSessionVectorStore(user.id, contextSessionId);
    return NextResponse.json({ success: true, message: 'Vector store cleared successfully' });
  } catch (error) {
    return internalError(error, 'upload/clear');
  }
}
