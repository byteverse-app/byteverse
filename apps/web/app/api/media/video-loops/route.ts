import { NextRequest, NextResponse } from 'next/server';
import { getVideoLoopSearch } from '@/lib/media/videoLoopSearch';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'media', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const maxResults = parseInt(searchParams.get('per_page') || '20');
    const maxDuration = parseInt(searchParams.get('max_duration') || '30');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const videoLoopSearch = getVideoLoopSearch();

    if (!videoLoopSearch.isAvailable()) {
      return NextResponse.json(
        { error: 'Pexels API is not configured. Please set PEXELS_API_KEY' },
        { status: 500 }
      );
    }

    const results = await videoLoopSearch.search(query, {
      maxResults: Math.min(maxResults, 20),
      maxDuration,
    });

    const videos = results.map((result, index) => ({
      id: `video-${Date.now()}-${index}`,
      type: 'video-loop' as const,
      thumbnailUrl: result.thumbnailUrl,
      fullUrl: result.url,
      rawUrl: result.url,
      width: result.width,
      height: result.height,
      attribution: result.title || 'Video from Pexels',
      photographer: result.provider || 'Pexels',
      photographerUrl: '',
      provider: 'pexels-video' as const,
      mediaType: 'video-loop' as const,
      duration: result.duration,
      loop: true,
      autoplay: true,
    }));

    return NextResponse.json({
      images: videos,
      totalResults: videos.length,
    });
  } catch (error) {
    return internalError(error, 'media/video-loops');
  }
}
