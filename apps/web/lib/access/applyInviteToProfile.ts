import { redeemInviteCode, validateInviteCode } from '@/lib/access/inviteCodes';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export async function ensureInviteRedeemed(
  userId: string,
  rawCode: string
): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  const validation = await validateInviteCode(rawCode);
  if (!validation.valid) return;

  if (validation.type === 'referral' && validation.referrerId) {
    const { count } = await supabase
      .from('referral_events')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', validation.referrerId)
      .eq('referee_id', userId)
      .eq('event', 'signup');

    if ((count ?? 0) > 0) return;
  }

  await redeemInviteCode(userId, rawCode);
}

export async function applyInviteToProfile(
  userId: string,
  rawCode: string
): Promise<{ ok: boolean; error?: string; alreadyApplied?: boolean }> {
  const supabase = createServiceRoleSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('signup_code_used, access_tier, referred_by, platform_credits_bonus')
    .eq('id', userId)
    .single();

  if (profile?.signup_code_used) {
    await ensureInviteRedeemed(userId, profile.signup_code_used);
    return { ok: true, alreadyApplied: true };
  }

  const validation = await validateInviteCode(rawCode);
  if (!validation.valid) {
    return { ok: false, error: validation.error };
  }

  const bonusCredits = validation.bonusCredits ?? 0;

  await supabase
    .from('profiles')
    .update({
      access_tier: validation.grantsTier ?? 'default',
      referred_by: validation.referrerId ?? profile?.referred_by,
      signup_code_used: validation.code ?? rawCode,
      platform_credits_bonus: (profile?.platform_credits_bonus ?? 0) + bonusCredits,
    })
    .eq('id', userId);

  await redeemInviteCode(userId, rawCode);

  return { ok: true };
}
