'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireButton, WireLine, WirePanel } from '../WireframePrimitives';

export default function ExportScene({ progress = 0 }: SceneProps) {
  const scormClicked = progress > 0.25;
  const sudarFocus = progress > 0.65;

  return (
    <div className="grid h-full grid-cols-2 gap-2 min-h-0">
      <WirePanel title="Download" accent className="h-full">
        <div className="grid grid-cols-2 gap-1.5">
          <WireButton primary className={scormClicked ? 'ring-2 ring-brand-primary/40' : ''}>
            SCORM 1.2
          </WireButton>
          <WireButton>HTML package</WireButton>
          <WireButton>JSON source</WireButton>
          <WireButton>Full ZIP</WireButton>
        </div>
        {scormClicked ? (
          <WireBox accent className="mt-2 px-2 py-1.5 text-[11px] font-space text-brand-primary">
            ✓ imsmanifest.xml ready
          </WireBox>
        ) : null}
      </WirePanel>
      <WirePanel title="Sudar" className={`h-full ${sudarFocus ? 'ring-1 ring-brand-export/30' : ''}`}>
        <div className="rounded-lg border border-brand-export/30 bg-brand-export/[0.05] px-2 py-2">
          <p className="text-xs font-syne font-bold text-brand-export">Sudar Learn</p>
          <p className="mt-1 text-[11px] font-space text-[#6b708a]">Adaptive paths + AI tutor</p>
        </div>
        <div className="mt-2 space-y-1">
          {['Export', 'Import in Studio', 'Publish'].map((step, i) => (
            <WireBox key={step} className="flex items-center gap-1.5 px-2 py-1">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-export/15 text-[8px] font-bold text-brand-export">
                {i + 1}
              </span>
              <span className="text-[11px] font-space text-[#4a4f68]">{step}</span>
            </WireBox>
          ))}
        </div>
        {sudarFocus ? <WireLine width="70%" height={5} className="mt-2" /> : null}
      </WirePanel>
    </div>
  );
}
