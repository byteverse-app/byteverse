'use client';

import React, { useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ByteVerseWordmark from './ByteVerseWordmark';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function ByteVerseHeroTitle() {
  const titleRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!titleRef.current || !lineRef.current || reduceMotion) return;

      const heroSection = titleRef.current.closest('section');

      gsap.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.95,
          delay: 0.95,
          ease: 'power3.inOut',
          transformOrigin: 'center center',
        },
      );

      if (heroSection) {
        gsap.to(titleRef.current, {
          y: -36,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.85,
          },
        });
      }
    },
    { scope: titleRef, dependencies: [reduceMotion] },
  );

  return (
    <div ref={titleRef} className="relative mb-4 overflow-visible will-change-transform">
      <ByteVerseWordmark size="hero" animated />

      <div
        ref={lineRef}
        aria-hidden
        className="mx-auto mt-5 h-px w-[min(72%,22rem)] origin-center bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent"
      />
    </div>
  );
}
