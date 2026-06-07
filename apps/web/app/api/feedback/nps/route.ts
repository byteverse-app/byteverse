import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { checkNpsEligibility } from '@/lib/access/npsEligibility';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general');
  if (!authResult.ok) return authResult.response;

  try {
    const result = await checkNpsEligibility(authResult.ctx.user.id);
    return NextResponse.json(result);
  } catch (error) {
    return internalError(error, 'feedback/nps');
  }
}

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const { rating, comment } = await request.json();

    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 0 || rating > 10) {
      return NextResponse.json({ error: 'Rating must be an integer from 0 to 10.' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    const now = new Date().toISOString();

    await supabase.from('product_feedback').insert({
      user_id: authResult.ctx.user.id,
      context: 'nps',
      rating,
      comment: typeof comment === 'string' && comment.trim() ? comment.trim() : null,
    });

    await supabase
      .from('profiles')
      .update({ last_nps_at: now })
      .eq('id', authResult.ctx.user.id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalError(error, 'feedback/nps');
  }
}
