'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Share2 } from 'lucide-react';

export default function EngagementBanner() {
  const [data, setData] = useState<{
    streakCurrent?: number;
    creatorScore?: number;
    referralLink?: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/access/usage').then((r) => r.json()),
      fetch('/api/referrals/me').then((r) => r.json()),
    ])
      .then(([usage, referral]) => {
        setData({
          streakCurrent: usage.profile?.streakCurrent,
          creatorScore: usage.profile?.creatorScore,
          referralLink: referral.referralLink,
        });
      })
      .catch(() => {});
  }, []);

  if (!data) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-4 neu-card px-4 py-3 text-sm">
      {(data.streakCurrent ?? 0) > 0 && (
        <span className="flex items-center gap-1.5 text-orange-400">
          <Flame className="w-4 h-4" />
          {data.streakCurrent}-day streak
        </span>
      )}
      <span className="text-text-secondary">
        Creator score: <strong className="text-text-primary">{data.creatorScore ?? 0}</strong>
      </span>
      <Link href="/app/settings?tab=referrals" className="flex items-center gap-1 text-accent1 hover:underline ml-auto">
        <Share2 className="w-4 h-4" />
        Share ByteVerse, earn credits
      </Link>
    </div>
  );
}
