'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';

function ConfirmRedirectContent() {
  const searchParams = useSearchParams();
  const confirmationUrl = searchParams.get('confirmation_url') ?? '';

  const safeHref = useMemo(() => {
    if (!confirmationUrl) return null;
    try {
      const url = new URL(confirmationUrl);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
      return url.toString();
    } catch {
      return null;
    }
  }, [confirmationUrl]);

  return (
    <AuthShell
      title="Continue to ByteVerse"
      subtitle="Click the button below to complete this secure sign-in or verification step."
    >
      {safeHref ? (
        <a
          href={safeHref}
          className="block w-full text-center neu-accent-button py-3 text-white font-semibold"
        >
          Continue to ByteVerse
        </a>
      ) : (
        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
          This link is invalid or has expired. Request a new email from the sign-in page.
        </p>
      )}
      <p className="mt-4 text-xs text-text-tertiary text-center">
        This extra step helps keep your account secure in corporate email environments.
      </p>
    </AuthShell>
  );
}

export default function AuthConfirmPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Continue to ByteVerse" subtitle="Loading…">
          <div className="h-16" />
        </AuthShell>
      }
    >
      <ConfirmRedirectContent />
    </Suspense>
  );
}
