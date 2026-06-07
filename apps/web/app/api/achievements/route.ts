import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { getUserAchievements } from '@/lib/access/gamification';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general');
  if (!authResult.ok) return authResult.response;

  try {
    const earned = await getUserAchievements(authResult.ctx.user.id);
    const supabase = createServiceRoleSupabaseClient();
    const { data: all } = await supabase.from('achievement_definitions').select('*');

    return NextResponse.json({
      earned,
      all: all ?? [],
    });
  } catch (error) {
    return internalError(error, 'achievements');
  }
}
