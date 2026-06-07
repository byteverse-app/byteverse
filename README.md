# ByteVerse — Microlearning Content Generator

ByteVerse is a **chat-first microlearning factory** for creators. Upload sources, talk through your brief with ByteAI, and export SCORM or HTML packages. For adaptive delivery, host on **[Sudar](https://teachwithsudar.com)** (sibling product—not the same codebase).

## Monorepo

| Path | Purpose |
|------|---------|
| [`apps/web`](apps/web) | Next.js app — marketing (`/`), creator workspace (`/app`), APIs |
| [`packages/export-html`](packages/export-html) | Birb HTML export (from htmlcontentgen) |
| [`docs`](docs) | Positioning, Sudar bridge, legacy reuse map |
| [`supabase/migrations`](supabase/migrations) | ByteVerse-only database schema |

## Quick start

```bash
npm install
cp apps/web/.env.example apps/web/.env.local
# Set TOGETHER_API_KEY at minimum; Supabase optional (localStorage fallback in workspace)
npm run dev
```

- Marketing: http://localhost:3000  
- Creator app: http://localhost:3000/app  
- Demo module: http://localhost:3000/demo  

## Deploy (Vercel)

Set project **Root Directory** to repository root, or use included `vercel.json`. Configure env vars from `apps/web/.env.example`. Use a **separate Supabase project** from Sudar.

## Differentiation

- **ByteVerse**: create & export microlearning modules  
- **Sudar**: learning OS (Studio, Learn, tutor, twin) — import ByteVerse SCORM in Studio  

See [docs/POSITIONING.md](docs/POSITIONING.md) and [docs/SUDAR_BRIDGE.md](docs/SUDAR_BRIDGE.md).

## Legacy

Ported from **ByteLab** (primary), **htmlcontentgen** (birb template), **ByteJul** (pedagogy prompts). Marketing animations from the original Vite byteverse site.
