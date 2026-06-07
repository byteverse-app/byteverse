import { AIProvider, AIProviderConfig, AIProviderInterface } from './providers/types';
import { createProvider, providerManager } from './providers';
import { OpenAICompatibleProvider } from './providers/openaiCompatProvider';
import { PROVIDER_REGISTRY } from './providers/registry';
import { UserProviderSettings } from './userProviderConfig';

const OPENAI_COMPAT_PROVIDERS: AIProvider[] = [
  'freellmapi',
  'ollama',
  'groq',
  'openrouter',
  'mistral',
  'google',
  'custom',
];

function resolveEnvValue(envKey?: string): string | undefined {
  if (!envKey) return undefined;
  return process.env[envKey] || undefined;
}

function buildOpenAICompatProvider(
  provider: AIProvider,
  userConfig?: UserProviderSettings
): OpenAICompatibleProvider | null {
  const meta = PROVIDER_REGISTRY[provider];
  if (!meta) return null;

  const apiKey =
    userConfig?.apiKey ||
    resolveEnvValue(meta.envKey) ||
    (provider === 'ollama' ? 'ollama' : undefined);

  const baseUrl =
    userConfig?.baseUrl ||
    resolveEnvValue(meta.envBaseUrl) ||
    meta.defaultBaseUrl;

  if (!baseUrl) return null;
  if (meta.requiresApiKey && !apiKey) return null;

  return new OpenAICompatibleProvider({
    name: meta.label,
    apiKey,
    baseUrl,
    defaultModel: userConfig?.model || meta.defaultModel,
    models: meta.models,
  });
}

function resolveBackendProvider(provider: AIProvider): AIProvider {
  if (provider === 'platform') return 'freellmapi';
  return provider;
}

export function resolveProvider(
  provider: AIProvider,
  userConfig?: UserProviderSettings
): AIProviderInterface | null {
  const backend = resolveBackendProvider(provider);

  if (provider === 'platform') {
    const platformProvider = buildOpenAICompatProvider('freellmapi', undefined);
    if (platformProvider) return platformProvider;
    const together = providerManager.getProvider('together');
    if (together) return together;
    return null;
  }

  if (OPENAI_COMPAT_PROVIDERS.includes(backend)) {
    return buildOpenAICompatProvider(backend, userConfig);
  }

  if (userConfig?.apiKey) {
    return createProvider({
      provider: backend,
      apiKey: userConfig.apiKey,
      model: userConfig.model,
    } as AIProviderConfig);
  }

  return providerManager.getProvider(backend);
}

export function getServerAvailableProviders(): AIProvider[] {
  const available = new Set<AIProvider>(providerManager.getAvailableProviders());

  if (
    process.env.FREELLMAPI_API_KEY ||
    process.env.FREELLMAPI_BASE_URL ||
    process.env.TOGETHER_API_KEY
  ) {
    available.add('platform');
  }

  for (const id of OPENAI_COMPAT_PROVIDERS) {
    const meta = PROVIDER_REGISTRY[id];
    const hasEnvKey = meta.envKey ? !!process.env[meta.envKey] : true;
    const hasBaseUrl =
      meta.envBaseUrl && process.env[meta.envBaseUrl]
        ? true
        : id === 'ollama' || id === 'freellmapi' || id === 'custom'
          ? !!process.env[meta.envBaseUrl || '']
          : !!meta.defaultBaseUrl;

    if (id === 'ollama' || id === 'freellmapi' || id === 'custom') {
      if (process.env[meta.envBaseUrl || ''] || process.env[meta.envKey || '']) {
        available.add(id);
      }
    } else if (hasEnvKey && hasBaseUrl) {
      available.add(id);
    }
  }

  return Array.from(available);
}
