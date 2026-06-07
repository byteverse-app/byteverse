'use client';

import { useEffect, useState } from 'react';
import NpsSurveyModal from './NpsSurveyModal';

const SESSION_KEY = 'byteverse-nps-shown-session';
const SHOW_DELAY_MS = 5000;

export default function NpsSurveyHandler() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    fetch('/api/feedback/nps')
      .then((r) => r.json())
      .then((data: { eligible?: boolean }) => {
        if (!data.eligible) return;

        timeoutId = setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, '1');
          setShowModal(true);
        }, SHOW_DELAY_MS);
      })
      .catch(() => {});

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!showModal) return null;

  return <NpsSurveyModal onClose={() => setShowModal(false)} />;
}
