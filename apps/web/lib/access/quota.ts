import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

import type { AccessTier, TierConfig, UsageSnapshot } from './types';



function currentMonth(): string {

  const now = new Date();

  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

}



export async function getTierConfig(tier: AccessTier): Promise<TierConfig | null> {

  const supabase = createServiceRoleSupabaseClient();

  const { data } = await supabase

    .from('access_tier_config')

    .select('*')

    .eq('tier', tier)

    .maybeSingle();

  return data as TierConfig | null;

}



export async function getUserProfile(userId: string) {

  const supabase = createServiceRoleSupabaseClient();

  const { data } = await supabase

    .from('profiles')

    .select('access_tier, platform_credits_bonus, referred_by, referral_code, display_name, creator_score, streak_current, streak_best, signup_code_used, onboarding_completed_at')

    .eq('id', userId)

    .single();

  return data;

}



export async function getUsageSnapshot(userId: string): Promise<UsageSnapshot> {

  const profile = await getUserProfile(userId);

  const tier = (profile?.access_tier ?? 'default') as AccessTier;

  const tierConfig = await getTierConfig(tier);

  const supabase = createServiceRoleSupabaseClient();

  const month = currentMonth();



  const [{ data: window }, { data: monthly }] = await Promise.all([

    supabase.from('platform_usage_windows').select('*').eq('user_id', userId).maybeSingle(),

    supabase.from('platform_usage_monthly').select('*').eq('user_id', userId).eq('month', month).maybeSingle(),

  ]);



  const rollingHours = tierConfig?.rolling_window_hours ?? 24;

  let dailyUsed = 0;

  let windowStartedAt: string | null = null;

  let windowResetsAt: string | null = null;



  if (window?.window_started_at) {

    const started = new Date(window.window_started_at);

    const elapsed = Date.now() - started.getTime();

    const windowMs = rollingHours * 60 * 60 * 1000;

    if (elapsed < windowMs) {

      dailyUsed = window.courses_completed ?? 0;

      windowStartedAt = window.window_started_at;

      windowResetsAt = new Date(started.getTime() + windowMs).toISOString();

    }

  }



  const monthlyUsed = monthly?.courses_completed ?? 0;



  return {

    tier,

    dailyLimit: null,

    monthlyLimit: null,

    dailyUsed,

    monthlyUsed,

    bonusCredits: profile?.platform_credits_bonus ?? 0,

    dailyRemaining: null,

    monthlyRemaining: null,

    windowStartedAt,

    windowResetsAt,

    isUnlimited: true,

  };

}



/** Record platform AI usage for analytics — never blocks generation. */

export async function recordPlatformUsage(userId: string): Promise<void> {

  const supabase = createServiceRoleSupabaseClient();

  const month = currentMonth();

  const now = new Date().toISOString();



  const { data: window } = await supabase

    .from('platform_usage_windows')

    .select('*')

    .eq('user_id', userId)

    .maybeSingle();



  const profile = await getUserProfile(userId);

  const tier = (profile?.access_tier ?? 'default') as AccessTier;

  const tierConfig = await getTierConfig(tier);

  const rollingHours = tierConfig?.rolling_window_hours ?? 24;

  const windowMs = rollingHours * 60 * 60 * 1000;



  let newCount = 1;

  let windowStart = now;



  if (window?.window_started_at) {

    const started = new Date(window.window_started_at);

    if (Date.now() - started.getTime() < windowMs) {

      newCount = (window.courses_completed ?? 0) + 1;

      windowStart = window.window_started_at;

    }

  }



  await supabase.from('platform_usage_windows').upsert(

    {

      user_id: userId,

      window_started_at: windowStart,

      courses_completed: newCount,

      last_consumed_at: now,

    },

    { onConflict: 'user_id' }

  );



  const { data: monthly } = await supabase

    .from('platform_usage_monthly')

    .select('courses_completed')

    .eq('user_id', userId)

    .eq('month', month)

    .maybeSingle();



  await supabase.from('platform_usage_monthly').upsert(

    {

      user_id: userId,

      month,

      courses_completed: (monthly?.courses_completed ?? 0) + 1,

    },

    { onConflict: 'user_id,month' }

  );

}

