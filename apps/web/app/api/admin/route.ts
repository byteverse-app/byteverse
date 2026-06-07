import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { isAdminUser } from '@/lib/access/admin';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general');
  if (!authResult.ok) return authResult.response;

  const admin = await isAdminUser(authResult.ctx.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const supabase = createServiceRoleSupabaseClient();
    const [waitlist, codes, feedback] = await Promise.all([
      supabase.from('waitlist_entries').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('invite_codes').select('*').order('created_at', { ascending: false }),
      supabase.from('product_feedback').select('*').order('created_at', { ascending: false }).limit(50),
    ]);

    return NextResponse.json({
      waitlist: waitlist.data ?? [],
      inviteCodes: codes.data ?? [],
      feedback: feedback.data ?? [],
    });
  } catch (error) {
    return internalError(error, 'admin');
  }
}

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  const admin = await isAdminUser(authResult.ctx.user.id);
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const supabase = createServiceRoleSupabaseClient();

    if (body.action === 'create_invite_code') {
      const { data, error } = await supabase.from('invite_codes').insert({
        code: String(body.code).trim().toUpperCase(),
        type: body.type ?? 'early_access',
        grants_tier: body.grantsTier ?? 'early_access',
        bonus_credits: body.bonusCredits ?? 0,
        max_uses: body.maxUses ?? null,
        is_active: true,
      }).select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ ok: true, code: data });
    }

    if (body.action === 'invite_waitlist') {
      const { data: entry } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('id', body.waitlistId)
        .single();

      if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

      const code = body.code || `INVITE-${Date.now().toString(36).toUpperCase()}`;
      const { data: invite } = await supabase.from('invite_codes').insert({
        code,
        type: 'early_access',
        grants_tier: 'early_access',
        bonus_credits: 2,
        max_uses: 1,
        is_active: true,
      }).select().single();

      await supabase
        .from('waitlist_entries')
        .update({ status: 'invited', invited_code_id: invite?.id })
        .eq('id', body.waitlistId);

      return NextResponse.json({ ok: true, code: invite?.code });
    }

    if (body.action === 'update_user_tier') {
      await supabase
        .from('profiles')
        .update({
          access_tier: body.tier,
          platform_credits_bonus: body.bonusCredits,
        })
        .eq('id', body.userId);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return internalError(error, 'admin');
  }
}
