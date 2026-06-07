'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

function computeNpsScore(feedback: Record<string, unknown>[]): number | null {
  const npsResponses = feedback.filter(
    (f) => f.context === 'nps' && typeof f.rating === 'number'
  );
  if (npsResponses.length === 0) return null;

  const promoters = npsResponses.filter((f) => (f.rating as number) >= 9).length;
  const detractors = npsResponses.filter((f) => (f.rating as number) <= 6).length;
  return Math.round(((promoters - detractors) / npsResponses.length) * 100);
}
export default function AdminPage() {
  const [data, setData] = useState<{
    waitlist: Record<string, unknown>[];
    inviteCodes: Record<string, unknown>[];
    feedback: Record<string, unknown>[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState('');

  const load = () => {
    fetch('/api/admin')
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 403 ? 'Access denied' : 'Failed to load');
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    load();
  }, []);

  const createCode = async () => {
    if (!newCode.trim()) return;
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_invite_code', code: newCode, type: 'early_access' }),
    });
    setNewCode('');
    load();
  };

  const inviteFromWaitlist = async (id: string) => {
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'invite_waitlist', waitlistId: id }),
    });
    load();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/app" className="text-accent1 hover:underline">Back to app</Link>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center">Loading admin…</div>;

  const npsScore = computeNpsScore(data.feedback);

  return (    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">ByteVerse Admin</h1>
        <Link href="/app" className="text-sm text-accent1">← Dashboard</Link>
      </div>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Create invite code</h2>
        <div className="flex gap-2">
          <input
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="MY-CODE-2026"
            className="px-3 py-2 border border-border rounded-lg bg-bg2 flex-1"
          />
          <button type="button" onClick={createCode} className="neu-accent-button px-4 py-2 text-white text-sm">
            Create
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Invite codes ({data.inviteCodes.length})</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-text-tertiary border-b border-border">
                <th className="py-2">Code</th>
                <th>Tier</th>
                <th>Uses</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {data.inviteCodes.map((c) => (
                <tr key={c.id as string} className="border-b border-border/50">
                  <td className="py-2 font-mono">{c.code as string}</td>
                  <td>{c.grants_tier as string}</td>
                  <td>{c.uses_count as number}{c.max_uses != null ? ` / ${c.max_uses}` : ''}</td>
                  <td>{c.is_active ? 'yes' : 'no'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-semibold mb-3">Waitlist ({data.waitlist.length})</h2>
        <div className="space-y-2">
          {data.waitlist.map((w) => (
            <div key={w.id as string} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div>
                <p className="font-medium">{w.email as string}</p>
                <p className="text-xs text-text-tertiary">{w.use_case as string} · {w.status as string}</p>
              </div>
              {w.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => inviteFromWaitlist(w.id as string)}
                  className="text-xs px-3 py-1 border border-accent1 text-accent1 rounded-lg"
                >
                  Issue invite
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3">Recent feedback</h2>
        {npsScore !== null && (
          <p className="text-sm text-text-secondary mb-3">
            NPS score (recent responses): <span className="font-semibold text-text-primary">{npsScore}</span>
          </p>
        )}
        <div className="space-y-2">
          {data.feedback.map((f) => {
            const isNps = f.context === 'nps';
            return (
              <div key={f.id as string} className="p-3 border border-border rounded-lg text-sm">
                <span className="text-text-tertiary">{f.context as string}</span>
                {isNps && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-accent1/20 text-accent1">NPS</span>
                )}
                {f.rating != null && (
                  <span className="ml-2">
                    {isNps ? `${f.rating as number}/10` : `★ ${f.rating as number}`}
                  </span>
                )}
                {typeof f.comment === 'string' && f.comment && <p className="mt-1">{f.comment}</p>}
              </div>
            );
          })}
        </div>
      </section>    </div>
  );
}
