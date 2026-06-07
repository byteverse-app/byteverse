import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export async function awardAchievement(
  userId: string,
  achievementId: string,
  metadata: Record<string, unknown> = {}
): Promise<boolean> {
  const supabase = createServiceRoleSupabaseClient();

  const { data: existing } = await supabase
    .from('user_achievements')
    .select('id')
    .eq('user_id', userId)
    .eq('achievement_id', achievementId)
    .maybeSingle();

  if (existing) return false;

  const { data: def } = await supabase
    .from('achievement_definitions')
    .select('points')
    .eq('id', achievementId)
    .maybeSingle();

  await supabase.from('user_achievements').insert({
    user_id: userId,
    achievement_id: achievementId,
    metadata,
  });

  if (def?.points) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('creator_score')
      .eq('id', userId)
      .single();

    await supabase
      .from('profiles')
      .update({ creator_score: (profile?.creator_score ?? 0) + def.points })
      .eq('id', userId);
  }

  return true;
}

export async function updateStreakAndScore(
  userId: string,
  opts: { coursesCompleted?: number; exports?: number; referralSignups?: number }
) {
  const supabase = createServiceRoleSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('creator_score, streak_current, streak_best, streak_last_active')
    .eq('id', userId)
    .single();

  if (!profile) return;

  let score = profile.creator_score ?? 0;
  if (opts.coursesCompleted) score += opts.coursesCompleted * 10;
  if (opts.exports) score += opts.exports * 5;
  if (opts.referralSignups) score += opts.referralSignups * 3;

  const today = new Date().toISOString().slice(0, 10);
  let streak = profile.streak_current ?? 0;
  let best = profile.streak_best ?? 0;
  const last = profile.streak_last_active;

  if (opts.coursesCompleted) {
    if (last === today) {
      // same day, no streak increment
    } else if (last) {
      const yesterday = new Date();
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      streak = last === yesterdayStr ? streak + 1 : 1;
    } else {
      streak = 1;
    }
    best = Math.max(best, streak);
  }

  await supabase
    .from('profiles')
    .update({
      creator_score: score,
      streak_current: streak,
      streak_best: best,
      streak_last_active: opts.coursesCompleted ? today : last,
    })
    .eq('id', userId);

  if (streak >= 3) await awardAchievement(userId, 'streak_3');
  if (streak >= 7) await awardAchievement(userId, 'streak_7');
  if (streak >= 30) await awardAchievement(userId, 'streak_30');
}

export async function processReferralRewards(refereeId: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { data: referee } = await supabase
    .from('profiles')
    .select('referred_by')
    .eq('id', refereeId)
    .single();

  if (!referee?.referred_by) return;

  const { data: existing } = await supabase
    .from('referral_events')
    .select('id')
    .eq('referee_id', refereeId)
    .eq('event', 'first_course_complete')
    .maybeSingle();

  if (existing) return;

  const referrerBonus = 3;
  const refereeBonus = 1;

  await supabase.from('referral_events').insert({
    referrer_id: referee.referred_by,
    referee_id: refereeId,
    event: 'first_course_complete',
    credits_awarded: referrerBonus,
  });

  const { data: referrer } = await supabase
    .from('profiles')
    .select('platform_credits_bonus')
    .eq('id', referee.referred_by)
    .single();

  await supabase
    .from('profiles')
    .update({
      platform_credits_bonus: (referrer?.platform_credits_bonus ?? 0) + referrerBonus,
    })
    .eq('id', referee.referred_by);

  const { data: refereeProfile } = await supabase
    .from('profiles')
    .select('platform_credits_bonus')
    .eq('id', refereeId)
    .single();

  await supabase
    .from('profiles')
    .update({
      platform_credits_bonus: (refereeProfile?.platform_credits_bonus ?? 0) + refereeBonus,
    })
    .eq('id', refereeId);
}

export async function getUserAchievements(userId: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { data } = await supabase
    .from('user_achievements')
    .select('achievement_id, earned_at, metadata, achievement_definitions(title, description, icon, points)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  return data ?? [];
}

export async function getReferralStats(userId: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { count: signups } = await supabase
    .from('referral_events')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_id', userId)
    .eq('event', 'signup');

  const { count: completions } = await supabase
    .from('referral_events')
    .select('id', { count: 'exact', head: true })
    .eq('referrer_id', userId)
    .eq('event', 'first_course_complete');

  const { data: credits } = await supabase
    .from('referral_events')
    .select('credits_awarded')
    .eq('referrer_id', userId);

  const creditsEarned = (credits ?? []).reduce((sum, e) => sum + (e.credits_awarded ?? 0), 0);

  return {
    signups: signups ?? 0,
    completions: completions ?? 0,
    creditsEarned,
  };
}
