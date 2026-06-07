/**
 * Verify ByteVerse-branded auth email config on Supabase.
 * Run from apps/web: node scripts/verify-auth-email.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { AUTH_EMAIL_SUBJECTS } from '../lib/email/buildTemplate.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = 'nnhpstcawlqfosbyjwop';

function loadToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN?.trim()) {
    return process.env.SUPABASE_ACCESS_TOKEN.trim();
  }
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('SUPABASE_ACCESS_TOKEN=')) {
        return trimmed.slice('SUPABASE_ACCESS_TOKEN='.length).trim();
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

const CHECKS = [
  { label: 'confirmation subject', key: 'mailer_subjects_confirmation', expected: AUTH_EMAIL_SUBJECTS.confirmation },
  { label: 'magic link subject', key: 'mailer_subjects_magic_link', expected: AUTH_EMAIL_SUBJECTS.magicLink },
  { label: 'recovery subject', key: 'mailer_subjects_recovery', expected: AUTH_EMAIL_SUBJECTS.recovery },
  { label: 'invite subject', key: 'mailer_subjects_invite', expected: AUTH_EMAIL_SUBJECTS.invite },
];

async function main() {
  const token = loadToken();
  if (!token) {
    console.log('SUPABASE_ACCESS_TOKEN not set — skipping remote verify.');
    console.log('Deploy templates: node scripts/configure-auth-email.mjs');
    process.exit(0);
  }

  const getRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!getRes.ok) {
    console.error('Failed to read auth config:', getRes.status, await getRes.text());
    process.exit(1);
  }

  const cfg = await getRes.json();
  let failed = false;

  for (const check of CHECKS) {
    const ok = cfg[check.key] === check.expected;
    console.log(`${ok ? 'OK' : 'FAIL'} ${check.label}:`, cfg[check.key] ?? '(missing)');
    if (!ok) failed = true;
  }

  const confirmationBody = cfg.mailer_templates_confirmation_content ?? '';
  const bodyBranded = confirmationBody.includes('ByteVerse') && !confirmationBody.toLowerCase().includes('supabase');
  console.log(`${bodyBranded ? 'OK' : 'FAIL'} confirmation body branded (no Supabase mention)`);
  if (!bodyBranded) failed = true;

  const smtpOk = cfg.smtp_sender_name === 'ByteVerse';
  console.log(`${smtpOk ? 'OK' : 'WARN'} SMTP sender name:`, cfg.smtp_sender_name ?? '(default — configure Resend with --smtp)');
  if (!smtpOk) {
    console.log('  Run: node scripts/configure-auth-email.mjs --smtp (requires RESEND_SMTP_PASSWORD)');
  }

  process.exit(failed ? 1 : 0);
}

main().catch(console.error);
