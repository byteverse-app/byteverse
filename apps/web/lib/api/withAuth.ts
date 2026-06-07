import { NextRequest, NextResponse } from 'next/server';
import { checkUserInviteAccess } from '@/lib/access/requireInvite';
import { requireAuth } from '@/lib/supabase/requireAuth';
import { checkRateLimit, type RateLimitTier } from '@/lib/security/rateLimit';
import { isSameOriginRequest } from '@/lib/security/csrfCheck';

type AuthContext = {
  user: NonNullable<Awaited<ReturnType<typeof requireAuth>>['user']>;
  supabase: NonNullable<Awaited<ReturnType<typeof requireAuth>>['supabase']>;
};

export async function withApiAuth(
  request: NextRequest,
  tier: RateLimitTier = 'general',
  options: { requireSameOrigin?: boolean; skipInviteCheck?: boolean } = {}
): Promise<{ ok: true; ctx: AuthContext } | { ok: false; response: NextResponse }> {
  if (options.requireSameOrigin && !isSameOriginRequest(request)) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
    };
  }

  const auth = await requireAuth();
  if (auth.response) {
    return { ok: false, response: auth.response };
  }

  if (!options.skipInviteCheck) {
    const access = await checkUserInviteAccess(auth.user.id, auth.supabase);
    if (!access.hasAccess) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: 'Invite required', code: 'INVITE_REQUIRED' },
          { status: 403 }
        ),
      };
    }
  }

  const rateLimited = checkRateLimit(request, auth.user.id, tier);
  if (rateLimited) {
    return { ok: false, response: rateLimited };
  }

  return { ok: true, ctx: { user: auth.user, supabase: auth.supabase } };
}
