'use client';

import React from 'react';
import type { SceneProps } from '../sceneTypes';
import { WireBadge, WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

export default function ChatScene({ progress = 0 }: SceneProps) {
  const userSent = progress > 0.2;
  const aiReplied = progress > 0.45;
  const readyGenerate = progress > 0.75;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {aiReplied ? <WireBadge>Grounded in your sources</WireBadge> : null}
        <WireChip active>ByteVerse AI</WireChip>
      </div>
      <div className="grid flex-1 grid-cols-12 gap-2 min-h-0">
        <WirePanel title="Sources" className="col-span-3 h-full">
          <WireBox className="mb-1.5 px-2 py-1.5">
            <WireLine width="65%" height={6} />
          </WireBox>
          <WireBox className="px-2 py-1.5">
            <WireLine width="80%" height={6} />
          </WireBox>
        </WirePanel>
        <WirePanel title="ByteAI chat" accent className="col-span-6 h-full">
          <div className="space-y-1.5">
            {userSent ? (
              <WireBox className="ml-auto max-w-[88%] bg-[#eceef5] px-2 py-1.5">
                <p className="text-[11px] font-space leading-relaxed text-[#4a4f68]">
                  5-min onboarding for sales hires — compliance basics.
                </p>
              </WireBox>
            ) : (
              <WireBox className="ml-auto max-w-[60%] px-2 py-1.5">
                <WireLine width="100%" height={6} />
              </WireBox>
            )}
            {aiReplied ? (
              <WireBox accent className="max-w-[92%] px-2 py-1.5">
                <p className="text-[11px] font-space leading-relaxed text-[#4a4f68]">
                  Level 2 Apply · conversational tone · SCQA from policy.pdf.
                </p>
              </WireBox>
            ) : null}
            {aiReplied ? (
              <div className="flex flex-wrap gap-1 pt-0.5">
                <WireChip active>Audience: new hires</WireChip>
                <WireChip>Tone: conversational</WireChip>
              </div>
            ) : null}
          </div>
        </WirePanel>
        <WirePanel title="Actions" className="col-span-3 h-full">
          <WireBox accent={readyGenerate} className={`py-2 text-center text-[11px] font-space font-bold ${readyGenerate ? 'text-brand-primary ring-2 ring-brand-primary/25' : 'text-[#6b708a]'}`}>
            Generate course →
          </WireBox>
        </WirePanel>
      </div>
    </div>
  );
}
