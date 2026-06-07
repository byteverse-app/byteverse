/**
 * Enable leaked-password protection (HIBP) via Supabase Management API.
 * Requires: SUPABASE_ACCESS_TOKEN from https://supabase.com/dashboard/account/tokens
 * Run: node scripts/enable-hibp.mjs
 */
const PROJECT_REF = 'nnhpstcawlqfosbyjwop';
const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.log('SUPABASE_ACCESS_TOKEN not set — enable HIBP manually:');
  console.log(`  https://supabase.com/dashboard/project/${PROJECT_REF}/auth/providers?provider=Email`);
  console.log('  Toggle "Prevent use of leaked passwords" (Pro plan required).');
  process.exit(0);
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
  console.log('Current password_hibp_enabled:', current.password_hibp_enabled);

  if (current.password_hibp_enabled) {
    console.log('Leaked password protection already enabled.');
    return;
  }

  const patchRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password_hibp_enabled: true }),
  });

  if (!patchRes.ok) {
    const body = await patchRes.text();
    console.error('Failed to enable HIBP:', patchRes.status, body);
    console.log('If Pro plan is required, enable manually in Auth → Email provider settings.');
    process.exit(1);
  }

  const updated = await patchRes.json();
  console.log('Updated password_hibp_enabled:', updated.password_hibp_enabled);
}

main().catch(console.error);
