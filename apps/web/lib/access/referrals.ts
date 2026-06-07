import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { getUserProfile } from './quota';

export function generateReferralCode(displayName: string): string {
  let base = (displayName.trim() || 'user')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (base.length > 12) {
    base = base.slice(0, 12);
  }

  const suffix = Math.random().toString(16).slice(2, 6);
  return `${base || 'user'}-${suffix}`;
}

/** Assign a referral code when missing (e.g. profiles created before migration 006). */
export async function ensureUserReferralCode(userId: string): Promise<string | null> {
  const profile = await getUserProfile(userId);
  if (!profile) return null;
  if (profile.referral_code) return profile.referral_code;

  const supabase = createServiceRoleSupabaseClient();
  const displayName = profile.display_name ?? 'user';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = generateReferralCode(
      attempt === 0 ? displayName : `${displayName}${Math.random()}`,
    );

    const { data, error } = await supabase
      .from('profiles')
      .update({ referral_code: code })
      .eq('id', userId)
      .is('referral_code', null)
      .select('referral_code')
      .maybeSingle();

    if (data?.referral_code) return data.referral_code;

    if (error?.code === '23505') continue;

    const refreshed = await getUserProfile(userId);
    if (refreshed?.referral_code) return refreshed.referral_code;
  }

  return (await getUserProfile(userId))?.referral_code ?? null;
}
