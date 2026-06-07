import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { recordNpsPrompt } from '@/lib/access/npsEligibility';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    await recordNpsPrompt(authResult.ctx.user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalError(error, 'feedback/nps/dismiss');
  }
}
