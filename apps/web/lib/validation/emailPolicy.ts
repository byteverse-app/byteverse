import disposableDomains from 'disposable-email-domains';

const DISPOSABLE_DOMAINS = new Set(
  disposableDomains.map((d: string) => d.toLowerCase().trim())
);

const DISPOSABLE_MESSAGE =
  'Temporary or disposable email addresses are not allowed. Please use a permanent email.';

export function getEmailDomain(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at <= 0 || at === trimmed.length - 1) return null;
  return trimmed.slice(at + 1);
}

export function isDisposableEmail(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  return DISPOSABLE_DOMAINS.has(domain);
}

export function validateSignupEmail(
  email: string
): { ok: true } | { ok: false; message: string } {
  const trimmed = email.trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }
  if (isDisposableEmail(trimmed)) {
    return { ok: false, message: DISPOSABLE_MESSAGE };
  }
  return { ok: true };
}

export { DISPOSABLE_MESSAGE };
