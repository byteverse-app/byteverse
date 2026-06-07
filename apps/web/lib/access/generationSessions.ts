import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { classifyProviderSource } from './providerSource';
import { recordPlatformUsage } from './quota';
import { awardAchievement, updateStreakAndScore, processReferralRewards } from './gamification';
import { AIProvider } from '@/lib/ai/providers/types';
import { UserProviderSettings } from '@/lib/ai/userProviderConfig';
import type { ProviderSource } from './types';

export async function trackOutlineCompletion(
  userId: string,
  projectId: string,
  provider: AIProvider,
  userConfig?: UserProviderSettings,
  totalStages?: number
) {
  const source = classifyProviderSource(provider, userConfig);
  const supabase = createServiceRoleSupabaseClient();

  await supabase.from('course_generation_sessions').upsert(
    {
      user_id: userId,
      project_id: projectId,
      provider_source: source,
      outline_completed_at: new Date().toISOString(),
      content_stages_total: totalStages ?? 0,
      content_stages_completed: 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,project_id' }
  );
}

export async function trackContentStageCompletion(
  userId: string,
  projectId: string,
  provider: AIProvider,
  userConfig?: UserProviderSettings,
  stageIndex?: number,
  totalStages?: number
): Promise<{
  fullyCompleted: boolean;
  providerSource: ProviderSource;
}> {
  const source = classifyProviderSource(provider, userConfig);
  const supabase = createServiceRoleSupabaseClient();

  const { data: existing } = await supabase
    .from('course_generation_sessions')
    .select('*')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .maybeSingle();

  const stagesTotal = totalStages ?? existing?.content_stages_total ?? 0;
  const stagesCompleted = Math.max(
    existing?.content_stages_completed ?? 0,
    (stageIndex ?? 0) + 1
  );

  const mergedSource: ProviderSource =
    existing?.provider_source === 'platform' || source === 'platform'
      ? 'platform'
      : existing?.provider_source === 'byok' || source === 'byok'
        ? 'byok'
        : 'local';

  await supabase.from('course_generation_sessions').upsert(
    {
      user_id: userId,
      project_id: projectId,
      provider_source: mergedSource,
      outline_completed_at: existing?.outline_completed_at ?? new Date().toISOString(),
      content_stages_total: stagesTotal,
      content_stages_completed: stagesCompleted,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,project_id' }
  );

  const outlineDone = !!(existing?.outline_completed_at ?? true);
  const fullyCompleted =
    outlineDone &&
    stagesTotal > 0 &&
    stagesCompleted >= stagesTotal;

  if (!fullyCompleted) {
    return { fullyCompleted: false, providerSource: mergedSource };
  }

  if (existing?.credit_consumed) {
    return { fullyCompleted: true, providerSource: mergedSource };
  }

  if (mergedSource === 'platform') {
    await recordPlatformUsage(userId);
  }

  await supabase
    .from('course_generation_sessions')
    .update({
      fully_completed_at: new Date().toISOString(),
      credit_consumed: mergedSource === 'platform',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('project_id', projectId);

  if (mergedSource === 'local') {
    await awardAchievement(userId, 'local_llm');
  }

  await awardAchievement(userId, 'first_course');
  await updateStreakAndScore(userId, { coursesCompleted: 1 });

  if (mergedSource === 'platform') {
    await processReferralRewards(userId);
  }

  return { fullyCompleted: true, providerSource: mergedSource };
}
