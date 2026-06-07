import type { TourStepId } from './tourSteps';

export interface CursorKeyframe {
  at: number;
  x: number;
  y: number;
  click?: boolean;
  label?: string;
}

export const CURSOR_PATHS: Record<TourStepId, CursorKeyframe[]> = {
  dashboard: [
    { at: 0, x: 55, y: 18, label: 'Your projects' },
    { at: 0.35, x: 68, y: 62, label: 'Create a module' },
    { at: 0.55, x: 68, y: 62, click: true, label: 'Create a module' },
    { at: 1, x: 68, y: 62, click: true },
  ],
  templates: [
    { at: 0, x: 28, y: 42, label: 'Birb Classic' },
    { at: 0.4, x: 28, y: 42, click: true, label: 'Pick a template' },
    { at: 0.7, x: 72, y: 78, label: 'Start building' },
    { at: 0.9, x: 72, y: 78, click: true, label: 'Open workspace' },
  ],
  ingest: [
    { at: 0, x: 12, y: 35, label: 'Source files' },
    { at: 0.3, x: 12, y: 72, label: 'Upload PDFs' },
    { at: 0.5, x: 12, y: 72, click: true, label: 'Add sources' },
    { at: 0.75, x: 88, y: 12, label: 'RAG indexed' },
    { at: 1, x: 50, y: 55, label: '14 chunks ready' },
  ],
  chat: [
    { at: 0, x: 52, y: 55, label: 'Type your brief' },
    { at: 0.25, x: 52, y: 55, click: true, label: 'Describe audience & goals' },
    { at: 0.55, x: 38, y: 38, label: 'ByteAI responds' },
    { at: 0.85, x: 82, y: 82, label: 'Generate course' },
    { at: 1, x: 82, y: 82, click: true, label: 'Generate course' },
  ],
  outline: [
    { at: 0, x: 50, y: 28, label: 'Review outline' },
    { at: 0.35, x: 35, y: 52, label: 'Hook → Recap blocks' },
    { at: 0.6, x: 72, y: 82, label: 'Approve outline' },
    { at: 0.85, x: 72, y: 82, click: true, label: 'Start generation' },
  ],
  generate: [
    { at: 0, x: 50, y: 12, label: 'Generation progress' },
    { at: 0.35, x: 42, y: 45, label: 'Concept stage' },
    { at: 0.65, x: 42, y: 62, click: true, label: 'Writing blocks' },
    { at: 1, x: 50, y: 88, label: 'Strong grounding' },
  ],
  edit: [
    { at: 0, x: 10, y: 40, label: 'Stage navigator' },
    { at: 0.3, x: 38, y: 35, label: 'Drag blocks' },
    { at: 0.55, x: 38, y: 35, click: true, label: 'Quiz block' },
    { at: 0.8, x: 78, y: 50, label: 'Live preview' },
  ],
  media: [
    { at: 0, x: 22, y: 38, label: 'Media library' },
    { at: 0.35, x: 22, y: 65, click: true, label: 'Search stock images' },
    { at: 0.65, x: 62, y: 55, label: 'Insert into block' },
    { at: 0.9, x: 62, y: 55, click: true, label: 'Add to lesson' },
  ],
  providers: [
    { at: 0, x: 30, y: 35, label: 'ByteVerse AI included' },
    { at: 0.35, x: 55, y: 50, click: true, label: 'Switch provider' },
    { at: 0.65, x: 70, y: 68, label: 'Bring your own key' },
    { at: 0.9, x: 70, y: 68, click: true, label: 'OpenAI · Groq · Ollama' },
  ],
  export: [
    { at: 0, x: 22, y: 38, label: 'SCORM 1.2' },
    { at: 0.3, x: 22, y: 38, click: true, label: 'Download SCORM' },
    { at: 0.55, x: 48, y: 55, label: 'HTML package' },
    { at: 0.75, x: 78, y: 62, label: 'Sudar handoff' },
    { at: 0.95, x: 78, y: 62, click: true, label: 'Publish on Sudar Learn' },
  ],
};

export function interpolateCursor(path: CursorKeyframe[], progress: number) {
  const clamped = Math.max(0, Math.min(1, progress));
  const pts = path.length ? path : [{ at: 0, x: 50, y: 50 }];

  if (clamped <= pts[0].at) {
    return { x: pts[0].x, y: pts[0].y, label: pts[0].label, clicking: !!pts[0].click };
  }

  for (let i = 1; i < pts.length; i += 1) {
    const prev = pts[i - 1];
    const next = pts[i];
    if (clamped <= next.at) {
      const span = next.at - prev.at || 1;
      const t = (clamped - prev.at) / span;
      const clicking = !!next.click && t > 0.85;
      return {
        x: prev.x + (next.x - prev.x) * t,
        y: prev.y + (next.y - prev.y) * t,
        label: next.label ?? prev.label,
        clicking,
      };
    }
  }

  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, label: last.label, clicking: !!last.click };
}
