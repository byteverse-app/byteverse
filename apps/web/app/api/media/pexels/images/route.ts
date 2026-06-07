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

    const apiKey = process.env.PEXELS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Pexels API key not configured' },
        { status: 500 }
      );
    }

    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pexels API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch images from Pexels' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const images = data.photos?.map((photo: Record<string, unknown>) => {
      const src = photo.src as Record<string, string> | undefined;
      return {
        id: String(photo.id),
        type: 'image' as const,
        thumbnailUrl: src?.medium || src?.small || '',
        fullUrl: src?.large || src?.original || '',
        rawUrl: src?.original || '',
        width: photo.width,
        height: photo.height,
        attribution: `Photo by ${photo.photographer || 'Unknown'} from Pexels`,
        photographer: photo.photographer || 'Unknown',
        photographerUrl: photo.photographer_url || '',
        downloadUrl: photo.url || '',
      };
    }) || [];

    return NextResponse.json({
      images,
      page: data.page || page,
      perPage: data.per_page || perPage,
      totalResults: data.total_results || 0,
      totalPages: Math.ceil((data.total_results || 0) / perPage),
    });
  } catch (error) {
    return internalError(error, 'media/pexels/images');
  }
}
