/**
 * Live Auth API checks for disposable email policy (no credentials stored).
 * Run from apps/web: node scripts/test-disposable-signup-live.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const env = {};
  const raw = readFileSync(resolve(__dirname, '../.env.local'), 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const disposableEmail = `hook-test-${Date.now()}@mailinator.com`;
const unknownEmail = `no-user-${Date.now()}@example.com`;

console.log('=== Live signUp with disposable email (hook should block) ===');
const signUp = await supabase.auth.signUp({
  email: disposableEmail,
  password: 'TestPass123!',
});
if (signUp.error) {
  const msg = signUp.error.message;
  const blocked =
    msg.toLowerCase().includes('temporary') ||
    msg.toLowerCase().includes('disposable') ||
    signUp.error.status === 403;
  console.log('Error:', msg);
  console.log(blocked ? 'OK — blocked by server' : 'WARN — error but not clearly disposable block');
} else if (signUp.data.user) {
  console.log('FAIL — user created despite disposable domain (hook may not be wired)');
} else {
  console.log('No user returned (unexpected)');
}

console.log('\n=== Live signUp with real-looking email (confirmation behavior) ===');
const realish = `confirm-test-${Date.now()}@example.com`;
const realSignUp = await supabase.auth.signUp({
  email: realish,
  password: 'TestPass123!',
});
if (realSignUp.error) {
  console.log('Error (may be expected for example.com):', realSignUp.error.message);
} else {
  const hasSession = !!realSignUp.data.session;
  console.log('User created:', !!realSignUp.data.user);
  console.log('Session issued:', hasSession, hasSession ? 'WARN autoconfirm on' : 'OK confirmation required');
}

console.log('\n=== Magic link shouldCreateUser:false for unknown email ===');
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
  console.log('Error:', otp.error.message);
  console.log(noCreate ? 'OK — no account created path' : 'INFO — check error matches no-create policy');
} else {
  console.log('OTP sent (Supabase may not reveal whether user exists — check Auth logs)');
}

console.log('\nDone.');
