import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { awardAchievement } from '@/lib/access/gamification';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    await awardAchievement(authResult.ctx.user.id, 'byok_pioneer');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalError(error, 'achievements/byok');
  }
}
