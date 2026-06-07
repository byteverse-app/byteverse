#!/usr/bin/env node
/**
 * Reads batch SQL files and writes them as single-line JSON for MCP execute_sql.
 * Usage: node _mcp_batch.mjs 001
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const num = process.argv[2];
if (!num) {
  console.error('Usage: node _mcp_batch.mjs <001-013>');
  process.exit(1);
}

const sqlPath = path.join(__dirname, `batch_${num}.sql`);
const sql = fs.readFileSync(sqlPath, 'utf8');
const outPath = path.join(__dirname, '_mcp_out', `batch_${num}.json`);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify({ query: sql }), 'utf8');
console.log(JSON.stringify({ batch: num, chars: sql.length, out: outPath }));
