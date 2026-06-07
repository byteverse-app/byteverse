import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAX = 85000;

function parseDomains(sql) {
  const m = sql.match(/array\[([\s\S]*)\]::text\[\]/);
  if (!m) throw new Error('parse fail');
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
      } else inStr = true;
      continue;
    }
    if (inStr) cur += c;
  }
  return domains;
}

function makeSql(domains) {
  const quoted = domains.map((d) => `'${d.replace(/'/g, "''")}'`).join(',');
  return `insert into public.blocked_email_domains (domain)
select unnest(array[${quoted}]::text[])
on conflict (domain) do nothing;`;
}

const outDir = path.join(__dirname, '_mcp_chunks');
fs.mkdirSync(outDir, { recursive: true });

for (let b = 1; b <= 13; b++) {
  const num = String(b).padStart(3, '0');
  const sql = fs.readFileSync(path.join(__dirname, `batch_${num}.sql`), 'utf8');
  const domains = parseDomains(sql);
  let chunkIdx = 0;
  let i = 0;
  while (i < domains.length) {
    let lo = i + 1;
    let hi = domains.length;
    let best = i + 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const part = domains.slice(i, mid);
      if (makeSql(part).length <= MAX) {
        best = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    chunkIdx++;
    const part = domains.slice(i, best);
    const out = makeSql(part);
    const name = `batch_${num}_chunk_${String(chunkIdx).padStart(2, '0')}.sql`;
    fs.writeFileSync(path.join(outDir, name), out, 'utf8');
    i = best;
  }
  console.log(`batch_${num}: ${domains.length} domains -> ${chunkIdx} MCP chunks`);
}
