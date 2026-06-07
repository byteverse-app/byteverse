# Legacy Project Reuse Map

ByteVerse `apps/web` is assembled from prior ByteAI experiments. This document tracks provenance.

## ByteLab (primary port)

**Source:** `Dhani-Laboratory/ByteAI/ByteLab`

| Area | ByteVerse path |
|------|----------------|
| Chat workspace | `components/Workspace/ChatPanel.tsx`, `app/app/[projectId]/` |
| Sources + RAG | `components/Workspace/AddSourcesModal.tsx`, `lib/rag/` |
| Generation APIs | `app/api/generate/` |
| SCORM export | `lib/scorm/` |
| Editor + preview | `components/Editor/`, `components/Workspace/CoursePreview.tsx` |
| Validation | `lib/validation/` |
| Media search | `app/api/media/`, `lib/media/` |

Rebranded: ByteLab → ByteVerse in UI strings; routes `/course/*` → `/app/*` where applicable.

## htmlcontentgen (export template)

**Source:** `Dhani-Laboratory/ByteAI/htmlcontentgen`

| Area | ByteVerse path |
|------|----------------|
| Birb HTML micro-course | `packages/export-html/` (`CourseGenerator`, interactive components) |
| Template id | `birb-micro` in export pipeline |

## ByteJulNewTryagain (prompts only)

**Source:** Flask microlearning generator

| Area | ByteVerse path |
|------|----------------|
| 10/70/15/5 time model | `lib/prompts/microlearningPrompt.ts` |
| Bloom / cognitive framing | System prompts for outline + content generation |

Not ported: Flask UI, PPTX template JSON pipeline (future phase).

## byteverse repo (marketing)

**Source:** Original Vite landing site

| Area | ByteVerse path |
|------|----------------|
| Cosmic animations | `components/marketing/space/`, `components/marketing/sections/` |
| Brand assets | `public/images/` |
| bytecourse demo | `public/bytecourse/` |

## Sudar (reference only)

SCORM packages from ByteVerse should import via Sudar Studio `POST /api/courses/import-scorm`. No Sudar application code is vendored into this repo.
