import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { applyInviteToProfile, ensureInviteRedeemed } from '@/lib/access/applyInviteToProfile';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { checkUserInviteAccess } from '@/lib/access/requireInvite';
import { AUTH_INTENT_PARAM, isNewAuthUser, parseAuthIntent } from '@/lib/auth/authIntent';
import { safeNextPath } from '@/lib/auth/safeNextPath';
import { VERIFIED_INVITE_COOKIE } from '@/lib/auth/verifiedInviteCookie';

function deleteInviteCookie(response: NextResponse) {
  response.cookies.delete(VERIFIED_INVITE_COOKIE);
}

async function finalizePostAuthInvite(userId: string) {
  const supabase = createServiceRoleSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('signup_code_used')
    .eq('id', userId)
    .maybeSingle();

  if (profile?.signup_code_used) {
    await ensureInviteRedeemed(userId, profile.signup_code_used);
  }
}

function signupRedirect(origin: string, error: string) {
  const signupUrl = new URL('/signup', origin);
  signupUrl.searchParams.set('error', error);
  const response = NextResponse.redirect(signupUrl.toString());
  deleteInviteCookie(response);
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next =
    searchParams.get('next') ??
    (type === 'recovery' ? '/auth/reset-password' : '/app');
  const intent = parseAuthIntent(searchParams.get(AUTH_INTENT_PARAM));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (type === 'recovery') {
    const response = NextResponse.redirect(`${origin}${safeNextPath(next)}`);
    deleteInviteCookie(response);
    return response;
  }

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  if (intent === 'login') {
    if (isNewAuthUser(user)) {
      await supabase.auth.signOut();
      const response = signupRedirect(origin, 'new_account_use_signup');
      return response;
    }

    const access = await checkUserInviteAccess(user.id, supabase);
    if (!access.hasAccess) {
      return signupRedirect(origin, 'invite_required');
    }

    await finalizePostAuthInvite(user.id);

    const response = NextResponse.redirect(`${origin}${safeNextPath(next)}`);
    deleteInviteCookie(response);
    return response;
  }

  if (intent === 'signup') {
    const verifiedInvite = cookieStore.get(VERIFIED_INVITE_COOKIE)?.value;
    if (verifiedInvite) {
      const applyResult = await applyInviteToProfile(user.id, verifiedInvite);
      if (!applyResult.ok) {
        console.error('[auth/callback] applyInviteToProfile failed:', applyResult.error);
      }
    }

    const access = await checkUserInviteAccess(user.id, supabase);
    if (!access.hasAccess) {
      return signupRedirect(origin, 'invite_required');
    }

    await finalizePostAuthInvite(user.id);

    const response = NextResponse.redirect(`${origin}${safeNextPath(next)}`);
    deleteInviteCookie(response);
    return response;
  }

  // Legacy / email-confirmation links without intent: never apply invite cookie
  const access = await checkUserInviteAccess(user.id, supabase);
  if (!access.hasAccess) {
    return signupRedirect(origin, 'invite_required');
  }

  await finalizePostAuthInvite(user.id);

  const response = NextResponse.redirect(`${origin}${safeNextPath(next)}`);
  deleteInviteCookie(response);
  return response;
}
