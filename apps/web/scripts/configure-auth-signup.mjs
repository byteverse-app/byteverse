/**
 * Configure auth: email confirmation + before-user-created hook.
 * Requires SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
 * Run from apps/web: node scripts/configure-auth-signup.mjs
 */
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

const token = loadToken();

if (!token) {
  console.log('SUPABASE_ACCESS_TOKEN not set.');
  console.log('Add token to apps/web/.env.local, then re-run this script.');
  console.log('Token: https://supabase.com/dashboard/account/tokens');
  console.log('\nManual fallback:');
  console.log(`  Hook: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/hooks`);
  console.log('        Before User Created → Postgres → public.hook_before_user_created');
  console.log(`  Email confirm: https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers?provider=Email`);
  console.log('        Enable "Confirm email"');
  process.exit(process.env.REQUIRE_AUTH_CONFIG === '1' ? 1 : 0);
}

async function main() {
  const getRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!getRes.ok) {
    console.error('Failed to read auth config:', getRes.status, await getRes.text());
    process.exit(1);
  }
  const current = await getRes.json();
  console.log('Current mailer_autoconfirm:', current.mailer_autoconfirm);
  console.log('Current hook_before_user_created:', current.hook_before_user_created_enabled ?? current.hook_custom_access_token_enabled);

  const patchBody = {
    mailer_autoconfirm: false,
    hook_before_user_created_enabled: true,
    hook_before_user_created_uri: 'pg-functions://postgres/public/hook_before_user_created',
  };

  const patchRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchBody),
  });

  if (!patchRes.ok) {
    const body = await patchRes.text();
    console.error('PATCH failed:', patchRes.status, body);
    console.log('\nIf hook URI format failed, wire manually in Dashboard:');
    console.log('  Authentication → Hooks → Before User Created → public.hook_before_user_created');
    process.exit(1);
  }

  const updated = await patchRes.json();
  console.log('Updated mailer_autoconfirm:', updated.mailer_autoconfirm);
  console.log('Updated hook_before_user_created_enabled:', updated.hook_before_user_created_enabled);
  console.log('Updated hook_before_user_created_uri:', updated.hook_before_user_created_uri);
}

main().catch(console.error);
