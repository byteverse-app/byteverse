import { NextResponse } from 'next/server';
import { VERIFIED_INVITE_COOKIE } from '@/lib/auth/verifiedInviteCookie';

/** Clear stale OAuth invite prep cookie before login OAuth (signup-only cookie). */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(VERIFIED_INVITE_COOKIE);
  return response;
}
