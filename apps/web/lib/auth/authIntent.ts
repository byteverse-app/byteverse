import type { User } from '@supabase/supabase-js';
import { safeNextPath } from '@/lib/auth/safeNextPath';

export const AUTH_INTENT_PARAM = 'intent';

export type AuthIntent = 'login' | 'signup';

export const AUTH_INTENT_STORAGE_KEY = 'byteverse-auth-intent';

const NEW_USER_WINDOW_MS = 120_000;

export function buildAuthCallbackUrl({
  origin,
  next,
  intent,
}: {
  origin: string;
  next?: string | null;
  intent: AuthIntent;
}): string {
  const url = new URL('/auth/callback', origin);
  url.searchParams.set('next', safeNextPath(next));
  url.searchParams.set(AUTH_INTENT_PARAM, intent);
  return url.toString();
}

export function parseAuthIntent(
  value: string | null | undefined
): AuthIntent | null {
  if (value === 'login' || value === 'signup') return value;
  return null;
}

/** True when the auth user was likely just created (first OAuth / signup session). */
export function isNewAuthUser(user: User): boolean {
  const createdAt = new Date(user.created_at).getTime();
  const lastSignInAt = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).getTime()
    : createdAt;
  const now = Date.now();

  if (now - createdAt > NEW_USER_WINDOW_MS) return false;
  return Math.abs(lastSignInAt - createdAt) < 5_000;
}

export function setSignupAuthIntent(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AUTH_INTENT_STORAGE_KEY, 'signup');
  }
}

export function hasSignupAuthIntent(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_INTENT_STORAGE_KEY) === 'signup';
}

export function clearSignupAuthIntent(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_INTENT_STORAGE_KEY);
  }
}
