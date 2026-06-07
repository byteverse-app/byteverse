import { NextRequest, NextResponse } from 'next/server';
import { validateInviteCode } from '@/lib/access/inviteCodes';
import { internalError } from '@/lib/api/errorResponse';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Invite code is required.' }, { status: 400 });
    }

    const result = await validateInviteCode(code);
    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return internalError(error, 'invite/validate');
  }
}
