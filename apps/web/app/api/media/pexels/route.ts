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

    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pexels API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch videos from Pexels' },
        { status: response.status }
      );
    }

    const data = await response.json();

    const videos = data.videos?.map((video: Record<string, unknown>) => {
      const videoFiles = video.video_files as Array<{ width: number; link: string }> | undefined;
      const videoFile = videoFiles?.sort((a, b) => b.width - a.width)[0] || videoFiles?.[0];
      const user = video.user as { name?: string; url?: string } | undefined;

      return {
        id: String(video.id),
        type: 'video' as const,
        thumbnailUrl: video.image,
        fullUrl: videoFile?.link || videoFiles?.[0]?.link,
        width: video.width,
        height: video.height,
        duration: video.duration,
        attribution: `Video by ${user?.name || 'Unknown'} from Pexels`,
        photographer: user?.name,
        photographerUrl: user?.url,
      };
    }) || [];

    return NextResponse.json({
      videos,
      page: data.page || page,
      perPage: data.per_page || perPage,
      totalResults: data.total_results || 0,
      nextPage: data.next_page || null,
    });
  } catch (error) {
    return internalError(error, 'media/pexels');
  }
}
