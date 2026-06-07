import { AIProvider } from '@/lib/ai/providers/types';
import { UserProviderSettings } from '@/lib/ai/userProviderConfig';
import { ProviderSource } from './types';

const LOCAL_PROVIDERS: AIProvider[] = ['ollama'];

function isLocalBaseUrl(baseUrl?: string): boolean {
  if (!baseUrl) return false;
  try {
    const host = new URL(baseUrl).hostname;
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');
  } catch {
    return /localhost|127\.0\.0\.1/i.test(baseUrl);
  }
}

/** Maps user-facing `platform` to backend freellmapi for classification. */
export function resolveProviderForClassification(provider: AIProvider): AIProvider {
  if (provider === 'platform' as AIProvider) return 'freellmapi';
  return provider;
}

export function classifyProviderSource(
  provider: AIProvider,
  userConfig?: UserProviderSettings
): ProviderSource {
  const resolved = resolveProviderForClassification(provider);

  if (userConfig?.apiKey && userConfig.apiKey.trim().length > 0) {
    return 'byok';
  }

  if (LOCAL_PROVIDERS.includes(resolved)) {
    return 'local';
  }

  if (resolved === 'custom' && isLocalBaseUrl(userConfig?.baseUrl)) {
    return 'local';
  }

  if (resolved === 'freellmapi' || resolved === 'together') {
    return 'platform';
  }

  if (userConfig?.baseUrl && isLocalBaseUrl(userConfig.baseUrl)) {
    return 'local';
  }

  return 'byok';
}

export function isPlatformLimited(source: ProviderSource): boolean {
  return source === 'platform';
}
