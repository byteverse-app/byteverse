import { NextRequest, NextResponse } from 'next/server';
import { CourseData, CourseConfig } from '@/types/course';
import { createSCORMPackage } from '@/lib/scorm/scormPackager';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const body = await request.json();
    const { courseData, config }: { courseData: CourseData; config?: CourseConfig } = body;

    if (!courseData || !config) {
      return NextResponse.json(
        { error: 'Course data and config are required' },
        { status: 400 }
      );
    }

    const scormPackage = await createSCORMPackage(courseData, config as CourseConfig);

    const safeTitle = (courseData.course.title || 'course').replace(/[^a-z0-9]/gi, '-').toLowerCase();

    return new NextResponse(new Uint8Array(scormPackage), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${safeTitle}-scorm.zip"`,
      },
    });
  } catch (error) {
    return internalError(error, 'export/scorm');
  }
}
