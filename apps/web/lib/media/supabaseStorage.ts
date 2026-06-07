import { createClient } from '@/lib/supabase/client';

const BUCKET = 'course-media';

/** Upload media to Supabase Storage; returns signed URL via server API. */
export async function uploadMediaToStorage(
  userId: string,
  courseId: string,
  file: Blob,
  filename: string,
  contentType: string
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file, filename);
  formData.append('courseId', courseId);

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return data.url as string;
}

/** Convert data URL to Blob for upload. */
export function dataUrlToBlob(dataUrl: string): { blob: Blob; mimeType: string } {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return { blob: new Blob([bytes], { type: mimeType }), mimeType };
}

export { BUCKET };
