import { NextRequest, NextResponse } from 'next/server';
import { saveCourseToOutput } from '@/lib/utils/courseExporter';
import { CourseData, CourseConfig } from '@/types/course';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const body = await request.json();
    const { courseData, config, courseId }: { courseData: CourseData; config?: Partial<CourseConfig>; courseId?: string } = body;

    if (!courseData) {
      return NextResponse.json(
        { error: 'Course data is required' },
        { status: 400 }
      );
    }

    await saveCourseToOutput(courseData, config, courseId);

    return NextResponse.json({
      success: true,
      message: 'Course saved successfully',
    });
  } catch (error) {
    return internalError(error, 'course/save');
  }
}
