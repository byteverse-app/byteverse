/**
 * Sync email header logo from the committed brand wordmark PNG.
 * Run crop-wordmarks.mjs first if wordmark sources were replaced.
 * Run from apps/web: node scripts/generate-email-logo.mjs
 */
import { copyFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(__dirname, '../public/images/brand/wordmark/byteverse-white.png');
const pngPath = resolve(__dirname, '../public/images/email/byteverse-wordmark-dark.png');

if (!existsSync(sourcePath)) {
  console.error('Source wordmark not found:', sourcePath);
  process.exit(1);
}

copyFileSync(sourcePath, pngPath);
console.log('Synced', pngPath, 'from', sourcePath);
