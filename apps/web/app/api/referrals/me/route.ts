import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { getReferralStats } from '@/lib/access/gamification';
import { ensureUserReferralCode } from '@/lib/access/referrals';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general');
  if (!authResult.ok) return authResult.response;

  try {
    const { user } = authResult.ctx;
    const referralCode = await ensureUserReferralCode(user.id);
    const stats = await getReferralStats(user.id);
    const origin = request.nextUrl.origin;

    return NextResponse.json({
      referralCode,
      referralLink: referralCode
        ? `${origin}/signup?ref=${encodeURIComponent(referralCode)}`
        : null,
      stats,
      rewards: {
        refereeSignupBonus: 2,
        refereeFirstCourseBonus: 1,
        referrerFirstCourseBonus: 3,
      },
    });
  } catch (error) {
    return internalError(error, 'referrals/me');
  }
}
