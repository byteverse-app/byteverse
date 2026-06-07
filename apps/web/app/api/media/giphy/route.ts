import { NextRequest, NextResponse } from 'next/server';
import { getGiphySearch } from '@/lib/media/giphySearch';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'media', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const maxResults = parseInt(searchParams.get('per_page') || '20');
    const rating = (searchParams.get('rating') || 'g') as 'g' | 'pg' | 'pg-13' | 'r';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const giphySearch = getGiphySearch();

    if (!giphySearch.isAvailable()) {
      return NextResponse.json(
        { error: 'Giphy API is not configured. Please set GIPHY_API_KEY' },
        { status: 500 }
      );
    }

    const results = await giphySearch.search(query, {
      maxResults: Math.min(maxResults, 50),
      rating,
    });

    const images = results.map((result, index) => ({
      id: `giphy-${Date.now()}-${index}`,
      type: 'gif' as const,
      thumbnailUrl: result.thumbnailUrl,
      fullUrl: result.url,
      rawUrl: result.url,
      width: result.width,
      height: result.height,
      attribution: result.title || 'GIF from Giphy',
      photographer: 'Giphy',
      photographerUrl: result.giphyUrl || '',
      provider: 'giphy' as const,
      mediaType: 'gif' as const,
    }));

    return NextResponse.json({
      images,
      totalResults: images.length,
    });
  } catch (error) {
    return internalError(error, 'media/giphy');
  }
}
