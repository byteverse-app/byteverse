import { NextRequest, NextResponse } from 'next/server';
import { getServerAvailableProviders } from '@/lib/ai/resolveProvider';
import { providerManager } from '@/lib/ai/providers';
import { PROVIDER_REGISTRY, USER_FACING_PROVIDERS, SUPPORT_EMAIL } from '@/lib/ai/providers/registry';
import { withApiAuth } from '@/lib/api/withAuth';
import { internalError } from '@/lib/api/errorResponse';

export async function GET(request: NextRequest) {
  const authResult = await withApiAuth(request, 'general', { requireSameOrigin: true });
  if (!authResult.ok) return authResult.response;

  try {
    const available = getServerAvailableProviders();
    const defaultProvider = available.includes('platform') ? 'platform' : 'together';

    const providers = USER_FACING_PROVIDERS.map((providerId) => ({
      ...PROVIDER_REGISTRY[providerId],
      id: providerId,
      serverConfigured: available.includes(providerId),
    }));

    return NextResponse.json({
      available,
      default: defaultProvider,
      providers,
      supportEmail: SUPPORT_EMAIL,
    });
  } catch (error) {
    return internalError(error, 'providers');
  }
}
