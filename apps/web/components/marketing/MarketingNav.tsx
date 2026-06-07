'use client';

import React from 'react';
import Link from 'next/link';
import ByteVerseWordmark from './ByteVerseWordmark';
import { useAdaptiveContrast } from '@/hooks/useAdaptiveContrast';

const navLinks = [
  { href: '#tour', label: 'Tour' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#ai-providers', label: 'AI Providers' },
  { href: '#features', label: 'Features' },
  { href: '#deploy', label: 'Deploy' },
] as const;

export default function MarketingNav() {
  const { ref, mode } = useAdaptiveContrast<HTMLElement>();
  const onLight = mode === 'on-light';

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-8 px-6 pointer-events-none">
      <nav
        ref={ref}
        data-contrast={mode}
        className={[
          'adaptive-glass-nav px-10 py-3.5 rounded-full flex items-center gap-10 pointer-events-auto border transition-[background-color,border-color,box-shadow] duration-300',
          onLight
            ? 'border-black/10 bg-black/[0.18] shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
            : 'apple-glass border-white/5',
        ].join(' ')}
      >
        <ByteVerseWordmark size="nav" asLink />
        <div
          className={[
            'hidden md:flex gap-8 text-[10px] font-space uppercase tracking-[0.25em] transition-colors duration-300',
            onLight ? 'text-black/55 hover:[&_a]:text-black/90' : 'text-white/40 hover:[&_a]:text-white/80',
          ].join(' ')}
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={[
              'text-[10px] font-bold uppercase transition-colors duration-300',
              onLight ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white',
            ].join(' ')}
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={[
              'text-[10px] font-bold uppercase px-6 py-2.5 rounded-full transition-all duration-300',
              onLight
                ? 'bg-black text-white hover:bg-brand-primary'
                : 'bg-white text-black hover:bg-brand-primary hover:text-white',
            ].join(' ')}
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
