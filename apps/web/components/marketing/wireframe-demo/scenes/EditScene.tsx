'use client';

import React from 'react';
import { LayoutTemplate, Sparkles } from 'lucide-react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

const BLOCKS = ['Quiz block', 'Video block', 'Flashcard set'];

export default function EditScene({ progress = 0 }: SceneProps) {
  const activeBlock = progress > 0.45 ? 0 : -1;
  const previewUpdate = progress > 0.65;

  return (
    <div className="grid h-full grid-cols-12 gap-2 min-h-0">
      <WirePanel title="Stages" className="col-span-3 h-full">
        {['Hook', 'Concept', 'Practice'].map((stage, i) => (
          <WireBox key={stage} accent={i === 1} className="mb-1.5 px-2 py-1.5 text-[11px] font-space text-[#4a4f68]">
            Stage {i + 1} · {stage}
          </WireBox>
        ))}
      </WirePanel>
      <WirePanel title="Blocks" accent className="col-span-4 h-full">
        {BLOCKS.map((block, i) => (
          <WireBox
            key={block}
            accent={i === activeBlock}
            className={`mb-1.5 flex items-center justify-between px-2 py-1.5 ${i === activeBlock ? 'ring-1 ring-brand-primary/25' : ''}`}
          >
            <span className="text-[11px] font-space text-[#4a4f68]">{block}</span>
            <Sparkles size={9} className="text-brand-primary" />
          </WireBox>
        ))}
        <div className="mt-1 flex items-center gap-1.5">
          <LayoutTemplate size={10} className="text-[#8b90a8]" />
          <WireChip active>Dimension</WireChip>
        </div>
      </WirePanel>
      <WirePanel title="Live preview" className="col-span-5 h-full">
        <WireBox accent={previewUpdate} className="mb-1.5 px-2 py-1.5">
          <WireLine width="45%" height={8} />
        </WireBox>
        <WireBox className="flex-1 px-2 py-3">
          <WireLine width="78%" height={6} />
          <WireLine width="62%" height={6} className="mt-1.5" />
          {previewUpdate ? (
            <WireChip active className="mt-2">
              Quiz added
            </WireChip>
          ) : null}
        </WireBox>
      </WirePanel>
    </div>
  );
}
