#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envText = fs.readFileSync(path.resolve(__dirname, '../../../apps/web/.env.local'), 'utf8');
const env = Object.fromEntries(
  envText
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i), l.slice(i + 1)];
    })
);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

function parseDomains(sql) {
  const m = sql.match(/array\[([\s\S]*)\]::text\[\]/);
  if (!m) throw new Error('Failed to parse domain array from SQL');
  const inner = m[1];
  const domains = [];
  let cur = '';
  let inStr = false;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === "'" && inner[i - 1] !== '\\') {
      if (inStr) {
        domains.push(cur);
        cur = '';
        inStr = false;
      } else {
        inStr = true;
      }
      continue;
    }
    if (inStr) cur += c;
  }
  return domains;
}

async function upsertChunk(domains) {
  const res = await fetch(`${url}/rest/v1/blocked_email_domains?on_conflict=domain`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates',
    },
    body: JSON.stringify(domains.map((d) => ({ domain: d }))),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${text.slice(0, 500)}`);
  return domains.length;
}

const batches = process.argv[2]
  ? [process.argv[2].padStart(3, '0')]
  : Array.from({ length: 13 }, (_, i) => String(i + 1).padStart(3, '0'));

for (const num of batches) {
  const sql = fs.readFileSync(path.join(__dirname, `batch_${num}.sql`), 'utf8');
  const domains = parseDomains(sql);
  console.log(`batch_${num}: ${domains.length} domains`);
  const CHUNK = 500;
  for (let i = 0; i < domains.length; i += CHUNK) {
    await upsertChunk(domains.slice(i, i + CHUNK));
  }
  console.log(`batch_${num}: ok`);
}
