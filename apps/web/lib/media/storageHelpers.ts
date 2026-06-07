import { createClient } from '@/lib/supabase/server';

const BUCKET = 'course-media';
const SIGNED_URL_TTL = 3600;

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 200);
}

/** Server-side signed URL for uploaded media. */
export async function getSignedMediaUrl(path: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);

  if (error || !data?.signedUrl) {
    throw new Error('Failed to create signed URL');
  }
  return data.signedUrl;
}

/** Verify the project belongs to the authenticated user before upload. */
export async function verifyProjectOwnership(userId: string, courseId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', courseId)
    .eq('user_id', userId)
    .maybeSingle();

  return !error && !!data;
}

export { BUCKET, SIGNED_URL_TTL, sanitizeFilename };
