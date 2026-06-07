export const CelestialType = {
  BLACK_HOLE: 'BLACK_HOLE',
  GALAXY: 'GALAXY',
  BINARY_STAR: 'BINARY_STAR',
  NEBULA: 'NEBULA',
  PULSAR: 'PULSAR',
} as const;

export type CelestialTypeValue = (typeof CelestialType)[keyof typeof CelestialType];

export const PIPELINE_STEPS = [
  {
    id: 'ingest',
    name: 'Ingest',
    tagline: 'Sources in',
    description: 'Upload PDFs and docs, paste URLs or text. ByteVerse chunks content for RAG-backed generation.',
    celestialType: CelestialType.GALAXY,
    color: '#5227FF',
  },
  {
    id: 'chat',
    name: 'Chat',
    tagline: 'Brief with ByteAI',
    description: 'Talk through audience, objectives, and tone. No rigid forms—just a creative conversation.',
    celestialType: CelestialType.BLACK_HOLE,
    color: '#7D7DFF',
  },
  {
    id: 'generate',
    name: 'Generate',
    tagline: 'Module out',
    description: 'Pedagogy-first outline and blocks: hook, concept, practice, check, recap (3–7 min).',
    celestialType: CelestialType.NEBULA,
    color: '#5227FF',
  },
  {
    id: 'preview',
    name: 'Preview',
    tagline: 'Polish',
    description: 'Edit blocks, swap templates, run fact-checks, and preview before you ship.',
    celestialType: CelestialType.PULSAR,
    color: '#7D7DFF',
  },
  {
    id: 'export',
    name: 'Export',
    tagline: 'Ship anywhere',
    description: 'SCORM 1.2, HTML package, or JSON. Optional handoff to Sudar for adaptive delivery.',
    celestialType: CelestialType.BINARY_STAR,
    color: '#FF6B35',
  },
] as const;
