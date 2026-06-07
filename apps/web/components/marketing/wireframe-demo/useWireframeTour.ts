'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { TOUR_STEPS } from './tourSteps';

interface UseWireframeTourOptions {
  isInView: boolean;
}

export function useWireframeTour({ isInView }: UseWireframeTourOptions) {
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const activeStep = TOUR_STEPS[activeIndex];
  const durationMs = activeStep.durationMs;

  const clearTimer = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      const nextIndex = ((index % TOUR_STEPS.length) + TOUR_STEPS.length) % TOUR_STEPS.length;
      setActiveIndex(nextIndex);
      setProgress(0);
      elapsedRef.current = 0;
      startedAtRef.current = performance.now();
    },
    []
  );

  const goNext = useCallback(() => {
    goToStep(activeIndex + 1);
  }, [activeIndex, goToStep]);

  const goPrev = useCallback(() => {
    goToStep(activeIndex - 1);
  }, [activeIndex, goToStep]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const pauseOnHover = useCallback(() => {
    setHoverPaused(true);
  }, []);

  const resumeOnHover = useCallback(() => {
    setHoverPaused(false);
    startedAtRef.current = performance.now();
  }, []);

  const isEffectivelyPaused = isPaused || hoverPaused || !isInView || !!reducedMotion;

  useEffect(() => {
    startedAtRef.current = performance.now();
    elapsedRef.current = 0;
    setProgress(0);
  }, [activeIndex]);

  useEffect(() => {
    clearTimer();

    if (isEffectivelyPaused) {
      elapsedRef.current += performance.now() - startedAtRef.current;
      return;
    }

    startedAtRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = elapsedRef.current + (now - startedAtRef.current);
      const nextProgress = Math.min(elapsed / durationMs, 1);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        goToStep(activeIndex + 1);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return clearTimer;
  }, [activeIndex, clearTimer, durationMs, goToStep, isEffectivelyPaused]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return {
    activeStep,
    activeIndex,
    progress,
    isPaused,
    isEffectivelyPaused,
    reducedMotion: !!reducedMotion,
    goToStep,
    goNext,
    goPrev,
    togglePause,
    pauseOnHover,
    resumeOnHover,
  };
}
