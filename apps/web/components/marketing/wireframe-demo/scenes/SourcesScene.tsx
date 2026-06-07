'use client';

import React from 'react';
import { FileText, Link2, Upload } from 'lucide-react';
import type { SceneProps } from '../sceneTypes';
import { WireBadge, WireBox, WireLine, WirePanel } from '../WireframePrimitives';

export default function SourcesScene({ progress = 0 }: SceneProps) {
  const uploaded = progress > 0.4;
  const indexed = progress > 0.65;

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <WireLine width="35%" height={8} />
        {indexed ? <WireBadge tone="success">14 chunks indexed for RAG</WireBadge> : <WireBadge tone="neutral">Indexing…</WireBadge>}
      </div>
      <div className="grid flex-1 grid-cols-12 gap-2 min-h-0">
        <WirePanel title="Sources" accent className="col-span-3 h-full">
          <div className="space-y-1.5">
            {[
              { name: 'policy.pdf', icon: FileText },
              { name: 'research.docx', icon: FileText },
              { name: 'brief-url', icon: Link2 },
            ].map((file, i) => (
              <WireBox
                key={file.name}
                className={`flex items-center gap-1.5 px-2 py-1.5 ${uploaded && i === 0 ? 'opacity-100' : uploaded ? 'opacity-100' : i > 0 ? 'opacity-40' : 'opacity-100'}`}
              >
                <file.icon size={10} className="text-brand-primary" />
                <span className="truncate text-[11px] font-space text-[#4a4f68]">{file.name}</span>
              </WireBox>
            ))}
            <WireBox
              accent={uploaded && progress < 0.65}
              className={`flex items-center justify-center gap-1 py-2 ${uploaded ? 'border-brand-primary/40' : ''}`}
            >
              <Upload size={10} className="text-brand-primary" />
              <span className="text-[11px] font-space font-bold text-brand-primary">Add sources</span>
            </WireBox>
          </div>
        </WirePanel>
        <WirePanel title="ByteAI" className="col-span-5 h-full">
          <WireBox className="mb-1.5 px-2 py-1.5">
            <WireLine width="70%" height={6} />
          </WireBox>
          {indexed ? (
            <WireBox accent className="px-2 py-1.5">
              <p className="text-[11px] font-space leading-relaxed text-[#4a4f68]">
                Sources indexed. Ready to shape a 5-minute module for new hires.
              </p>
            </WireBox>
          ) : (
            <WireBox className="px-2 py-1.5">
              <WireLine width="80%" height={6} />
            </WireBox>
          )}
        </WirePanel>
        <WirePanel title="Studio" className="col-span-4 h-full">
          <WireBox className="flex h-full flex-col justify-center px-2 py-2 text-center">
            <p className="text-[11px] font-space font-bold text-[#8b90a8]">Interactive Course</p>
            <WireLine width="55%" className="mx-auto mt-2" height={6} />
          </WireBox>
        </WirePanel>
      </div>
    </div>
  );
}
