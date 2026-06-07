import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { redeemInviteCode } from '@/lib/access/inviteCodes';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', {
    requireSameOrigin: true,
    skipInviteCheck: true,
  });
  if (!authResult.ok) return authResult.response;

  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invite code is required.' }, { status: 400 });
    }

    const result = await redeemInviteCode(authResult.ctx.user.id, code);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return internalError(error, 'invite/redeem');
  }
}
