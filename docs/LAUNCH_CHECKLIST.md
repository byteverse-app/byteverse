# ByteVerse launch checklist

## Differentiation (copy & product)

- [x] No "Learns with you, for you" on marketing or app metadata
- [x] No Sudar Studio/Learn/ALP/twin as ByteVerse features
- [x] Primary CTA → `/app` (Start creating)
- [x] Sudar only in Deploy section + export bridge + footer link
- [x] ByteAI framed as authoring engine in prompts (`microlearningPrompt.ts`)

## Technical

- [x] ByteLab ported to `apps/web`
- [x] Marketing animations (CosmicBackground, CreationPipeline + CelestialPreview)
- [x] Routes: `/`, `/app`, `/app/[id]`, `/demo`, `/login`
- [x] SCORM export API + export page
- [x] `packages/export-html` (birb template source)
- [x] Supabase schema migration (`supabase/migrations/001_byteverse_schema.sql`)
- [x] `npm run build` succeeds for `apps/web`

## Deploy (operator)

- [ ] Create Supabase project `byteverse` and run migration
- [ ] Set Vercel env vars from `apps/web/.env.example`
- [ ] Point `byteverse.app` DNS to Vercel (deprecate GitHub Pages workflow when ready)
- [ ] Test SCORM ZIP import in Sudar Studio dev
