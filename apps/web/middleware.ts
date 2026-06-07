import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { checkUserInviteAccess } from '@/lib/access/requireInvite';

const PUBLIC_PATHS = ['/login', '/signup', '/forgot-password', '/auth/callback', '/auth/confirm', '/auth/reset-password'];

const PUBLIC_API_PATHS = [
  '/api/invite/validate',
  '/api/invite/prepare-oauth',
  '/api/invite/apply-profile',
  '/api/invite/redeem',
  '/api/waitlist',
];

function isInviteExemptPath(pathname: string): boolean {
  if (pathname === '/' || pathname === '/demo' || pathname === '/showcase') return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

const OAUTH_PROVIDERS = new Set(['google', 'apple', 'github', 'azure', 'facebook', 'linkedin_oidc']);

function needsEmailConfirmation(user: User): boolean {
  const provider = user.app_metadata?.provider as string | undefined;
  if (provider && provider !== 'email' && OAUTH_PROVIDERS.has(provider)) {
    return false;
  }
  return !user.email_confirmed_at;
}

function isPublicPath(pathname: string): boolean {
  if (pathname === '/' || pathname === '/demo' || pathname === '/showcase') return true;
  if (PUBLIC_API_PATHS.some((p) => pathname.startsWith(p))) return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith('/app') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/api/')
  );
}

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl?.trim() || !anonKey?.trim()) {
    if (isProtectedPath(request.nextUrl.pathname)) {
      return new NextResponse(
        'Missing Supabase config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/web/.env.local',
        { status: 503, headers: { 'Content-Type': 'text/plain' } }
      );
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
    },
  });

  let user: User | null = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error) user = data.user ?? null;
  } catch {
    user = null;
  }

  const { pathname } = request.nextUrl;

  if (!user && isProtectedPath(pathname) && !isPublicPath(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('next', pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && needsEmailConfirmation(user) && isProtectedPath(pathname) && !isPublicPath(pathname)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Email not confirmed', code: 'EMAIL_NOT_CONFIRMED' },
        { status: 403 }
      );
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('error', 'email_not_confirmed');
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isProtectedPath(pathname) && !isPublicPath(pathname)) {
    const access = await checkUserInviteAccess(user.id, supabase);
    if (!access.hasAccess) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { error: 'Invite required', code: 'INVITE_REQUIRED' },
          { status: 403 }
        );
      }
      if (!isInviteExemptPath(pathname)) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = '/signup';
        redirectUrl.searchParams.set('error', 'invite_required');
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
    if (needsEmailConfirmation(user)) {
      return supabaseResponse;
    }

    const access = await checkUserInviteAccess(user.id, supabase);
    if (!access.hasAccess) {
      return supabaseResponse;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/app';
    redirectUrl.search = '';
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
