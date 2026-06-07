'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { EmailSentState, getEmailSentCopy } from '@/components/auth/EmailSentState';
import { GoogleIcon } from '@/components/auth/GoogleIcon';
import { LinkedInIcon } from '@/components/auth/LinkedInIcon';
import { safeNextPath } from '@/lib/auth/safeNextPath';
import { createClient } from '@/lib/supabase/client';
import { validateSignupEmail } from '@/lib/validation/emailPolicy';

type AuthTab = 'password' | 'magic';

function LoginForm() {
  const [tab, setTab] = useState<AuthTab>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const nextParam = safeNextPath(searchParams?.get('next') ?? undefined);

  function getCallbackUrl() {
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextParam)}`;
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      router.push(nextParam);
      router.refresh();
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailCheck = validateSignupEmail(email);
    if (!emailCheck.ok) {
      setError(emailCheck.message);
      setLoading(false);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: getCallbackUrl(),
        shouldCreateUser: false,
      },
    });

    if (otpError) {
      const msg = otpError.message.toLowerCase();
      if (msg.includes('signups not allowed') || msg.includes('user not found') || msg.includes('not allowed')) {
        setError('No account found for this email. Sign up with an invite code first.');
      } else {
        setError(otpError.message);
      }
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  }

  async function handleOAuthSignIn(provider: 'google' | 'linkedin_oidc') {
    const label = provider === 'google' ? 'Google' : 'LinkedIn';
    try {
      setLoading(true);
      setError(null);

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: getCallbackUrl() },
      });

      if (oauthError) {
        setError(`Unable to sign in with ${label}. Please try again.`);
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (searchParams?.get('error') === 'auth_callback_failed') {
    return (
      <AuthShell
        title="Sign in failed"
        subtitle="The authentication link may have expired. Please try again."
        footer={
          <Link href="/login" className="text-accent1 hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div />
      </AuthShell>
    );
  }

  if (searchParams?.get('error') === 'email_not_confirmed') {
    return (
      <AuthShell
        title="Confirm your email"
        subtitle="Check your inbox for the confirmation link before accessing ByteVerse."
        footer={
          <Link href="/login" className="text-accent1 hover:underline">
            Back to sign in
          </Link>
        }
      >
        <div />
      </AuthShell>
    );
  }

  if (magicSent) {
    const copy = getEmailSentCopy('magic-link');
    return (
      <AuthShell
        title={copy.title}
        subtitle={copy.subtitle}
        footer={
          <Link href="/login" className="text-accent1 hover:underline">
            Back to sign in
          </Link>
        }
      >
        <EmailSentState variant="magic-link" />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Sign in to ByteVerse"
      subtitle="Access your microlearning projects from anywhere."
      footer={
        <span className="text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href={`/signup${nextParam !== '/app' ? `?next=${encodeURIComponent(nextParam)}` : ''}`} className="text-accent1 hover:underline">
            Sign up
          </Link>
        </span>
      }
    >
      <div className="space-y-3 mb-4">
        <button
          type="button"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuthSignIn('linkedin_oidc')}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <LinkedInIcon />
          Continue with LinkedIn
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wider">
          <span className="bg-[var(--surface-card,#1a1a2e)] px-3 text-text-secondary">or</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${
            tab === 'password' ? 'bg-brand-primary/20 text-brand-primary' : 'text-text-secondary hover:text-white'
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setTab('magic')}
          className={`flex-1 py-2 text-sm rounded-lg font-medium transition-colors ${
            tab === 'magic' ? 'bg-brand-primary/20 text-brand-primary' : 'text-text-secondary hover:text-white'
          }`}
        >
          Magic link
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {tab === 'password' ? (
        <form onSubmit={handlePasswordLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-accent1 hover:underline">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMagicLink} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Email me a sign-in link'}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={
      <AuthShell title="Sign in to ByteVerse" subtitle="Loading…">
        <div className="h-32" />
      </AuthShell>
    }>
      <LoginForm />
    </Suspense>
  );
}
