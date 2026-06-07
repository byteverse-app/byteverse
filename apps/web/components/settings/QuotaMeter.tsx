'use client';

import { useEffect, useState } from 'react';

interface UsageData {
  dailyUsed: number;
  monthlyUsed: number;
  isUnlimited: boolean;
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

  if (compact) {
    return (
      <p className="text-xs text-green-400">
        ByteVerse AI — unlimited
      </p>
    );
  }

  return (
    <div className="mb-4 p-3 rounded-lg border border-border bg-bg2">
      <p className="text-sm font-medium text-green-400 mb-2">ByteVerse AI — unlimited</p>
      <p className="text-xs text-text-secondary">
        Included hosted models are free with no generation caps.
      </p>
      {(usage.dailyUsed > 0 || usage.monthlyUsed > 0) && (
        <p className="text-xs text-text-tertiary mt-2">
          Activity: {usage.dailyUsed} course{usage.dailyUsed === 1 ? '' : 's'} in the last 24h
          {usage.monthlyUsed > 0 && ` · ${usage.monthlyUsed} this month`}
        </p>
      )}
    </div>
  );
}
