#!/usr/bin/env node
/**
 * Execute batch SQL files via Supabase REST (postgres) using service role.
 * Fallback when MCP query payload is too large for agent tooling.
 * Usage: node _exec_batches.mjs [batch_num e.g. 001]  (omit to run all)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../../apps/web/.env.local');

function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim();
  }
  return env;
}

const env = loadEnv(envPath);
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const batches = process.argv[2]
  ? [process.argv[2].padStart(3, '0')]
  : Array.from({ length: 13 }, (_, i) => String(i + 1).padStart(3, '0'));

async function execSql(query) {
  const res = await fetch(`${url}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  if (res.status === 404) {
    // rpc not available — use pg meta SQL endpoint via supabase management
    const res2 = await fetch(`${url}/pg`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const text2 = await res2.text();
    return { ok: res2.ok, status: res2.status, body: text2 };
  }
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text };
}

async function main() {
  const results = [];
  for (const num of batches) {
    const file = path.join(__dirname, `batch_${num}.sql`);
    const sql = fs.readFileSync(file, 'utf8');
    process.stderr.write(`Executing batch_${num}.sql (${sql.length} chars)...\n`);
    const r = await execSql(sql);
    results.push({ batch: num, ...r });
    if (!r.ok) {
      console.log(JSON.stringify({ error: true, results }, null, 2));
      process.exit(1);
    }
  }
  console.log(JSON.stringify({ success: true, results }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
