import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { getUsageSnapshot, getUserProfile } from '@/lib/access/quota';
import { ensureUserReferralCode } from '@/lib/access/referrals';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { internalError } from '@/lib/api/errorResponse';
import { hasPasswordAuth } from '@/lib/auth/authMethod';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general');
  if (!authResult.ok) return authResult.response;

  try {
    const { user } = authResult.ctx;
    const snapshot = await getUsageSnapshot(user.id);
    const profile = await getUserProfile(user.id);
    const referralCode = profile?.referral_code ?? (await ensureUserReferralCode(user.id));

    const supabase = createServiceRoleSupabaseClient();
    const { data: tiers } = await supabase.from('access_tier_config').select('*');

    return NextResponse.json({
      usage: snapshot,
      profile: {
        email: user.email,
        authProvider: (user.app_metadata?.provider as string | undefined) ?? 'email',
        hasPasswordAuth: hasPasswordAuth(user),
        displayName: profile?.display_name,
        tier: profile?.access_tier,
        referralCode,
        creatorScore: profile?.creator_score ?? 0,
        streakCurrent: profile?.streak_current ?? 0,
        streakBest: profile?.streak_best ?? 0,
        signupCodeUsed: profile?.signup_code_used,
        bonusCredits: profile?.platform_credits_bonus ?? 0,
      },
      tiers: tiers ?? [],
    });
  } catch (error) {
    return internalError(error, 'access/usage');
  }
}
