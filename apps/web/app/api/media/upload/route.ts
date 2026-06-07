import { NextRequest, NextResponse } from 'next/server';
import { BUCKET, getSignedMediaUrl, verifyProjectOwnership, sanitizeFilename } from '@/lib/media/storageHelpers';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError, apiError } from '@/lib/api/errorResponse';

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/webm', 'audio/mpeg', 'audio/wav', 'application/pdf',
]);

const EDITOR_UPLOAD_PREFIX = 'editor-temp';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'upload', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;
  const { user, supabase } = authResult.ctx;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const courseId = formData.get('courseId') as string | null;

    if (!file || !courseId) {
      return apiError('file and courseId required', 400, 'media/upload');
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError('File exceeds maximum size of 50MB', 400, 'media/upload');
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return apiError('File type not allowed', 400, 'media/upload');
    }

    if (courseId !== EDITOR_UPLOAD_PREFIX) {
      const ownsProject = await verifyProjectOwnership(user.id, courseId);
      if (!ownsProject) {
        return apiError('Project not found', 403, 'media/upload');
      }
    }

    const safeName = sanitizeFilename(file.name);
    const path = `${user.id}/${courseId}/${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      return internalError(error, 'media/upload');
    }

    const url = await getSignedMediaUrl(path);
    return NextResponse.json({ url, path });
  } catch (error) {
    return internalError(error, 'media/upload');
  }
}
