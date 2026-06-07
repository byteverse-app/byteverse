import { NextRequest, NextResponse } from 'next/server';
import { getSearchService } from '@/lib/search/searchService';
import { getRateLimiter } from '@/lib/search/rateLimiter';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const searchService = getSearchService();
    const rateLimiter = getRateLimiter();
    const usage = rateLimiter.getUsage();
    const cacheStats = searchService.getCacheStats();

    return NextResponse.json({
      usage: {
        lastMinute: usage.lastMinute,
        lastHour: usage.lastHour,
        lastDay: usage.lastDay,
        limits: usage.limits,
        remainingToday: Math.max(0, usage.limits.maxQueriesPerDay - usage.lastDay),
        remainingThisHour: Math.max(0, usage.limits.maxQueriesPerHour - usage.lastHour),
      },
      cache: cacheStats,
      timestamp: Date.now(),
    });
  } catch (error) {
    return internalError(error, 'search/usage');
  }
}
