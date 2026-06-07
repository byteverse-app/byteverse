import dns from 'dns/promises';
import net from 'net';

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.google',
]);

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    return false;
  }
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    if (normalized === '::1') return true;
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // ULA
    if (normalized.startsWith('fe80')) return true; // link-local
    return false;
  }
  return false;
}

async function resolveHost(hostname: string): Promise<string[]> {
  const results = await dns.lookup(hostname, { all: true, verbatim: true });
  return results.map((r) => r.address);
}

export async function validateFetchUrl(urlString: string): Promise<{ ok: true; url: URL } | { ok: false; error: string }> {
  let url: URL;
  try {
    url = new URL(urlString);
  } catch {
    return { ok: false, error: 'Invalid URL format' };
  }

  if (url.protocol !== 'https:') {
    return { ok: false, error: 'Only HTTPS URLs are allowed' };
  }

  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local')) {
    return { ok: false, error: 'URL hostname is not allowed' };
  }

  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      return { ok: false, error: 'Private or internal IP addresses are not allowed' };
    }
    return { ok: true, url };
  }

  try {
    const addresses = await resolveHost(hostname);
    for (const address of addresses) {
      if (isPrivateIp(address)) {
        return { ok: false, error: 'URL resolves to a private or internal IP address' };
      }
    }
  } catch {
    return { ok: false, error: 'Unable to resolve URL hostname' };
  }

  return { ok: true, url };
}

export async function safeFetch(
  urlString: string,
  options: { timeoutMs?: number; maxBytes?: number } = {}
): Promise<Response> {
  const validation = await validateFetchUrl(urlString);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const timeoutMs = options.timeoutMs ?? 10_000;
  const maxBytes = options.maxBytes ?? 5 * 1024 * 1024;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(validation.url.toString(), {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ByteVerse/1.0)' },
      signal: controller.signal,
      redirect: 'follow',
    });

    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > maxBytes) {
      throw new Error('Response exceeds maximum allowed size');
    }

    const body = await response.arrayBuffer();
    if (body.byteLength > maxBytes) {
      throw new Error('Response exceeds maximum allowed size');
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } finally {
    clearTimeout(timeout);
  }
}
