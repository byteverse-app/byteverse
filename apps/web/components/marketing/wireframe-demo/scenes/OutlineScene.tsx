'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBadge, WireBox, WireButton, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

const BLOCKS = ['Hook · 0:30', 'Concept · 1:30', 'Practice · 2:00', 'Check · 0:45', 'Recap · 0:30'];

export default function OutlineScene({ progress = 0 }: SceneProps) {
  const approved = progress > 0.7;
  const visibleCount = Math.min(BLOCKS.length, Math.floor(progress * BLOCKS.length) + 1);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <WireBadge>Outline review</WireBadge>
        <WireChip active>3–7 min budget</WireChip>
      </div>
      <WirePanel accent className="flex-1 min-h-0 overflow-hidden">
        <div className="space-y-1.5">
          {BLOCKS.slice(0, visibleCount).map((block, i) => (
            <WireBox
              key={block}
              accent={i === 1}
              className="flex items-center justify-between px-2 py-1.5"
            >
              <span className="text-xs font-space text-[#4a4f68]">{block}</span>
              <WireLine width={48} height={6} />
            </WireBox>
          ))}
        </div>
      </WirePanel>
      <WireButton primary={approved} className={approved ? 'ring-2 ring-brand-primary/30' : ''}>
        {approved ? '✓ Approve & generate' : 'Review outline…'}
      </WireButton>
    </div>
  );
}
