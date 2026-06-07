'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { EmailSentState, getEmailSentCopy } from '@/components/auth/EmailSentState';
import { getPasswordResetRedirectUrl } from '@/lib/auth/passwordReset';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: getPasswordResetRedirectUrl(),
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    const copy = getEmailSentCopy('password-reset');
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
        <EmailSentState variant="password-reset" />
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send you a reset link."
      footer={
        <Link href="/login" className="text-accent1 hover:underline">
          Back to sign in
        </Link>
      }
    >
      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@byteverse.app"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthShell>
  );
}
