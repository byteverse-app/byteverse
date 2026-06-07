import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    return NextResponse.json({
      message: 'Analytics API - use client-side tracking for now',
      courseId,
    });
  } catch (error) {
    return internalError(error, 'analytics');
  }
}

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    await request.json();
    return NextResponse.json({
      success: true,
      message: 'Analytics event recorded (client-side storage)',
    });
  } catch (error) {
    return internalError(error, 'analytics');
  }
}
