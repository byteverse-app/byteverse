import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { applyInviteToProfile } from '@/lib/access/applyInviteToProfile';
import { checkUserInviteAccess } from '@/lib/access/requireInvite';
import { safeNextPath } from '@/lib/auth/safeNextPath';
import { VERIFIED_INVITE_COOKIE } from '@/lib/auth/verifiedInviteCookie';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next =
    searchParams.get('next') ??
    (type === 'recovery' ? '/auth/reset-password' : '/app');

  if (code) {
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
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const verifiedInvite = cookieStore.get(VERIFIED_INVITE_COOKIE)?.value;

      if (user && verifiedInvite) {
        await applyInviteToProfile(user.id, verifiedInvite).catch(() => {});
      }

      if (user) {
        const access = await checkUserInviteAccess(user.id, supabase);
        if (!access.hasAccess) {
          const signupUrl = new URL('/signup', origin);
          signupUrl.searchParams.set('error', 'invite_required');
          const response = NextResponse.redirect(signupUrl.toString());
          response.cookies.delete(VERIFIED_INVITE_COOKIE);
          return response;
        }
      }

      const redirectResponse = NextResponse.redirect(`${origin}${safeNextPath(next)}`);
      redirectResponse.cookies.delete(VERIFIED_INVITE_COOKIE);
      return redirectResponse;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
