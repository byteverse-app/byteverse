/**
 * API key rotation checklist — reports configured keys and rotation URLs.
 * Run: node scripts/key-rotation-checklist.mjs
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const PROJECT_REF = 'nnhpstcawlqfosbyjwop';

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

const ROTATION_LINKS = {
  SUPABASE_SERVICE_ROLE_KEY: `https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: `https://supabase.com/dashboard/project/${PROJECT_REF}/settings/api`,
  TOGETHER_API_KEY: 'https://api.together.xyz/settings/api-keys',
  OPENAI_API_KEY: 'https://platform.openai.com/api-keys',
  ANTHROPIC_API_KEY: 'https://console.anthropic.com/settings/keys',
  GOOGLE_SEARCH_API_KEY: 'https://console.cloud.google.com/apis/credentials',
  PEXELS_API_KEY: 'https://www.pexels.com/api/new/',
  UNSPLASH_ACCESS_KEY: 'https://unsplash.com/oauth/applications',
  GIPHY_API_KEY: 'https://developers.giphy.com/dashboard/',
};

const env = loadEnv();
console.log('\n=== API key rotation checklist ===\n');
console.log('If this repo was ever public, rotate every configured key below.\n');

for (const [key, url] of Object.entries(ROTATION_LINKS)) {
  const set = Boolean(env[key]?.trim());
  console.log(`${set ? '[SET]' : '[empty]'} ${key}`);
  if (set) console.log(`        Rotate: ${url}`);
}

console.log('\nAfter rotating Supabase keys, update apps/web/.env.local and redeploy.');
console.log('Service role key is server-only — never use NEXT_PUBLIC_ for it.\n');
