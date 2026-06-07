'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'byteverse-pending-invite';

export function setPendingInvite(code: string) {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEY, code);
  }
}

export default function PendingInviteHandler() {
  useEffect(() => {
    const code = sessionStorage.getItem(STORAGE_KEY);
    if (!code) return;

    fetch('/api/invite/apply-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(() => sessionStorage.removeItem(STORAGE_KEY))
      .catch(() => {});
  }, []);

  return null;
}
