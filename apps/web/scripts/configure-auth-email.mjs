import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

function loadEnvValue(key) {
  if (process.env[key]?.trim()) return process.env[key].trim();
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith(`${key}=`)) {
        return trimmed.slice(key.length + 1).trim();
      }
    }
  } catch {
    /* ignore */
  }
  return null;
}

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verifyOnly = args.has('--verify');
const withSmtp = args.has('--smtp');

async function main() {
  const { buildAuthEmailPatchPayload, AUTH_EMAIL_SUBJECTS } = await import('../lib/email/buildTemplate.mjs');
  const token = loadToken();

  if (verifyOnly) {
    if (!token) {
      console.error('SUPABASE_ACCESS_TOKEN required for --verify');
      process.exit(1);
    }
    const getRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!getRes.ok) {
      console.error('Failed to read auth config:', getRes.status, await getRes.text());
      process.exit(1);
    }
    const cfg = await getRes.json();
    console.log('SMTP sender name:', cfg.smtp_sender_name ?? '(default)');
    console.log('SMTP admin email:', cfg.smtp_admin_email ?? '(default)');
    console.log('Confirmation subject:', cfg.mailer_subjects_confirmation);
    console.log('Expected confirmation subject:', AUTH_EMAIL_SUBJECTS.confirmation);
    const branded =
      cfg.mailer_subjects_confirmation === AUTH_EMAIL_SUBJECTS.confirmation &&
      (cfg.mailer_templates_confirmation_content ?? '').includes('ByteVerse');
    console.log('Branded templates deployed:', branded ? 'YES' : 'NO');
    process.exit(branded ? 0 : 1);
  }

  const payload = buildAuthEmailPatchPayload();

  if (withSmtp) {
    const smtpPass = loadEnvValue('RESEND_SMTP_PASSWORD');
    const smtpEmail = loadEnvValue('AUTH_SMTP_FROM_EMAIL') ?? 'noreply@auth.byteverse.app';
    if (!smtpPass) {
      console.error('RESEND_SMTP_PASSWORD not set. Add to .env.local or environment.');
      process.exit(1);
    }
    Object.assign(payload, {
      external_email_enabled: true,
      smtp_admin_email: smtpEmail,
      smtp_sender_name: 'ByteVerse',
      smtp_host: 'smtp.resend.com',
      smtp_port: 465,
      smtp_user: 'resend',
      smtp_pass: smtpPass,
    });
  }

  if (dryRun) {
    const preview = { ...payload };
    if (preview.smtp_pass) preview.smtp_pass = '***';
    console.log(JSON.stringify(preview, null, 2));
    return;
  }

  if (!token) {
    console.log('SUPABASE_ACCESS_TOKEN not set.');
    console.log('Manual steps: Supabase Dashboard → Authentication → Email Templates');
    console.log('Preview locally: node scripts/preview-auth-email.mjs confirmation');
    console.log('Dry run payload: node scripts/configure-auth-email.mjs --dry-run');
    process.exit(0);
  }

  const patchRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!patchRes.ok) {
    console.error('PATCH failed:', patchRes.status, await patchRes.text());
    process.exit(1);
  }

  const updated = await patchRes.json();
  console.log('Updated confirmation subject:', updated.mailer_subjects_confirmation);
  console.log('Updated magic link subject:', updated.mailer_subjects_magic_link);
  console.log('Updated recovery subject:', updated.mailer_subjects_recovery);
  if (withSmtp) {
    console.log('Updated SMTP sender:', updated.smtp_sender_name, updated.smtp_admin_email);
  }
}

main().catch(console.error);
