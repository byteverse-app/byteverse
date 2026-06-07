import { redeemInviteCode, validateInviteCode } from '@/lib/access/inviteCodes';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export async function applyInviteToProfile(
  userId: string,
  rawCode: string
): Promise<{ ok: boolean; error?: string; alreadyApplied?: boolean }> {
  const supabase = createServiceRoleSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('signup_code_used, access_tier, platform_credits_bonus, referred_by')
    .eq('id', userId)
    .single();

  if (profile?.signup_code_used) {
    return { ok: true, alreadyApplied: true };
  }

  const validation = await validateInviteCode(rawCode);
  if (!validation.valid) {
    return { ok: false, error: validation.error };
  }

  await supabase
    .from('profiles')
    .update({
      access_tier: validation.grantsTier ?? 'default',
      platform_credits_bonus:
        (profile?.platform_credits_bonus ?? 0) + (validation.bonusCredits ?? 0),
      referred_by: validation.referrerId ?? profile?.referred_by,
      signup_code_used: validation.code ?? rawCode,
    })
    .eq('id', userId);

  await redeemInviteCode(userId, rawCode);

  return { ok: true };
}
