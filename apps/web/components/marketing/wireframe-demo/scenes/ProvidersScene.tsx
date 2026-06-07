'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

const PROVIDERS = [
  { name: 'ByteVerse AI', tag: 'Included', active: true },
  { name: 'OpenAI', tag: 'BYOK', active: false },
  { name: 'Groq', tag: 'BYOK', active: false },
  { name: 'Ollama', tag: 'Local', active: false },
];

export default function ProvidersScene({ progress = 0 }: SceneProps) {
  const switched = progress > 0.4;
  const activeIndex = switched ? 1 : 0;

  return (
    <div className="flex h-full flex-col gap-2">
      <WireLine width="50%" height={10} />
      <WirePanel accent className="flex-1 min-h-0">
        <div className="grid grid-cols-2 gap-2">
          {PROVIDERS.map((provider, i) => (
            <WireBox
              key={provider.name}
              accent={i === activeIndex}
              className={`px-2 py-2 ${i === activeIndex ? 'ring-1 ring-brand-primary/25' : ''}`}
            >
              <p className="text-xs font-syne font-bold text-[#2d3148]">{provider.name}</p>
              <WireChip active={i === activeIndex}>{provider.tag}</WireChip>
            </WireBox>
          ))}
        </div>
        <WireBox className="mt-2 px-2 py-2">
          <WireLine width="75%" />
          <WireLine width="55%" className="mt-1.5" />
          <p className="mt-2 text-[11px] font-space text-[#6b708a]">
            {switched ? 'Using your OpenAI key — your model, your choice' : 'ByteVerse AI included — free and unlimited'}
          </p>
        </WireBox>
      </WirePanel>
    </div>
  );
}
