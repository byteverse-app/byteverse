import { getAuthMethodLabel } from '@/lib/auth/authMethod';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { LinkedInIcon } from '@/components/auth/LinkedInIcon';

const OAUTH_METHODS: Record<string, { icon: typeof GoogleIcon; label: string }> = {
  google: { icon: GoogleIcon, label: 'Google' },
  linkedin_oidc: { icon: LinkedInIcon, label: 'LinkedIn' },
};

export function AuthMethodBadge({ provider }: { provider: string | undefined }) {
  const method = provider ? OAUTH_METHODS[provider] : undefined;

  if (!method) {
    return <p>{getAuthMethodLabel(provider)}</p>;
  }

  const Icon = method.icon;

  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 mt-1">
      <Icon size={18} />
      <span className="font-medium">Signed in with {method.label}</span>
    </div>
  );
}
