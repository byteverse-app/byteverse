import { NextRequest, NextResponse } from 'next/server';
import { getGoogleImageSearch } from '@/lib/media/googleImageSearch';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'media', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || '';
    const maxResults = parseInt(searchParams.get('per_page') || '20');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const googleImageSearch = getGoogleImageSearch();

    if (!googleImageSearch.isAvailable()) {
      return NextResponse.json(
        { error: 'Google Image Search API is not configured' },
        { status: 500 }
      );
    }

    const results = await googleImageSearch.search(query, {
      maxResults: Math.min(maxResults, 20),
    });

    const images = results.map((result, index) => ({
      id: `google-${Date.now()}-${index}`,
      type: 'image' as const,
      thumbnailUrl: result.thumbnailUrl,
      fullUrl: result.url,
      rawUrl: result.url,
      width: result.width,
      height: result.height,
      attribution: result.title || 'Image from Google',
      photographer: 'Google',
      photographerUrl: result.contextUrl || '',
      provider: 'google' as const,
      mediaType: 'image' as const,
    }));

    return NextResponse.json({
      images,
      totalResults: images.length,
    });
  } catch (error) {
    return internalError(error, 'media/google/images');
  }
}
