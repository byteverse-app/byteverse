import type { User } from '@supabase/supabase-js';

const PROVIDER_LABELS: Record<string, string> = {
  email: 'Email',
  google: 'Google',
  linkedin_oidc: 'LinkedIn',
};

export function getAuthMethodLabel(provider: string | undefined): string {
  if (!provider) return 'Email';
  return PROVIDER_LABELS[provider] ?? provider;
}

export function hasPasswordAuth(user: User): boolean {
  if (user.app_metadata?.provider === 'email') return true;
  return user.identities?.some((identity) => identity.provider === 'email') ?? false;
}
