'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  type ContrastMode,
  resolveContrastMode,
  sampleRegionLuminance,
} from '@/lib/dom/backgroundLuminance';

export function useAdaptiveContrast<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const modeRef = useRef<ContrastMode>('on-dark');
  const [mode, setMode] = useState<ContrastMode>('on-dark');

  const measure = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const luminance = sampleRegionLuminance(rect, element);
    const nextMode = resolveContrastMode(luminance, modeRef.current);

    if (nextMode !== modeRef.current) {
      modeRef.current = nextMode;
      setMode(nextMode);
    }
  }, []);

  useEffect(() => {
    let frame = 0;
    let pending = false;

    const scheduleMeasure = () => {
      if (pending) return;
      pending = true;
      frame = window.requestAnimationFrame(() => {
        pending = false;
        measure();
      });
    };

    scheduleMeasure();

    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    window.addEventListener('load', scheduleMeasure);

    const images = Array.from(document.images);
    images.forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', scheduleMeasure, { once: true });
      }
    });

    const element = ref.current;
    const resizeObserver =
      element && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(scheduleMeasure)
        : null;
    if (element && resizeObserver) {
      resizeObserver.observe(element);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', scheduleMeasure);
      window.removeEventListener('resize', scheduleMeasure);
      window.removeEventListener('load', scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [measure]);

  return { ref, mode };
}
