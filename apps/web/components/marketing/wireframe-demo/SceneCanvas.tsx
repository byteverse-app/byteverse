'use client';

import React from 'react';
import WireframeCursor from './WireframeCursor';
import type { CursorKeyframe } from './cursorPaths';
import { SCENE_HEIGHT_PX } from './sceneTypes';

interface SceneCanvasProps {
  children: React.ReactNode;
  cursorPath?: CursorKeyframe[];
  progress?: number;
  reducedMotion?: boolean;
}

export default function SceneCanvas({
  children,
  cursorPath,
  progress = 0,
  reducedMotion = false,
}: SceneCanvasProps) {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: SCENE_HEIGHT_PX }}>
      <div className="absolute inset-0 overflow-hidden">{children}</div>
      {cursorPath?.length ? (
        <WireframeCursor path={cursorPath} progress={progress} reducedMotion={reducedMotion} />
      ) : null}
    </div>
  );
}
