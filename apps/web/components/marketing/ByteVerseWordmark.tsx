'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ByteVerseWordmarkProps = {
  size?: 'nav' | 'hero';
  theme?: 'dark' | 'light';
  animated?: boolean;
  asLink?: boolean;
  className?: string;
};

const iconSrc = {
  dark: '/images/icons/ByteB_white.png',
  light: '/images/icons/ByteB_black.png',
} as const;

const sizeStyles = {
  nav: 'h-8 w-8 md:h-9 md:w-9',
} as const;

const BYTE_LETTERS = 'BYTE'.split('');

function AiStar({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <svg
      className={`byteverse-b-star pointer-events-none absolute ${theme === 'dark' ? 'fill-black' : 'fill-white'}`}
      viewBox="0 0 24 24"
      aria-hidden
    >
      {/* Tips fixed at 12,2 / 22,12 / 12,22 / 2,12 — controls pulled 20% toward center for slimmer arms */}
      <path d="M12 2 C12.96 9.28 14.08 10.72 22 12 C14.08 13.28 12.96 14.72 12 22 C11.04 14.72 9.92 13.28 2 12 C9.92 10.72 11.04 9.28 12 2 Z" />
    </svg>
  );
}

function NavIcon({ theme }: { theme: 'dark' | 'light' }) {
  return (
    <img
      src={iconSrc[theme]}
      alt="ByteVerse"
      className={`${sizeStyles.nav} shrink-0 object-contain`}
    />
  );
}

function HeroWordmark({
  theme,
  animated,
}: {
  theme: 'dark' | 'light';
  animated: boolean;
}) {
  const lockupRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const shouldAnimate = animated && !reduceMotion;
  const color = theme === 'dark' ? 'text-white' : 'text-black';
  const glowColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(82,39,255,0.14)';

  useGSAP(
    () => {
      if (!shouldAnimate || !lockupRef.current) return;

      const lockup = lockupRef.current;
      const letters = lockup.querySelectorAll<HTMLElement>('.byteverse-byte-letter');
      const verseWrap = lockup.querySelector<HTMLElement>('.byteverse-verse-wrap');
      const verseMotion = lockup.querySelector<HTMLElement>('.byteverse-verse-motion');
      const byteGlow = lockup.querySelector<HTMLElement>('.byteverse-byte-glow');
      const byteEl = lockup.querySelector<HTMLElement>('.byteverse-byte');
      const heroSection = lockup.closest('section');

      if (!letters.length || !verseWrap || !verseMotion || !byteGlow) return;

      const waitForBlou = async () => {
        if (!document.fonts || !byteEl) return;

        const fontFamily = getComputedStyle(byteEl).fontFamily.split(',')[0]?.trim();
        if (!fontFamily) return;

        await Promise.all([
          document.fonts.load(`900 1em ${fontFamily}`).catch(() => undefined),
          document.fonts.ready,
        ]);
      };

      const runAnimations = () => {
        lockup.classList.remove('byteverse-lockup--pending');

        gsap.set(lockup, { transformOrigin: '50% 50%', visibility: 'visible' });
        gsap.set(byteGlow, { filter: `drop-shadow(0 0 0px ${glowColor})` });
        gsap.set(lockup, { scale: 1.16, opacity: 0, filter: 'blur(16px)' });
        gsap.set(letters, {
          opacity: 0,
          y: 28,
          rotate: (index) => (index % 2 === 0 ? -6 : 6),
        });
        gsap.set(verseMotion, {
          opacity: 0,
          y: 26,
          x: 18,
          clipPath: 'inset(0 100% 0 0)',
        });

        const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

        intro
          .to(lockup, {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.05,
            ease: 'power2.inOut',
          })
          .to(
            letters,
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.72,
              stagger: {
                each: 0.085,
                from: 'center',
              },
              ease: 'expo.out',
            },
            '-=0.78',
          )
          .to(
            verseMotion,
            {
              opacity: 1,
              y: 0,
              x: 0,
              clipPath: 'inset(0 0% 0 0)',
              duration: 0.95,
              ease: 'power2.inOut',
            },
            '-=0.38',
          )
          .to(
            byteGlow,
            {
              filter: `drop-shadow(0 0 18px ${glowColor})`,
              duration: 0.55,
              ease: 'sine.inOut',
            },
            '-=0.25',
          )
          .to(byteGlow, {
            filter: `drop-shadow(0 0 0px ${glowColor})`,
            duration: 0.65,
            ease: 'sine.inOut',
          });

        if (heroSection) {
          const parallax = gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.85,
            },
          });

          parallax
            .to(byteGlow, { y: -68, ease: 'none' }, 0)
            .to(verseMotion, { y: -104, x: 10, ease: 'none' }, 0)
            .to(
              lockup,
              {
                scale: 0.88,
                opacity: 0.2,
                ease: 'none',
              },
              0,
            );
        }

        ScrollTrigger.refresh();
      };

      void waitForBlou().then(runAnimations);
    },
    { scope: lockupRef, dependencies: [shouldAnimate, glowColor] },
  );

  return (
    <div
      ref={lockupRef}
      className={`byteverse-lockup relative inline-block w-fit text-[clamp(3.9rem,19.2vw,10.5rem)]${shouldAnimate ? ' byteverse-lockup--pending' : ''}`}
      role="img"
      aria-label="ByteVerse"
    >
      <div className="byteverse-byte-glow will-change-transform">
        <span
          className={`byteverse-byte font-blou font-black uppercase leading-[0.82] select-none ${color} inline-flex items-end gap-[0.065em]`}
          aria-hidden
        >
          {BYTE_LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className={`byteverse-byte-letter inline-block${index === 0 ? ' relative' : ''}`}
            >
              {letter}
              {index === 0 && <AiStar theme={theme} />}
            </span>
          ))}
        </span>
      </div>

      <div className="byteverse-verse-wrap pointer-events-none absolute z-[2] text-[.75em]">
        <div className="byteverse-verse-motion will-change-transform">
          <span className={`byteverse-verse block${theme === 'light' ? ' byteverse-verse--light' : ''}`}>verse</span>
        </div>
      </div>
    </div>
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
  const content =
    size === 'nav' ? (
      <NavIcon theme={theme} />
    ) : (
      <HeroWordmark theme={theme} animated={animated} />
    );

  if (asLink) {
    return (
      <Link href="/" className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
