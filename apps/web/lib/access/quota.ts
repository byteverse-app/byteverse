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
  const bonus = profile?.platform_credits_bonus ?? 0;

  const isUnlimited =
    tier === 'tester' ||
    tier === 'unlimited' ||
    tierConfig?.daily_platform_limit == null;

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
  const dailyLimit = isUnlimited ? null : (tierConfig?.daily_platform_limit ?? 5) + bonus;
  const monthlyLimit = isUnlimited ? null : tierConfig?.monthly_platform_limit ?? 20;

  return {
    tier,
    dailyLimit,
    monthlyLimit,
    dailyUsed,
    monthlyUsed,
    bonusCredits: bonus,
    dailyRemaining: dailyLimit == null ? null : Math.max(0, dailyLimit - dailyUsed),
    monthlyRemaining: monthlyLimit == null ? null : Math.max(0, monthlyLimit - monthlyUsed),
    windowStartedAt,
    windowResetsAt,
    isUnlimited,
  };
}

export interface QuotaCheckResult {
  allowed: boolean;
  snapshot: UsageSnapshot;
  resetAt?: string;
}

export async function checkPlatformQuota(userId: string): Promise<QuotaCheckResult> {
  const snapshot = await getUsageSnapshot(userId);
  if (snapshot.isUnlimited) {
    return { allowed: true, snapshot };
  }

  const dailyBlocked =
    snapshot.dailyLimit != null && snapshot.dailyUsed >= snapshot.dailyLimit;
  const monthlyBlocked =
    snapshot.monthlyLimit != null && snapshot.monthlyUsed >= snapshot.monthlyLimit;

  if (dailyBlocked || monthlyBlocked) {
    return {
      allowed: false,
      snapshot,
      resetAt: dailyBlocked ? snapshot.windowResetsAt ?? undefined : undefined,
    };
  }

  return { allowed: true, snapshot };
}

export async function consumePlatformCredit(userId: string): Promise<QuotaCheckResult> {
  const check = await checkPlatformQuota(userId);
  if (!check.allowed) return check;

  if (check.snapshot.isUnlimited) {
    return check;
  }

  const supabase = createServiceRoleSupabaseClient();
  const month = currentMonth();
  const now = new Date().toISOString();

  const { data: window } = await supabase
    .from('platform_usage_windows')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const tierConfig = await getTierConfig(check.snapshot.tier);
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

  return { allowed: true, snapshot: await getUsageSnapshot(userId) };
}
