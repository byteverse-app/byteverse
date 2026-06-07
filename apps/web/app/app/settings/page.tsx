'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import AIProviderSettings from '@/components/AIProviderSettings';
import QuotaMeter from '@/components/settings/QuotaMeter';
import { AIProvider } from '@/lib/ai/providers/types';
import { loadUserAISettings, saveUserAISettings } from '@/lib/ai/userProviderConfig';
import { FREE_MODEL_DIRECTORY } from '@/lib/ai/providers/registry';
import { AuthMethodBadge } from '@/components/auth/AuthMethodBadge';
import { getPasswordResetRedirectUrl } from '@/lib/auth/passwordReset';
import { createClient } from '@/lib/supabase/client';
import { ExternalLink, Copy, Check, Flame, Trophy } from 'lucide-react';

type Tab = 'models' | 'usage' | 'referrals' | 'account' | 'feedback' | 'achievements';

function SettingsContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as Tab) || 'models';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [aiProvider, setAiProvider] = useState<AIProvider>(() => loadUserAISettings().selectedProvider);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [referral, setReferral] = useState<Record<string, unknown> | null>(null);
  const [referralLoading, setReferralLoading] = useState(true);
  const [achievements, setAchievements] = useState<{ earned: unknown[]; all: unknown[] } | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/access/usage').then((r) => r.json()).then((d) => setProfile({ ...d.profile, usage: d.usage })).catch(() => {});
    fetch('/api/referrals/me')
      .then((r) => r.json())
      .then(setReferral)
      .catch(() => {})
      .finally(() => setReferralLoading(false));
    fetch('/api/achievements').then((r) => r.json()).then(setAchievements).catch(() => {});
  }, []);

  const handleProviderChange = (p: AIProvider) => {
    setAiProvider(p);
    const s = loadUserAISettings();
    saveUserAISettings({ ...s, selectedProvider: p });
  };

  const copyReferral = () => {
    const link = referral?.referralLink as string;
    if (link) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const submitFeedback = async () => {
    await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ context: 'settings', rating: feedbackRating, comment: feedbackComment }),
    });
    setFeedbackSent(true);
  };

  const sendPasswordReset = async () => {
    const email = profile?.email as string | undefined;
    if (!email) return;

    setPasswordResetLoading(true);
    setPasswordResetError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    });

    if (error) {
      setPasswordResetError(error.message);
      setPasswordResetLoading(false);
      return;
    }

    setPasswordResetSent(true);
    setPasswordResetLoading(false);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'models', label: 'AI Models' },
    { id: 'usage', label: 'Usage' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'account', label: 'Account' },
    { id: 'feedback', label: 'Feedback' },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-syne font-bold mb-6">Settings</h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-accent1 text-white' : 'bg-bg2 text-text-secondary hover:bg-bg3'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'models' && (
          <div className="space-y-6">
            <QuotaMeter />
            <AIProviderSettings selectedProvider={aiProvider} onProviderChange={handleProviderChange} />
            <div className="border border-border rounded-lg p-4 bg-bg2">
              <h3 className="text-sm font-semibold mb-3">Free models directory</h3>
              <p className="text-xs text-text-tertiary mb-4">
                Add your own API keys below for unlimited course creation with these free-tier models.
              </p>
              <div className="space-y-3">
                {FREE_MODEL_DIRECTORY.map((m) => (
                  <div key={m.name} className="p-3 rounded-lg border border-border bg-bg1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-text-tertiary">{m.provider} — {m.description}</p>
                      </div>
                      <a
                        href={m.setupUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-accent1 flex items-center gap-1 shrink-0"
                      >
                        Get key <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'usage' && (
          <div className="neu-card p-6 space-y-4">
            <QuotaMeter />
            {profile && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-text-tertiary text-xs">Tier</p>
                  <p className="font-medium capitalize">{(profile.tier as string)?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-text-tertiary text-xs">Bonus credits</p>
                  <p className="font-medium">{(profile.usage as { bonusCredits?: number })?.bonusCredits ?? 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-text-tertiary text-xs">Streak</p>
                    <p className="font-medium">{profile.streakCurrent as number ?? 0} days (best {profile.streakBest as number ?? 0})</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent1" />
                  <div>
                    <p className="text-text-tertiary text-xs">Creator score</p>
                    <p className="font-medium">{profile.creatorScore as number ?? 0}</p>
                  </div>
                </div>
              </div>
            )}
            <p className="text-sm text-text-secondary">
              Using ByteVerse AI counts toward your daily and monthly limits when a full course generation completes.
              Bring your own API key or use Ollama locally for unlimited creation.
            </p>
            <Link href="/app/settings?tab=models" className="text-sm text-accent1 hover:underline">
              Configure AI models →
            </Link>
          </div>
        )}

        {tab === 'referrals' && (
          <div className="neu-card p-6 space-y-4">
            <h3 className="font-semibold">Your referral link</h3>
            {referralLoading ? (
              <p className="text-sm text-text-secondary">Loading your referral link…</p>
            ) : (
              <>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={(referral?.referralLink as string) || ''}
                    placeholder="Referral link unavailable"
                    className="flex-1 px-3 py-2 text-sm bg-bg2 border border-border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={copyReferral}
                    disabled={!referral?.referralLink}
                    className="neu-icon-button px-3 disabled:opacity-40"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-bg2 rounded-lg">
                    <p className="text-2xl font-bold">{(referral?.stats as { signups: number })?.signups ?? 0}</p>
                    <p className="text-xs text-text-tertiary">Signups</p>
                  </div>
                  <div className="p-3 bg-bg2 rounded-lg">
                    <p className="text-2xl font-bold">{(referral?.stats as { completions: number })?.completions ?? 0}</p>
                    <p className="text-xs text-text-tertiary">First courses</p>
                  </div>
                  <div className="p-3 bg-bg2 rounded-lg">
                    <p className="text-2xl font-bold">{(referral?.stats as { creditsEarned: number })?.creditsEarned ?? 0}</p>
                    <p className="text-xs text-text-tertiary">Credits earned</p>
                  </div>
                </div>
                <div className="text-xs text-text-secondary space-y-1">
                  <p>Referee signup: +2 bonus credits for them</p>
                  <p>Referee completes first course: +3 credits for you, +1 for them</p>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'achievements' && achievements && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(achievements.all as { id: string; title: string; description: string }[]).map((a) => {
              const earned = (achievements.earned as { achievement_id: string }[]).some(
                (e) => e.achievement_id === a.id
              );
              return (
                <div
                  key={a.id}
                  className={`p-4 rounded-lg border ${earned ? 'border-accent1/40 bg-accent1/10' : 'border-border bg-bg2 opacity-60'}`}
                >
                  <p className="font-medium text-sm">{a.title}</p>
                  <p className="text-xs text-text-tertiary mt-1">{a.description}</p>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'account' && profile && (
          <div className="neu-card p-6 space-y-3 text-sm">
            <div>
              <p className="text-text-tertiary text-xs">Email</p>
              <p>{(profile.email as string) || '—'}</p>
            </div>
            {profile.hasPasswordAuth ? (
              <div>
                <p className="text-text-tertiary text-xs">Password</p>
                {passwordResetSent ? (
                  <div className="space-y-2 mt-1">
                    <p className="text-green-400 text-sm">
                      We sent a reset link to <span className="font-medium">{profile.email as string}</span>.
                    </p>
                    <p className="text-text-secondary text-sm">
                      Open the link on this device, then choose a new password.
                    </p>
                    <ul className="text-xs text-text-tertiary space-y-1 list-disc pl-4">
                      <li>The link expires after a short time.</li>
                      <li>If you did not request a reset, you can ignore the email.</li>
                    </ul>
                    <button
                      type="button"
                      onClick={() => {
                        setPasswordResetSent(false);
                        void sendPasswordReset();
                      }}
                      disabled={passwordResetLoading}
                      className="text-accent1 hover:underline text-sm disabled:opacity-50"
                    >
                      Send again
                    </button>
                  </div>
                ) : (
                  <>
                    {passwordResetError && (
                      <p className="text-sm text-red-400 mt-1">{passwordResetError}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => void sendPasswordReset()}
                      disabled={passwordResetLoading || !profile.email}
                      className="text-accent1 hover:underline text-sm disabled:opacity-50"
                    >
                      {passwordResetLoading ? 'Sending…' : 'Send password reset email'}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div>
                <p className="text-text-tertiary text-xs">Sign-in method</p>
                <AuthMethodBadge provider={profile.authProvider as string} />
              </div>
            )}
            <div>
              <p className="text-text-tertiary text-xs">Display name</p>
              <p>{profile.displayName as string}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Access tier</p>
              <p className="capitalize">{(profile.tier as string)?.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Signup code</p>
              <p>{(profile.signupCodeUsed as string) || '—'}</p>
            </div>
            <div>
              <p className="text-text-tertiary text-xs">Your referral code</p>
              <p>{profile.referralCode as string}</p>
            </div>
          </div>
        )}

        {tab === 'feedback' && (
          <div className="neu-card p-6 space-y-4">
            {feedbackSent ? (
              <p className="text-green-400 text-sm">Thank you for your feedback!</p>
            ) : (
              <>
                <p className="text-sm text-text-secondary">How is ByteVerse working for you?</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFeedbackRating(n)}
                      className={`w-10 h-10 rounded-lg border ${
                        feedbackRating >= n ? 'border-accent1 bg-accent1/20' : 'border-border'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Optional comments…"
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-bg2 border border-border rounded-lg"
                />
                <button type="button" onClick={submitFeedback} className="neu-accent-button px-6 py-2 text-white text-sm">
                  Submit feedback
                </button>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading settings…</div>}>
      <SettingsContent />
    </Suspense>
  );
}
