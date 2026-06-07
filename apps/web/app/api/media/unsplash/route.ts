import { NextRequest, NextResponse } from 'next/server';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'media', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || 'nature';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    const accessKey = process.env.UNSPLASH_ACCESS_KEY;
    if (!accessKey) {
      return NextResponse.json(
        { error: 'Unsplash API key not configured' },
        { status: 500 }
      );
    }

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Client-ID ${accessKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch images from Unsplash' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const images = data.results?.map((photo: Record<string, unknown>) => {
      const urls = photo.urls as Record<string, string> | undefined;
      const user = photo.user as { name?: string; links?: { html?: string } } | undefined;
      const links = photo.links as { download?: string } | undefined;

      return {
        id: photo.id,
        type: 'image' as const,
        thumbnailUrl: urls?.thumb,
        fullUrl: urls?.regular,
        rawUrl: urls?.raw,
        width: photo.width,
        height: photo.height,
        attribution: `Photo by ${user?.name || 'Unknown'} on Unsplash`,
        photographer: user?.name,
        photographerUrl: user?.links?.html,
        downloadUrl: links?.download,
      };
    }) || [];

    return NextResponse.json({
      images,
      page: data.page || page,
      perPage: data.per_page || perPage,
      totalResults: data.total || 0,
      totalPages: data.total_pages || 0,
    });
  } catch (error) {
    return internalError(error, 'media/unsplash');
  }
}
