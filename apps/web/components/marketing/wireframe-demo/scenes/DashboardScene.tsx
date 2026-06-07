'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

export default function DashboardScene({ progress = 0 }: SceneProps) {
  const highlightCreate = progress > 0.45;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <WireLine width="35%" height={10} />
        <WireChip active>All projects</WireChip>
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2 min-h-0">
        {['Compliance 101', 'Sales onboarding'].map((title) => (
          <WirePanel key={title} className="flex h-full flex-col justify-between">
            <WireLine width="70%" height={8} />
            <WireLine width="50%" height={6} />
            <WireChip>{title}</WireChip>
          </WirePanel>
        ))}
        <WirePanel
          accent={highlightCreate}
          className={`flex h-full flex-col items-center justify-center gap-2 transition-all ${highlightCreate ? 'ring-2 ring-brand-primary/30' : ''}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/15">
            <Plus size={14} className="text-brand-primary" />
          </div>
          <p className="text-xs font-syne font-bold text-brand-primary">Create a module</p>
        </WirePanel>
      </div>
    </div>
  );
}
