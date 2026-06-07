/**
 * Local validation for ByteVerse auth email templates (no live email send).
 * Run from apps/web: node scripts/test-auth-email-templates.mjs
 */
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  buildAuthEmailPatchPayload,
  AUTH_EMAIL_SUBJECTS,
  TEMPLATE_MAP,
  buildEmailTemplate,
} from '../lib/email/buildTemplate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
let failed = false;

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL', message);
    failed = true;
  } else {
    console.log('OK', message);
  }
}

const pngPath = resolve(__dirname, '../public/images/email/byteverse-wordmark-dark.png');
assert(existsSync(pngPath), `email logo PNG exists`);

const payload = buildAuthEmailPatchPayload();
assert(
  payload.mailer_subjects_confirmation === AUTH_EMAIL_SUBJECTS.confirmation,
  'confirmation subject matches',
);

for (const key of Object.keys(TEMPLATE_MAP)) {
  const html = payload[TEMPLATE_MAP[key].contentKey] ?? '';
  assert(html.includes('ByteVerse'), `${key} template mentions ByteVerse`);
  assert(!html.toLowerCase().includes('supabase'), `${key} template has no Supabase mention`);
  assert(html.includes('missioncontrol@byteverse.app'), `${key} template includes support email`);
}

const ACTION_TEMPLATES = ['confirmation', 'magicLink', 'recovery', 'invite', 'emailChange', 'reauthentication'];

for (const type of ACTION_TEMPLATES) {
  const config = TEMPLATE_MAP[type];
  const built = buildEmailTemplate(config.contentFile, config.title);
  assert(built.includes('{{ .'), `${type} preserves Supabase template variables`);
}

const outDir = resolve(__dirname, '../.email-preview');
mkdirSync(outDir, { recursive: true });
writeFileSync(
  resolve(outDir, 'confirmation.html'),
  buildEmailTemplate('confirmation.content.html', 'Confirm your ByteVerse account').replace(
    /\{\{\s*\.ConfirmationURL\s*\}\}/g,
    'https://byteverse.app/auth/callback?code=test',
  ),
  'utf8',
);
assert(existsSync(resolve(outDir, 'confirmation.html')), 'preview HTML generated');

process.exit(failed ? 1 : 0);
