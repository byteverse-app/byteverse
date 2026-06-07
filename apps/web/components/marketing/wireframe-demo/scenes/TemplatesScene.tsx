'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

const TEMPLATES = [
  { name: 'Birb Classic', active: false },
  { name: 'Dimension', active: true },
  { name: 'Editorial', active: false },
];

export default function TemplatesScene({ progress = 0 }: SceneProps) {
  const selected = progress > 0.35 ? 1 : progress > 0.15 ? 0 : -1;

  return (
    <div className="flex h-full flex-col gap-2">
      <WireLine width="45%" height={10} />
      <div className="grid flex-1 grid-cols-3 gap-2 min-h-0">
        {TEMPLATES.map((tpl, i) => (
          <WirePanel
            key={tpl.name}
            accent={selected === i}
            className={`flex h-full flex-col ${selected === i ? 'ring-2 ring-brand-primary/25' : ''}`}
          >
            <WireBox className="mb-2 flex-1 min-h-[80px] bg-gradient-to-br from-[#eceef5] to-white" dashed={false} />
            <p className="text-xs font-syne font-bold text-[#2d3148]">{tpl.name}</p>
            <WireLine width="60%" height={6} className="mt-1" />
          </WirePanel>
        ))}
      </div>
      <WireBox
        accent={progress > 0.75}
        className={`py-2 text-center text-xs font-space font-bold ${progress > 0.75 ? 'text-brand-primary' : 'text-[#6b708a]'}`}
      >
        Open workspace →
      </WireBox>
    </div>
  );
}
