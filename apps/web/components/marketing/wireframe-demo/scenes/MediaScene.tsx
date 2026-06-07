'use client';

import React from 'react';
import { Image, Music, Video } from 'lucide-react';
import type { SceneProps } from '../sceneTypes';
import { WireBox, WireChip, WireLine, WirePanel } from '../WireframePrimitives';

const ASSETS = [
  { label: 'team-meeting.jpg', icon: Image },
  { label: 'intro-clip.mp4', icon: Video },
  { label: 'podcast.m4a', icon: Music },
];

export default function MediaScene({ progress = 0 }: SceneProps) {
  const inserted = progress > 0.55;
  const searching = progress > 0.25 && progress < 0.55;

  return (
    <div className="grid h-full grid-cols-12 gap-2 min-h-0">
      <WirePanel title="Library" className="col-span-4 h-full">
        {ASSETS.map((asset, i) => (
          <WireBox
            key={asset.label}
            accent={searching && i === 0}
            className="mb-1.5 flex items-center gap-2 px-2 py-1.5"
          >
            <asset.icon size={10} className="text-brand-primary" />
            <span className="truncate text-[11px] font-space text-[#4a4f68]">{asset.label}</span>
          </WireBox>
        ))}
        <WireBox accent={searching} className="px-2 py-1.5 text-[11px] font-space text-brand-primary">
          Search Unsplash…
        </WireBox>
      </WirePanel>
      <WirePanel title="Block editor" accent className="col-span-8 h-full">
        <WireLine width="40%" height={10} />
        <WireBox className="mt-2 h-[100px] overflow-hidden p-1" dashed={false}>
          {inserted ? (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-primary/10 to-[#eceef5]">
              <WireChip active>Image inserted</WireChip>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <WireLine width="50%" height={8} />
            </div>
          )}
        </WireBox>
        <div className="mt-2 flex gap-1.5">
          <WireChip>Video</WireChip>
          <WireChip active={inserted}>Image</WireChip>
          <WireChip>Audio</WireChip>
        </div>
      </WirePanel>
    </div>
  );
}
