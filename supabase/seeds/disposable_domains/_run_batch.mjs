#!/usr/bin/env node
/**
 * Splits a batch SQL file into part files under 90KB for agent MCP execution.
 * Usage: node _run_batch.mjs 001
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const num = process.argv[2];
if (!num) {
  console.error('Usage: node _run_batch.mjs <batch_num e.g. 001>');
  process.exit(1);
}

const sqlPath = path.join(__dirname, `batch_${num}.sql`);
const sql = fs.readFileSync(sqlPath, 'utf8');
const chunkSize = 90000;
const parts = [];
for (let i = 0; i < sql.length; i += chunkSize) {
  parts.push(sql.slice(i, i + chunkSize));
}

const outDir = path.join(__dirname, '_parts');
fs.mkdirSync(outDir, { recursive: true });
parts.forEach((part, idx) => {
  const partPath = path.join(outDir, `batch_${num}_part${idx + 1}.txt`);
  fs.writeFileSync(partPath, part, 'utf8');
});

const meta = { batch: num, parts: parts.length, totalLen: sql.length };
fs.writeFileSync(path.join(outDir, `batch_${num}_meta.json`), JSON.stringify(meta));
console.log(JSON.stringify(meta));
