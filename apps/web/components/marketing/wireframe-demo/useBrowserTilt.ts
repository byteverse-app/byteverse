'use client';

import { useCallback, useRef, useState, type PointerEvent } from 'react';

const BASE_ROTATE_Y = -11;
const BASE_ROTATE_X = 2.5;
const MAX_OFFSET_Y = 5;
const MAX_OFFSET_X = 3.5;

export function useBrowserTilt(reducedMotion: boolean) {
  const tiltAreaRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: BASE_ROTATE_X, rotateY: BASE_ROTATE_Y });

  const resetTilt = useCallback(() => {
    setTilt({ rotateX: BASE_ROTATE_X, rotateY: BASE_ROTATE_Y });
  }, []);

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (reducedMotion || !tiltAreaRef.current) return;

      const rect = tiltAreaRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      setTilt({
        rotateY: BASE_ROTATE_Y + x * MAX_OFFSET_Y * 2,
        rotateX: BASE_ROTATE_X - y * MAX_OFFSET_X * 2,
      });
    },
    [reducedMotion]
  );

  return {
    tiltAreaRef,
    tilt,
    handlePointerMove,
    handlePointerLeave: resetTilt,
  };
}
