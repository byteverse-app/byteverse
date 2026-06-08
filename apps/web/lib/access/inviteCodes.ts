import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

import { addCreatorScore, awardAchievement } from './gamification';

import type { InviteValidation } from './types';



function normalizeCode(code: string): string {

  return code.trim().toUpperCase();

}



export async function validateInviteCode(rawCode: string): Promise<InviteValidation> {

  const code = normalizeCode(rawCode);

  if (!code || code.length < 4) {

    return { valid: false, error: 'Invite code is required.' };

  }



  const supabase = createServiceRoleSupabaseClient();



  // Referral codes are stored on profiles (lowercase slug format)

  const referralSlug = rawCode.trim().toLowerCase();

  const { data: referrer } = await supabase

    .from('profiles')

    .select('id, referral_code, access_tier')

    .eq('referral_code', referralSlug)

    .maybeSingle();



  if (referrer) {

    return {
      valid: true,
      code: referrer.referral_code,
      type: 'referral',
      grantsTier: 'default',
      bonusCredits: 2,
      referrerId: referrer.id,
    };

  }



  const { data: invite } = await supabase

    .from('invite_codes')

    .select('*')

    .eq('code', code)

    .eq('is_active', true)

    .maybeSingle();



  if (!invite) {

    return { valid: false, error: 'Invalid or expired invite code.' };

  }



  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {

    return { valid: false, error: 'This invite code has expired.' };

  }



  if (invite.max_uses != null && invite.uses_count >= invite.max_uses) {

    return { valid: false, error: 'This invite code has reached its usage limit.' };

  }



  return {
    valid: true,
    code: invite.code,
    type: invite.type,
    grantsTier: invite.grants_tier,
    bonusCredits: invite.bonus_credits,
    referrerId: invite.owner_user_id ?? undefined,
  };

}



export async function redeemInviteCode(

  userId: string,

  rawCode: string

): Promise<{ ok: boolean; error?: string }> {

  const validation = await validateInviteCode(rawCode);

  if (!validation.valid) {

    return { ok: false, error: validation.error };

  }



  const supabase = createServiceRoleSupabaseClient();

  const code = validation.type === 'referral'

    ? rawCode.trim().toLowerCase()

    : normalizeCode(rawCode);



  if (validation.type !== 'referral') {

    const { data: invite } = await supabase

      .from('invite_codes')

      .select('id, uses_count, max_uses')

      .eq('code', code)

      .single();



    if (invite) {

      if (invite.max_uses != null && invite.uses_count >= invite.max_uses) {

        return { ok: false, error: 'Invite code already fully redeemed.' };

      }

      await supabase

        .from('invite_codes')

        .update({ uses_count: invite.uses_count + 1 })

        .eq('id', invite.id);

    }

  }



  if (validation.referrerId && validation.type === 'referral') {

    const signupPoints = 5;



    await supabase.from('referral_events').insert({

      referrer_id: validation.referrerId,

      referee_id: userId,

      event: 'signup',

      credits_awarded: signupPoints,

    });



    await addCreatorScore(validation.referrerId, signupPoints);



    const referralCount = await supabase

      .from('referral_events')

      .select('id', { count: 'exact', head: true })

      .eq('referrer_id', validation.referrerId)

      .eq('event', 'signup');



    if ((referralCount.count ?? 0) >= 3) {

      await awardAchievement(validation.referrerId, 'community_builder');

    }

  }



  return { ok: true };

}

