import { CourseCreationState } from '@/types/courseCreation';
import { Chunk } from '@/lib/rag/chunker';

export function buildSourceChunksFromState(state: CourseCreationState): Chunk[] {
  return state.uploadedFiles.flatMap((f) =>
    (f.chunks || []).map((c, ci) => ({
      text: c.text,
      index: c.metadata?.chunkIndex ?? ci,
      metadata: { source: f.name, ...(c.metadata || {}) },
    }))
  );
}

export async function fetchWithAbortSignal(
  url: string,
  options: RequestInit,
  signal?: AbortSignal
): Promise<Response> {
  const response = await fetch(url, { ...options, signal });
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return response;
}
