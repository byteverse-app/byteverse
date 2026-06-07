'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { interpolateCursor, type CursorKeyframe } from './cursorPaths';

interface WireframeCursorProps {
  path: CursorKeyframe[];
  progress: number;
  reducedMotion?: boolean;
}

export default function WireframeCursor({ path, progress, reducedMotion = false }: WireframeCursorProps) {
  const { x, y, label, clicking } = interpolateCursor(path, progress);

  if (reducedMotion) return null;

  return (
    <>
      {label ? (
        <motion.div
          className="pointer-events-none absolute z-30 max-w-[148px] rounded-lg border border-brand-primary/30 bg-[#12121a]/95 px-2.5 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          animate={{ left: `${x}%`, top: `${y}%` }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{ transform: 'translate(-15%, -135%)' }}
        >
          <p className="text-[10px] font-space font-bold leading-snug text-white">{label}</p>
        </motion.div>
      ) : null}

      {clicking ? (
        <motion.span
          key={`click-${Math.floor(progress * 20)}`}
          className="pointer-events-none absolute z-20 h-7 w-7 rounded-full border-2 border-brand-primary/60 bg-brand-primary/10"
          animate={{ left: `${x}%`, top: `${y}%`, scale: [0.5, 1.6], opacity: [0.7, 0] }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ) : null}

      <motion.div
        className="pointer-events-none absolute z-40"
        animate={{ left: `${x}%`, top: `${y}%` }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        style={{ transform: 'translate(-1px, -1px)' }}
      >
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none" aria-hidden>
          <path
            d="M1 1L1 16.5L5.5 12.5L8.5 20.5L11 19.5L8 11.5L14 11.5L1 1Z"
            fill="#12121a"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </>
  );
}
