import { NextRequest, NextResponse } from 'next/server';
import { validateInviteCode } from '@/lib/access/inviteCodes';
import { internalError } from '@/lib/api/errorResponse';
import {
  VERIFIED_INVITE_COOKIE,
  VERIFIED_INVITE_MAX_AGE_SECONDS,
} from '@/lib/auth/verifiedInviteCookie';

/** Sets bv_verified_invite cookie — only consumed in /auth/callback when intent=signup. */
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invite code is required.' }, { status: 400 });
    }

    const validation = await validateInviteCode(code);
    if (!validation.valid) {
      return NextResponse.json(validation, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(VERIFIED_INVITE_COOKIE, code.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: VERIFIED_INVITE_MAX_AGE_SECONDS,
      path: '/',
    });

    return response;
  } catch (error) {
    return internalError(error, 'invite/prepare-oauth');
  }
}
