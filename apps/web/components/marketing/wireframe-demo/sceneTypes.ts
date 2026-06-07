import type { CursorKeyframe } from './cursorPaths';

export interface SceneProps {
  reducedMotion?: boolean;
  progress?: number;
}

export const BROWSER_MAX_WIDTH_PX = 820;
export const CHROME_HEIGHT_PX = 56;
export const SCENE_HEIGHT_PX = 380;
export const FOOTER_HEIGHT_PX = 76;
export const BROWSER_HEIGHT_PX = CHROME_HEIGHT_PX + SCENE_HEIGHT_PX + FOOTER_HEIGHT_PX;

export type { CursorKeyframe };
