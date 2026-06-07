'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type ByteVerseWordmarkProps = {
  size?: 'nav' | 'hero';
  theme?: 'dark' | 'light';
  animated?: boolean;
  asLink?: boolean;
  className?: string;
};

const wordmarkSrc = {
  dark: '/images/brand/wordmark/byteverse-white.png',
  light: '/images/brand/wordmark/byteverse-black.png',
} as const;

const iconSrc = {
  dark: '/images/icons/ByteB_white.png',
  light: '/images/icons/ByteB_black.png',
} as const;

const sizeStyles = {
  nav: 'h-8 w-8 md:h-9 md:w-9',
  hero: 'w-[min(88vw,22rem)] sm:w-[min(85vw,26rem)] md:w-[min(80vw,32rem)] lg:w-[36rem] h-auto',
} as const;

function WordmarkContent({
  size,
  theme,
}: {
  size: 'nav' | 'hero';
  theme: 'dark' | 'light';
}) {
  if (size === 'nav') {
    return (
      <img
        src={iconSrc[theme]}
        alt="ByteVerse"
        className={`${sizeStyles.nav} shrink-0 object-contain`}
      />
    );
  }

  return (
    <img
      src={wordmarkSrc[theme]}
      alt="ByteVerse"
      className={`${sizeStyles.hero} shrink-0 object-contain`}
    />
  );
}

export default function ByteVerseWordmark({
  size = 'nav',
  theme = 'dark',
  animated = false,
  asLink = false,
  className = '',
}: ByteVerseWordmarkProps) {
  const wrapperClass = `inline-flex items-center ${className}`;

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        className={wrapperClass}
      >
        <WordmarkContent size={size} theme={theme} />
      </motion.div>
    );
  }

  if (asLink) {
    return (
      <Link href="/" className={wrapperClass}>
        <WordmarkContent size={size} theme={theme} />
      </Link>
    );
  }

  return (
    <div className={wrapperClass}>
      <WordmarkContent size={size} theme={theme} />
    </div>
  );
}
