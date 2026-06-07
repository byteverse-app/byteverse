import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export const NPS_COOLDOWN_DAYS = 90;
export const NPS_REFERRAL_THRESHOLD = 3;
export const NPS_ACTIVE_DAYS_THRESHOLD = 3;
export const NPS_ACTIVE_WINDOW_DAYS = 30;

export type NpsEligibilityReason = 'first_course' | 'active_user' | 'community_builder';

export type NpsEligibilityResult = {
  eligible: boolean;
  reason?: NpsEligibilityReason;
};

function isWithinCooldown(lastNpsAt: string | null | undefined): boolean {
  if (!lastNpsAt) return false;
  const cooldownMs = NPS_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(lastNpsAt).getTime() < cooldownMs;
}

export async function checkNpsEligibility(userId: string): Promise<NpsEligibilityResult> {
  const supabase = createServiceRoleSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('last_nps_at')
    .eq('id', userId)
    .single();

  if (isWithinCooldown(profile?.last_nps_at)) {
    return { eligible: false };
  }

  const windowStart = new Date();
  windowStart.setUTCDate(windowStart.getUTCDate() - NPS_ACTIVE_WINDOW_DAYS);
  const windowStartIso = windowStart.toISOString();

  const [completedCourses, activeSessions, referralSignups] = await Promise.all([
    supabase
      .from('course_generation_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .not('fully_completed_at', 'is', null),
    supabase
      .from('course_generation_sessions')
      .select('updated_at')
      .eq('user_id', userId)
      .gte('updated_at', windowStartIso),
    supabase
      .from('referral_events')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('event', 'signup'),
  ]);

  if ((completedCourses.count ?? 0) >= 1) {
    return { eligible: true, reason: 'first_course' };
  }

  const activeDays = new Set(
    (activeSessions.data ?? []).map((row) =>
      new Date(row.updated_at as string).toISOString().slice(0, 10)
    )
  );
  if (activeDays.size >= NPS_ACTIVE_DAYS_THRESHOLD) {
    return { eligible: true, reason: 'active_user' };
  }

  if ((referralSignups.count ?? 0) >= NPS_REFERRAL_THRESHOLD) {
    return { eligible: true, reason: 'community_builder' };
  }

  return { eligible: false };
}

export async function recordNpsPrompt(userId: string): Promise<void> {
  const supabase = createServiceRoleSupabaseClient();
  await supabase
    .from('profiles')
    .update({ last_nps_at: new Date().toISOString() })
    .eq('id', userId);
}
