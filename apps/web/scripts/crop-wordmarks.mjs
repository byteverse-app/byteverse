/**
 * Trim excess padding from wordmark PNGs (run after replacing source files).
 * Run from apps/web: node scripts/crop-wordmarks.mjs
 */
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const targets = [
  resolve(root, 'public/images/brand/wordmark/byteverse-white.png'),
  resolve(root, 'public/images/brand/wordmark/byteverse-black.png'),
];

for (const file of targets) {
  if (!existsSync(file)) {
    console.error('Missing:', file);
    process.exit(1);
  }

  const result = spawnSync(
    'npx',
    ['--yes', 'sharp-cli', '-i', file, '-o', file, 'trim', '10'],
    { stdio: 'inherit', shell: true, cwd: root },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  console.log('Trimmed', file);
}

const emailLogo = resolve(root, 'public/images/email/byteverse-wordmark-dark.png');
const white = targets[0];
spawnSync('npx', ['--yes', 'sharp-cli', '-i', white, '-o', emailLogo, 'trim', '10'], {
  stdio: 'inherit',
  shell: true,
  cwd: root,
});
console.log('Synced email logo to', emailLogo);
