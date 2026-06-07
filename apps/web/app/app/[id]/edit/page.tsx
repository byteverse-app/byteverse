'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

/** Redirect legacy /edit route to canonical preview-editor */
export default function CourseEditorRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  useEffect(() => {
    if (courseId) {
      router.replace(`/app/${courseId}/preview-editor`);
    }
  }, [courseId, router]);

  return (
    <div className="min-h-screen bg-bg1 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent1 mx-auto mb-4" />
        <p className="text-text-secondary">Opening editor...</p>
      </div>
    </div>
  );
}
