import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AccessTier } from './types';

const INVITE_EXEMPT_TIERS: AccessTier[] = ['tester', 'unlimited'];

export type InviteAccessResult =
  | { hasAccess: true }
  | { hasAccess: false; reason: 'no_invite' | 'tier_requires_invite' };

export async function checkUserInviteAccess(
  userId: string,
  supabase?: SupabaseClient
): Promise<InviteAccessResult> {
  const client = supabase ?? createServiceRoleSupabaseClient();

  const { data: profile } = await client
    .from('profiles')
    .select('signup_code_used, access_tier, is_admin')
    .eq('id', userId)
    .maybeSingle();

  if (!profile) {
    return { hasAccess: false, reason: 'no_invite' };
  }

  if (profile.is_admin) {
    return { hasAccess: true };
  }

  const tier = (profile.access_tier ?? 'default') as AccessTier;

  if (INVITE_EXEMPT_TIERS.includes(tier)) {
    return { hasAccess: true };
  }

  const { data: tierConfig } = await client
    .from('access_tier_config')
    .select('requires_invite')
    .eq('tier', tier)
    .maybeSingle();

  if (tierConfig?.requires_invite === false) {
    return { hasAccess: true };
  }

  if (profile.signup_code_used) {
    return { hasAccess: true };
  }

  return { hasAccess: false, reason: 'tier_requires_invite' };
}
