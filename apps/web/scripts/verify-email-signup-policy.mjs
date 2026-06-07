/**
 * Verify disposable email blocking setup.
 * Run: node scripts/verify-email-signup-policy.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { createClient } from '@supabase/supabase-js';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_REF = 'nnhpstcawlqfosbyjwop';
const domains = new Set(require('disposable-email-domains').map((d) => d.toLowerCase()));

function loadEnv() {
  const env = {};
  try {
    const raw = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  } catch {
    /* ignore */
  }
  return env;
}

function validateSignupEmail(email) {
  const trimmed = email.trim();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, message: 'invalid' };
  }
  const domain = trimmed.split('@')[1].toLowerCase();
  if (domains.has(domain)) {
    return { ok: false, message: 'disposable' };
  }
  return { ok: true };
}

console.log('=== Client validator (disposable-email-domains package) ===');
console.log('mailinator.com:', validateSignupEmail('user@mailinator.com').ok ? 'FAIL' : 'OK blocked');
console.log('gmail.com:', validateSignupEmail('user@gmail.com').ok ? 'OK allowed' : 'FAIL');

console.log('\n=== Auth config (Management API) ===');
let token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) {
  const env = loadEnv();
  token = env.SUPABASE_ACCESS_TOKEN;
}

if (token) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.ok) {
    const cfg = await res.json();
    console.log('mailer_autoconfirm:', cfg.mailer_autoconfirm, cfg.mailer_autoconfirm === false ? 'OK' : 'WARN');
    console.log(
      'hook_before_user_created_enabled:',
      cfg.hook_before_user_created_enabled,
      cfg.hook_before_user_created_enabled ? 'OK' : 'WARN — run configure-auth-signup.mjs'
    );
    console.log('hook_before_user_created_uri:', cfg.hook_before_user_created_uri ?? '(not set)');
  } else {
    console.log('Failed to read auth config:', res.status);
  }
} else {
  console.log('No SUPABASE_ACCESS_TOKEN — run: node scripts/configure-auth-signup.mjs');
}

console.log('\n=== Live Auth API (magic link no-create) ===');
const env = loadEnv();
if (env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const unknownEmail = `no-user-${Date.now()}@example.com`;
  const otp = await supabase.auth.signInWithOtp({
    email: unknownEmail,
    options: { shouldCreateUser: false },
  });
  if (otp.error) {
    const msg = otp.error.message.toLowerCase();
    const noCreate =
      msg.includes('signups not allowed') ||
      msg.includes('user not found') ||
      msg.includes('not allowed');
    console.log('Unknown email OTP:', otp.error.message);
    console.log(noCreate ? 'OK — shouldCreateUser:false enforced' : 'CHECK — verify error text');
  } else {
    console.log('OTP request accepted (Supabase may not reveal whether user exists)');
  }
} else {
  console.log('Skip live test — missing Supabase env vars');
}

console.log('\nDone.');
