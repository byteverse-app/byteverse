/**
 * Preview auth email HTML locally.
 * Run from apps/web: node scripts/preview-auth-email.mjs confirmation
 */
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { buildEmailTemplate, TEMPLATE_MAP } from '../lib/email/buildTemplate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const type = process.argv[2] ?? 'confirmation';
const config = TEMPLATE_MAP[type];

if (!config) {
  console.error(`Unknown template type: ${type}`);
  console.error('Available:', Object.keys(TEMPLATE_MAP).join(', '));
  process.exit(1);
}

const html = buildEmailTemplate(config.contentFile, config.title)
  .replace(/\{\{\s*\.ConfirmationURL\s*\}\}/g, 'https://byteverse.app/auth/callback?code=preview')
  .replace(/\{\{\s*\.Token\s*\}\}/g, '123456')
  .replace(/\{\{\s*\.NewEmail\s*\}\}/g, 'you@example.com')
  .replace(/\{\{\s*\.OldEmail\s*\}\}/g, 'old@example.com')
  .replace(/\{\{\s*\.Email\s*\}\}/g, 'you@example.com');

const outDir = resolve(__dirname, '../.email-preview');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, `${type}.html`);
writeFileSync(outPath, html, 'utf8');
console.log(`Wrote ${outPath}`);
