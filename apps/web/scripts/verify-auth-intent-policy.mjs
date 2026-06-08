/**
 * Verify auth intent separation for invite-only registration.
 * Run: node scripts/verify-auth-intent-policy.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(__dirname, '..');

function read(relPath) {
  return readFileSync(resolve(webRoot, relPath), 'utf8');
}

console.log('=== Auth intent module ===');
const authIntent = read('lib/auth/authIntent.ts');
const checks = [
  ["AUTH_INTENT_PARAM = 'intent'", authIntent.includes("AUTH_INTENT_PARAM = 'intent'")],
  ['buildAuthCallbackUrl', authIntent.includes('buildAuthCallbackUrl')],
  ['isNewAuthUser', authIntent.includes('isNewAuthUser')],
  ['AUTH_INTENT_STORAGE_KEY', authIntent.includes('byteverse-auth-intent')],
];
for (const [label, ok] of checks) {
  console.log(`${label}:`, ok ? 'OK' : 'FAIL');
}

console.log('\n=== Login uses intent=login ===');
const login = read('app/login/LoginClient.tsx');
console.log('buildAuthCallbackUrl intent login:', login.includes("intent: 'login'") ? 'OK' : 'FAIL');
console.log('clear-oauth-prep before OAuth:', login.includes('clear-oauth-prep') ? 'OK' : 'FAIL');
console.log('magic link shouldCreateUser false:', login.includes('shouldCreateUser: false') ? 'OK' : 'FAIL');

console.log('\n=== Signup uses intent=signup ===');
const signup = read('app/signup/SignupClient.tsx');
console.log('buildAuthCallbackUrl intent signup:', signup.includes("intent: 'signup'") ? 'OK' : 'FAIL');
console.log('complete invite mode:', signup.includes('completeInviteMode') ? 'OK' : 'FAIL');
console.log('new_account_use_signup handling:', signup.includes('new_account_use_signup') ? 'OK' : 'FAIL');

console.log('\n=== Callback intent enforcement ===');
const callback = read('app/auth/callback/route.ts');
console.log('login branch isNewAuthUser:', callback.includes("intent === 'login'") && callback.includes('isNewAuthUser') ? 'OK' : 'FAIL');
console.log('signup applies cookie only:', callback.includes("intent === 'signup'") && callback.includes('VERIFIED_INVITE_COOKIE') ? 'OK' : 'FAIL');
console.log('new_account_use_signup redirect:', callback.includes('new_account_use_signup') ? 'OK' : 'FAIL');

console.log('\n=== Defense in depth ===');
const appLayout = read('app/app/layout.tsx');
console.log('app layout invite check:', appLayout.includes('checkUserInviteAccess') ? 'OK' : 'FAIL');
const pending = read('components/auth/PendingInviteHandler.tsx');
console.log('pending invite signup intent guard:', pending.includes('hasSignupAuthIntent') ? 'OK' : 'FAIL');

console.log('\n=== Manual test checklist ===');
const manual = [
  '1. Login magic link with unknown email → blocked (no account message)',
  '2. Login Google with NEW Gmail → signed out, /signup?error=new_account_use_signup, cannot reach /app',
  '3. Signup Google WITHOUT invite → blocked at callback, /signup?error=invite_required',
  '4. Signup Google WITH valid invite → /app access, profiles.signup_code_used set',
  '5. Login Google with EXISTING invited account → /app access',
  '6. Validate invite on /signup tab A, login Google new account tab B within 10 min → invite NOT applied',
  '7. Orphan recovery: login Google (new) → signup complete-invite with code → /app access',
  '8. Email signup with confirm link → access after confirm, referral/invite redemption recorded',
];
manual.forEach((line) => console.log(line));

console.log('\n=== Supabase hook (run separately) ===');
console.log('node scripts/configure-auth-signup.mjs');
console.log('node scripts/verify-email-signup-policy.mjs');
