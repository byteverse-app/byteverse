'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ByteVerseWordmark from './ByteVerseWordmark';

export default function ByteVerseHeroTitle() {
  return (
    <div className="relative mb-4 overflow-visible">
      <ByteVerseWordmark size="hero" animated />

      <motion.div
        aria-hidden
        className="mx-auto mt-5 h-px bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 'min(72%, 22rem)', opacity: 1 }}
        transition={{
          duration: 0.9,
          delay: 0.9,
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </div>
  );
}
