export const TOUR_STEP_DURATION_MS = 3800;

export type TourStepId =
  | 'dashboard'
  | 'templates'
  | 'ingest'
  | 'chat'
  | 'outline'
  | 'generate'
  | 'edit'
  | 'media'
  | 'providers'
  | 'export';

export interface TourStep {
  id: TourStepId;
  title: string;
  headline: string;
  description: string;
  urlPath: string;
  durationMs: number;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    headline: 'Start from your project hub',
    description:
      'See all modules in one place — create new, resume drafts, or browse featured templates.',
    urlPath: 'byteverse.app/app',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'templates',
    title: 'Templates',
    headline: 'Pick a visual style in seconds',
    description:
      'Birb Classic, Dimension, Editorial — choose a look that matches your brand before you generate.',
    urlPath: 'byteverse.app/app/new',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'ingest',
    title: 'Ingest',
    headline: 'Turn sources into structured context',
    description:
      'Upload PDFs, docs, URLs, or pasted text. ByteVerse chunks everything for RAG-backed generation.',
    urlPath: 'byteverse.app/app/project',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'chat',
    title: 'Chat',
    headline: 'Brief with ByteAI — no rigid forms',
    description:
      'Talk through audience, objectives, and tone. Every reply is grounded in what you uploaded.',
    urlPath: 'byteverse.app/app/project',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'outline',
    title: 'Outline',
    headline: 'Review pedagogy before you generate',
    description:
      'Approve Hook → Concept → Practice → Check → Recap blocks aligned to a 3–7 minute budget.',
    urlPath: 'byteverse.app/app/project',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'generate',
    title: 'Generate',
    headline: 'Pedagogy-first modules, not generic AI slop',
    description:
      'Progressive stage generation with a grounding meter — strong, moderate, or weak source tie-in.',
    urlPath: 'byteverse.app/app/project',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'edit',
    title: 'Customize',
    headline: 'Polish blocks, swap templates, fact-check',
    description:
      'Visual editor with quizzes, video, flashcards, and live preview. Ship when it feels right.',
    urlPath: 'byteverse.app/app/project/preview-editor',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'media',
    title: 'Media',
    headline: 'Rich media without leaving the editor',
    description:
      'Search stock images, upload assets, and drop them into any block — video, audio, and GIFs supported.',
    urlPath: 'byteverse.app/app/project/preview-editor',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'providers',
    title: 'AI Providers',
    headline: 'Your keys, your models',
    description:
      'ByteVerse AI included free and unlimited. Prefer your own model? Connect OpenAI, Anthropic, Groq, Ollama, Mistral, and more.',
    urlPath: 'byteverse.app/app/settings',
    durationMs: TOUR_STEP_DURATION_MS,
  },
  {
    id: 'export',
    title: 'Export',
    headline: 'Ship anywhere — no vendor lock-in',
    description:
      'SCORM 1.2, HTML package, or JSON source. Optional handoff to Sudar for adaptive delivery.',
    urlPath: 'byteverse.app/app/project/export',
    durationMs: TOUR_STEP_DURATION_MS,
  },
];
