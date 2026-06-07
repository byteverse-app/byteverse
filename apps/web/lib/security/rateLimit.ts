import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  timestamps: number[];
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

export type RateLimitTier = 'ai' | 'upload' | 'media' | 'general';

const TIER_LIMITS: Record<RateLimitTier, { maxRequests: number; windowMs: number }> = {
  ai: { maxRequests: 20, windowMs: 60_000 },
  upload: { maxRequests: 10, windowMs: 60_000 },
  media: { maxRequests: 30, windowMs: 60_000 },
  general: { maxRequests: 60, windowMs: 60_000 },
};

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}

function getStore(tier: RateLimitTier): Map<string, RateLimitEntry> {
  let store = stores.get(tier);
  if (!store) {
    store = new Map();
    stores.set(tier, store);
  }
  return store;
}

export function checkRateLimit(
  request: NextRequest,
  userId: string,
  tier: RateLimitTier = 'general'
): NextResponse | null {
  const { maxRequests, windowMs } = TIER_LIMITS[tier];
  const key = `${userId}:${getClientIp(request)}`;
  const store = getStore(tier);
  const now = Date.now();
  const windowStart = now - windowMs;

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= maxRequests) {
    const retryAfter = Math.ceil((entry.timestamps[0] + windowMs - now) / 1000);
    return NextResponse.json(
      { error: 'Too many requests', code: 'RATE_LIMITED', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  entry.timestamps.push(now);
  return null;
}
