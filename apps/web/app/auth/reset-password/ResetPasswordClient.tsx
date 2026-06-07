'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordClient() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, [supabase.auth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.push('/app'), 2000);
  }

  if (checking) {
    return (
      <AuthShell title="Set new password" subtitle="Loading…">
        <div className="h-16" />
      </AuthShell>
    );
  }

  if (!hasSession) {
    return (
      <AuthShell
        title="Link expired or invalid"
        subtitle="Request a new password reset link to continue."
        footer={
          <Link href="/forgot-password" className="text-accent1 hover:underline">
            Request new link
          </Link>
        }
      >
        <p className="text-sm text-text-secondary">
          Reset links are single-use and expire. Start again from the forgot password page.
        </p>
      </AuthShell>
    );
  }

  if (success) {
    return (
      <AuthShell title="Password updated" subtitle="You can sign in with your new password.">
        <div className="flex flex-col items-center gap-3 py-4">
          <CheckCircle2 className="w-10 h-10 text-accent1" />
          <p className="text-sm text-text-secondary">Redirecting to your dashboard…</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Use at least 8 characters. You will stay signed in after saving."
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
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min 8 characters)"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
        />
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full neu-accent-button py-3 text-white font-semibold disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
}
