import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const partsDir = path.join(__dirname, '_parts');

for (let b = 1; b <= 13; b++) {
  const num = String(b).padStart(3, '0');
  const meta = JSON.parse(fs.readFileSync(path.join(partsDir, `batch_${num}_meta.json`), 'utf8'));
  let sql = '';
  for (let p = 1; p <= meta.parts; p++) {
    sql += fs.readFileSync(path.join(partsDir, `batch_${num}_part${p}.txt`), 'utf8');
  }
  const orig = fs.readFileSync(path.join(__dirname, `batch_${num}.sql`), 'utf8');
  if (sql !== orig) {
    console.error(`MISMATCH batch_${num}: ${sql.length} vs ${orig.length}`);
    process.exit(1);
  }
  fs.writeFileSync(path.join(__dirname, '_mcp_ready', `batch_${num}.sql`), sql, 'utf8');
  console.log(`batch_${num}: ${sql.length} ok`);
}
