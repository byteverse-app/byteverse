'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { TourStep } from './tourSteps';
import { TOUR_STEPS } from './tourSteps';
import { CURSOR_PATHS, interpolateCursor } from './cursorPaths';
import SceneCanvas from './SceneCanvas';
import { BROWSER_HEIGHT_PX, BROWSER_MAX_WIDTH_PX, CHROME_HEIGHT_PX, FOOTER_HEIGHT_PX, SCENE_HEIGHT_PX } from './sceneTypes';
import { useBrowserTilt } from './useBrowserTilt';
import DashboardScene from './scenes/DashboardScene';
import TemplatesScene from './scenes/TemplatesScene';
import SourcesScene from './scenes/SourcesScene';
import ChatScene from './scenes/ChatScene';
import OutlineScene from './scenes/OutlineScene';
import GenerateScene from './scenes/GenerateScene';
import EditScene from './scenes/EditScene';
import MediaScene from './scenes/MediaScene';
import ProvidersScene from './scenes/ProvidersScene';
import ExportScene from './scenes/ExportScene';

const SCENE_MAP = {
  dashboard: DashboardScene,
  templates: TemplatesScene,
  ingest: SourcesScene,
  chat: ChatScene,
  outline: OutlineScene,
  generate: GenerateScene,
  edit: EditScene,
  media: MediaScene,
  providers: ProvidersScene,
  export: ExportScene,
} as const;

interface WireframeBrowserProps {
  activeStep: TourStep;
  activeIndex: number;
  progress: number;
  isPaused: boolean;
  reducedMotion: boolean;
  onSelectStep: (index: number) => void;
  onTogglePause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function WireframeBrowser({
  activeStep,
  activeIndex,
  progress,
  isPaused,
  reducedMotion,
  onSelectStep,
  onTogglePause,
  onPrev,
  onNext,
}: WireframeBrowserProps) {
  const Scene = SCENE_MAP[activeStep.id];
  const cursorPath = CURSOR_PATHS[activeStep.id];
  const { tiltAreaRef, tilt, handlePointerMove, handlePointerLeave } = useBrowserTilt(reducedMotion);
  const demoCursor = interpolateCursor(cursorPath, progress);
  const demoTiltY = reducedMotion ? 0 : ((demoCursor.x - 50) / 50) * 1.8;
  const demoTiltX = reducedMotion ? 0 : ((demoCursor.y - 50) / 50) * -1.2;

  return (
    <div className="relative w-full" style={{ minHeight: BROWSER_HEIGHT_PX }}>
      <div
        ref={tiltAreaRef}
        className="relative w-full origin-left"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          perspective: '1400px',
          perspectiveOrigin: '42% 50%',
        }}
      >
        <motion.div
          className="liquid-glass-browser relative w-full max-w-[820px] overflow-hidden"
          style={{
            maxWidth: BROWSER_MAX_WIDTH_PX,
            height: BROWSER_HEIGHT_PX,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            rotateX: tilt.rotateX + demoTiltX,
            rotateY: tilt.rotateY + demoTiltY,
          }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 18, mass: 0.8 }
          }
        >
          <div className="liquid-glass-browser-top-rim" aria-hidden />
          <div className="liquid-glass-browser-bottom-rim" aria-hidden />

          <div
            className="liquid-glass-browser-chrome flex shrink-0 items-center gap-3 px-4"
            style={{ height: CHROME_HEIGHT_PX }}
          >
            <div className="flex shrink-0 gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex min-w-0 flex-1 items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 backdrop-blur-sm">
              <span className="truncate font-space text-[11px] text-white/50">{activeStep.urlPath}</span>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={onPrev}
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Previous scene"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={onTogglePause}
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label={isPaused ? 'Play tour' : 'Pause tour'}
              >
                {isPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button
                type="button"
                onClick={onNext}
                className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Next scene"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div
            className="liquid-glass-browser-scene relative shrink-0 overflow-hidden bg-[#f4f4f8] px-5 py-4"
            style={{ height: SCENE_HEIGHT_PX }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                className="h-full w-full"
                initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                transition={{ duration: reducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <SceneCanvas
                  cursorPath={cursorPath}
                  progress={progress}
                  reducedMotion={reducedMotion}
                >
                  <Scene reducedMotion={reducedMotion} progress={progress} />
                </SceneCanvas>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            className="liquid-glass-browser-footer flex shrink-0 flex-col justify-center px-4"
            style={{ height: FOOTER_HEIGHT_PX }}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="truncate font-space text-[10px] uppercase tracking-[0.2em] text-white/40">
                {activeIndex + 1}/{TOUR_STEPS.length} · {activeStep.title}
              </p>
              <p className="shrink-0 font-space text-[10px] text-white/30">{isPaused ? 'Paused' : 'Playing'}</p>
            </div>
            <div
              className="flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Product tour scenes"
            >
              {TOUR_STEPS.map((step, index) => {
                const isActive = index === activeIndex;
                const isPast = index < activeIndex;
                const segmentProgress = isActive ? progress : isPast ? 1 : 0;

                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`${step.title}: ${step.headline}`}
                    onClick={() => onSelectStep(index)}
                    title={step.title}
                    className="group relative h-1.5 w-8 shrink-0 overflow-hidden rounded-full bg-white/10 sm:w-10"
                  >
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full bg-brand-primary"
                      initial={false}
                      animate={{ width: `${segmentProgress * 100}%` }}
                      transition={{ duration: reducedMotion ? 0 : 0.12, ease: 'linear' }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
