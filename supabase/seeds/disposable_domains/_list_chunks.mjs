import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunksDir = path.join(__dirname, '_mcp_chunks');
const files = fs.readdirSync(chunksDir).filter((f) => f.endsWith('.sql')).sort();

const manifest = files.map((f) => ({
  file: f,
  size: fs.statSync(path.join(chunksDir, f)).size,
}));
console.log(JSON.stringify(manifest, null, 2));
