'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import WireframeBrowser from './WireframeBrowser';
import { TOUR_STEPS } from './tourSteps';
import { useWireframeTour } from './useWireframeTour';

export default function ProductWireframeDemo() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.35, once: false });
  const {
    activeStep,
    activeIndex,
    progress,
    isEffectivelyPaused,
    reducedMotion,
    goToStep,
    goNext,
    goPrev,
    togglePause,
    pauseOnHover,
    resumeOnHover,
  } = useWireframeTour({ isInView });

  return (
    <section ref={sectionRef} className="py-32 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5">
          <p className="font-space text-[10px] font-bold tracking-[0.5em] text-brand-primary uppercase mb-6">
            See it in action
          </p>
          <h2 className="font-syne text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            FROM SOURCES
            <br />
            <span className="text-white/20 italic">TO SCORM</span>
          </h2>
          <p className="font-space text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
            Chat-first microlearning — upload your sources, brief with ByteAI, polish in the editor, and ship
            anywhere.
          </p>

          <motion.div
            key={activeStep.id}
            initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="apple-glass rounded-2xl border border-white/10 p-6 mb-8"
            aria-live="polite"
          >
            <p className="font-space text-[10px] font-bold uppercase tracking-[0.3em] text-brand-primary mb-2">
              {String(activeIndex + 1).padStart(2, '0')} · {activeStep.title}
            </p>
            <h3 className="font-syne text-xl md:text-2xl font-bold mb-3">{activeStep.headline}</h3>
            <p className="font-space text-gray-400 text-sm leading-relaxed">{activeStep.description}</p>
          </motion.div>

          <Link
            href="/app/new"
            className="inline-flex items-center gap-2 font-syne font-bold text-sm text-brand-primary hover:text-white transition-colors"
          >
            Create a module <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div
          className="relative lg:col-span-7"
          style={{ minHeight: 512 }}
          onMouseEnter={pauseOnHover}
          onMouseLeave={resumeOnHover}
          onFocusCapture={pauseOnHover}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              resumeOnHover();
            }
          }}
        >
          <WireframeBrowser
            activeStep={activeStep}
            activeIndex={activeIndex}
            progress={progress}
            isPaused={isEffectivelyPaused}
            reducedMotion={reducedMotion}
            onSelectStep={goToStep}
            onTogglePause={togglePause}
            onPrev={goPrev}
            onNext={goNext}
          />
        </div>
      </div>

      <p className="sr-only">
        Product tour with {TOUR_STEPS.length} scenes. Currently showing {activeStep.title}: {activeStep.headline}.
      </p>
    </section>
  );
}
