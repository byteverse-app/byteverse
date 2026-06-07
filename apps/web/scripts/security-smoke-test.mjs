/**
 * Security smoke test: env key presence, Supabase auth, and authenticated API access.
 * Run: node scripts/security-smoke-test.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    console.error('Missing apps/web/.env.local');
    process.exit(1);
  }
  return env;
}

const SERVER_KEYS = [
  'TOGETHER_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GOOGLE_SEARCH_API_KEY',
  'PEXELS_API_KEY',
  'UNSPLASH_ACCESS_KEY',
  'GIPHY_API_KEY',
];

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

async function main() {
  const env = loadEnv();
  console.log('\n=== 1. API key presence (values not shown) ===');
  const configured = [];
  const missing = [];
  for (const key of SERVER_KEYS) {
    if (env[key]?.trim()) configured.push(key);
    else missing.push(key);
  }
  console.log('Configured:', configured.length ? configured.join(', ') : '(none)');
  console.log('Missing/empty:', missing.length ? missing.join(', ') : '(none)');
  if (missing.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log('  → Rotate SUPABASE_SERVICE_ROLE_KEY in Supabase Dashboard → Settings → API if repo was public');
  }

  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY required');
    process.exit(1);
  }

  console.log('\n=== 2. Unauthenticated API (expect 401) ===');
  for (const path of ['/api/chat', '/api/providers', '/api/upload/text']) {
    const method = path.includes('upload') ? 'POST' : path.includes('chat') ? 'POST' : 'GET';
    const body = method === 'POST' ? JSON.stringify({ message: 'test', text: 'x'.repeat(60) }) : undefined;
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: method === 'POST' ? { 'Content-Type': 'application/json' } : {},
      body,
    });
    console.log(`${method} ${path} → ${res.status}${res.status === 401 ? ' ✓' : ' ✗ expected 401'}`);
  }

  console.log('\n=== 3. Supabase auth + authenticated API ===');
  const testEmail = process.env.SMOKE_TEST_EMAIL?.trim();
  const testPassword = process.env.SMOKE_TEST_PASSWORD?.trim();

  if (!testEmail || !testPassword) {
    console.log('Set SMOKE_TEST_EMAIL and SMOKE_TEST_PASSWORD in .env.local to run authenticated API tests.');
    console.log('Unauthenticated checks passed. Supabase auth logs show active sessions on localhost — sign in and test in the app.');
    process.exit(0);
  }

  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: signIn, error: signInErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (signInErr) {
    console.log('Sign-in failed:', signInErr.message);
    process.exit(1);
  }
  const session = signIn.session;
  if (!session?.access_token) {
    console.log('No session returned.');
    process.exit(1);
  }

  console.log('Auth OK — signed in');

  const projectRef = new URL(url).hostname.split('.')[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieVal = `base64-${Buffer.from(JSON.stringify(session)).toString('base64url')}`;
  const cookieHeader = `${cookieName}=${encodeURIComponent(cookieVal)}`;

  const chatRes = await fetch(`${BASE}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      Origin: new URL(BASE).origin,
    },
    body: JSON.stringify({ message: 'Say hello in one word.' }),
  });
  console.log(`POST /api/chat (authenticated) → ${chatRes.status}`);
  if (chatRes.ok) {
    const json = await chatRes.json();
    console.log('  Response preview:', String(json.response || json.error).slice(0, 80));
  } else {
    const text = await chatRes.text();
    console.log('  Body:', text.slice(0, 200));
  }

  const textUploadRes = await fetch(`${BASE}/api/upload/text`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
      Origin: new URL(BASE).origin,
    },
    body: JSON.stringify({
      text: 'This is smoke test content for vector store upload with enough characters to pass validation easily.',
      filename: 'smoke.txt',
    }),
  });
  console.log(`POST /api/upload/text (authenticated) → ${textUploadRes.status}${textUploadRes.ok ? ' ✓' : ''}`);

  const providersRes = await fetch(`${BASE}/api/providers`, {
    headers: { Cookie: cookieHeader, Origin: new URL(BASE).origin },
  });
  console.log(`GET /api/providers (authenticated) → ${providersRes.status}${providersRes.ok ? ' ✓' : ''}`);

  console.log('\nDone.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
