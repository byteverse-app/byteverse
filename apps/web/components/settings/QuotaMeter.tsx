'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface UsageData {
  dailyLimit: number | null;
  monthlyLimit: number | null;
  dailyUsed: number;
  monthlyUsed: number;
  dailyRemaining: number | null;
  monthlyRemaining: number | null;
  windowResetsAt: string | null;
  isUnlimited: boolean;
  bonusCredits: number;
}

function formatReset(resetAt: string | null) {
  if (!resetAt) return null;
  const diff = new Date(resetAt).getTime() - Date.now();
  if (diff <= 0) return 'soon';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

export default function QuotaMeter({ compact = false }: { compact?: boolean }) {
  const [usage, setUsage] = useState<UsageData | null>(null);

  useEffect(() => {
    fetch('/api/access/usage')
      .then((r) => r.json())
      .then((d) => setUsage(d.usage))
      .catch(() => {});
  }, []);

  if (!usage) return null;

  if (usage.isUnlimited) {
    return (
      <p className={`text-xs text-green-400 ${compact ? '' : 'mb-3'}`}>
        Unlimited ByteVerse AI on your plan
      </p>
    );
  }

  const dailyMax = usage.dailyLimit ?? 5;
  const monthlyMax = usage.monthlyLimit ?? 20;

  return (
    <div className={compact ? '' : 'mb-4 p-3 rounded-lg border border-border bg-bg2'}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">ByteVerse AI today</span>
        <span className="text-text-primary font-medium">
          {usage.dailyUsed} / {dailyMax}
          {usage.bonusCredits > 0 && (
            <span className="text-accent1 ml-1">(+{usage.bonusCredits} bonus)</span>
          )}
        </span>
      </div>
      <div className="h-1.5 bg-bg3 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-accent1 rounded-full transition-all"
          style={{ width: `${Math.min(100, (usage.dailyUsed / dailyMax) * 100)}%` }}
        />
      </div>
      {!compact && (
        <>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">This month</span>
            <span>{usage.monthlyUsed} / {monthlyMax}</span>
          </div>
          <div className="h-1.5 bg-bg3 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-accent2 rounded-full"
              style={{ width: `${Math.min(100, (usage.monthlyUsed / monthlyMax) * 100)}%` }}
            />
          </div>
        </>
      )}
      {usage.windowResetsAt && (
        <p className="text-[11px] text-text-tertiary">
          Resets in {formatReset(usage.windowResetsAt)}
        </p>
      )}
      {(usage.dailyRemaining === 0 || usage.monthlyRemaining === 0) && !compact && (
        <p className="text-xs text-amber-400 mt-2">
          Limit reached.{' '}
          <Link href="/app/settings?tab=models" className="underline">
            Add your API key
          </Link>{' '}
          for unlimited creation.
        </p>
      )}
    </div>
  );
}
