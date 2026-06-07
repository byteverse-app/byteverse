import { NextRequest, NextResponse } from 'next/server';
import { resolveProvider } from '@/lib/ai/resolveProvider';
import { providerConfigFromBody } from '@/lib/ai/providerRequest';
import { AIProvider, ProviderRequestConfig } from '@/lib/ai/providers/types';

export async function POST(request: NextRequest) {
  try {
    const {
      provider = 'together',
      providerConfig,
    }: {
      provider?: AIProvider;
      providerConfig?: ProviderRequestConfig;
    } = await request.json();

    const aiProvider = resolveProvider(provider, providerConfigFromBody(provider, providerConfig));

    if (!aiProvider) {
      return NextResponse.json(
        {
          ok: false,
          error: `Provider "${provider}" is not configured. Add your API key or base URL in workspace settings.`,
        },
        { status: 400 }
      );
    }

    const response = await aiProvider.chatCompletion(
      [{ role: 'user', content: 'Reply with exactly: ByteVerse connection OK' }],
      { maxTokens: 20, temperature: 0 }
    );

    const ok = response.content.toLowerCase().includes('ok') || response.content.length > 0;

    return NextResponse.json({
      ok,
      message: ok
        ? `Connected to ${aiProvider.name} successfully`
        : 'Provider responded but output was unexpected',
      preview: response.content.substring(0, 100),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Connection test failed',
        message: error instanceof Error ? error.message : 'Connection test failed',
      },
      { status: 500 }
    );
  }
}
