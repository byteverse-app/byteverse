'use client';

import { CheckCircle2, Mail } from 'lucide-react';
import Link from 'next/link';

type EmailSentVariant = 'signup' | 'magic-link' | 'password-reset';

const COPY: Record<
  EmailSentVariant,
  { title: string; subtitle: string; body: string; tips: string[] }
> = {
  signup: {
    title: 'Check your email',
    subtitle: 'We sent a confirmation link from ByteVerse.',
    body: 'Open the link on this device to finish creating your account. Once confirmed, you will be redirected to your dashboard.',
    tips: ['Check spam or promotions if you do not see it within a few minutes.', 'The link expires after a short time.'],
  },
  'magic-link': {
    title: 'Check your email',
    subtitle: 'We sent a sign-in link from ByteVerse.',
    body: 'Open the link on this device to sign in. It expires shortly and can only be used once.',
    tips: ['Look for an email from ByteVerse, not Supabase.', 'Check spam if it does not arrive within a few minutes.'],
  },
  'password-reset': {
    title: 'Check your email',
    subtitle: 'If an account exists, we sent a reset link from ByteVerse.',
    body: 'Open the link on this device, then choose a new password.',
    tips: ['The link expires after a short time.', 'If you did not request a reset, you can ignore the email.'],
  },
};

interface EmailSentStateProps {
  variant: EmailSentVariant;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export function EmailSentState({ variant, action, footer }: EmailSentStateProps) {
  const copy = COPY[variant];

  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-brand-primary/15 border border-brand-primary/25 flex items-center justify-center">
          <Mail className="w-7 h-7 text-brand-primary" aria-hidden />
        </div>
        <CheckCircle2
          className="w-5 h-5 text-green-400 absolute -bottom-1 -right-1 bg-[var(--surface-card,#1a1a2e)] rounded-full"
          aria-hidden
        />
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-text-secondary leading-relaxed">{copy.body}</p>
        <ul className="text-xs text-text-tertiary space-y-1 text-left list-disc pl-4 max-w-sm mx-auto">
          {copy.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      {action ?? (
        <Link
          href="/login"
          className="neu-accent-button px-6 py-2 text-white font-semibold text-sm inline-block"
        >
          Go to sign in
        </Link>
      )}

      {footer}
    </div>
  );
}

export function getEmailSentCopy(variant: EmailSentVariant) {
  return COPY[variant];
}
