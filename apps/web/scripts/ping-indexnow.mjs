#!/usr/bin/env node
/**
 * Notify Bing/Yandex (IndexNow) that public ByteVerse URLs were updated.
 * Run after deploy: npm run indexnow:ping --workspace=apps/web
 */

const HOST = 'byteverse.app';
const KEY = 'byteverseindex2026bv';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  'https://byteverse.app',
  'https://byteverse.app/about',
  'https://byteverse.app/showcase',
  'https://byteverse.app/signup',
  'https://byteverse.app/login',
  'https://byteverse.app/forgot-password',
  'https://byteverse.app/llms.txt',
  'https://byteverse.app/llms-full.txt',
];

async function pingIndexNow() {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: URLS };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`IndexNow POST ${res.status}: ${text || '(empty)'}`);
  if (!res.ok && res.status !== 202) {
    process.exitCode = 1;
  }
}

async function pingBingGet() {
  for (const url of URLS) {
    const endpoint = new URL('https://www.bing.com/indexnow');
    endpoint.searchParams.set('url', url);
    endpoint.searchParams.set('key', KEY);
    endpoint.searchParams.set('keyLocation', KEY_LOCATION);
    const res = await fetch(endpoint);
    console.log(`Bing GET ${url} -> ${res.status}`);
  }
}

await pingIndexNow();
await pingBingGet();
