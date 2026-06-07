export function getPasswordResetRedirectUrl(origin?: string): string {
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const next = encodeURIComponent('/auth/reset-password');
  return `${base}/auth/callback?next=${next}`;
}
