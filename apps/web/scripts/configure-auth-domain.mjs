/**
 * Configure Supabase Auth site URL and redirect allow list for ByteVerse.
 * Custom auth domain (auth.byteverse.app) must be enabled in Supabase Dashboard first.
 *
 * Run from apps/web: node scripts/configure-auth-domain.mjs
 * Dry run: node scripts/configure-auth-domain.mjs --dry-run
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = 'nnhpstcawlqfosbyjwop';

const SITE_URL = 'https://byteverse.app';
const REDIRECT_URLS = [
  'http://localhost:3000/auth/callback',
  'http://localhost:3000/auth/confirm',
  'https://byteverse.app/auth/callback',
  'https://byteverse.app/auth/confirm',
];

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

const dryRun = process.argv.includes('--dry-run');

async function main() {
  const payload = {
    site_url: SITE_URL,
    uri_allow_list: REDIRECT_URLS.join(','),
  };

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    console.log('\nCustom auth domain (manual, Supabase Pro):');
    console.log('  1. Dashboard → Project Settings → Custom Domains → auth.byteverse.app');
    console.log('  2. Add CNAME record per Supabase instructions');
    console.log('  3. Auth links will use auth.byteverse.app instead of *.supabase.co');
    return;
  }

  const token = loadToken();
  if (!token) {
    console.log('SUPABASE_ACCESS_TOKEN not set.');
    console.log('Set Site URL manually: Authentication → URL Configuration');
    console.log(`  Site URL: ${SITE_URL}`);
    console.log('  Redirect URLs:', REDIRECT_URLS.join('\n               '));
    console.log('\nCustom auth domain: Dashboard → Project Settings → Custom Domains');
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
  console.log('Updated site_url:', updated.site_url);
  console.log('Updated uri_allow_list:', updated.uri_allow_list);
}

main().catch(console.error);
