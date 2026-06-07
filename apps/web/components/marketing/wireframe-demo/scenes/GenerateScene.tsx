'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBadge, WireBox, WireLine, WirePanel } from '../WireframePrimitives';

const BLOCKS = ['Hook', 'Concept', 'Practice', 'Check', 'Recap'];

export default function GenerateScene({ progress = 0 }: SceneProps) {
  const stageIndex = Math.min(4, Math.floor(progress * 5));
  const barWidth = Math.min(100, 15 + progress * 85);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <WireBadge tone="success">Strong grounding · 14 chunks</WireBadge>
        <span className="text-[11px] font-space text-[#6b708a]">Stage {stageIndex + 1} of 5</span>
      </div>
      <WireBox className="bg-white p-1" dashed={false}>
        <div className="h-1.5 rounded-full bg-[#eceef5]">
          <div className="h-full rounded-full bg-brand-primary transition-all duration-300" style={{ width: `${barWidth}%` }} />
        </div>
      </WireBox>
      <div className="flex-1 space-y-1.5 overflow-hidden">
        {BLOCKS.map((block, i) => (
          <WirePanel key={block} accent={i === stageIndex} className="py-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  i <= stageIndex ? 'bg-brand-primary text-white' : 'bg-[#eceef5] text-[#8b90a8]'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-syne font-bold text-[#2d3148]">{block}</p>
                {i === stageIndex ? <WireLine width="70%" height={5} className="mt-1" /> : null}
              </div>
            </div>
          </WirePanel>
        ))}
      </div>
    </div>
  );
}
