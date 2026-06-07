import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { awardAchievement } from '@/lib/access/gamification';
import { internalError } from '@/lib/api/errorResponse';

function isValidContextualRating(rating: unknown): rating is number | null {
  if (rating === null || rating === undefined) return true;
  return typeof rating === 'number' && Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const { context, rating, comment, projectId } = await request.json();
    if (!context || typeof context !== 'string') {
      return NextResponse.json({ error: 'Context is required.' }, { status: 400 });
    }

    if (context === 'nps') {
      return NextResponse.json({ error: 'Use POST /api/feedback/nps for NPS submissions.' }, { status: 400 });
    }

    if (!isValidContextualRating(rating ?? null)) {
      return NextResponse.json({ error: 'Rating must be an integer from 1 to 5.' }, { status: 400 });
    }

    const supabase = createServiceRoleSupabaseClient();
    await supabase.from('product_feedback').insert({
      user_id: authResult.ctx.user.id,
      context,
      rating: rating ?? null,
      comment: comment ?? null,
      project_id: projectId ?? null,
    });

    const { count } = await supabase
      .from('product_feedback')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', authResult.ctx.user.id)
      .neq('context', 'nps');

    if ((count ?? 0) >= 5) {
      await awardAchievement(authResult.ctx.user.id, 'feedback_champion');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalError(error, 'feedback');
  }
}
