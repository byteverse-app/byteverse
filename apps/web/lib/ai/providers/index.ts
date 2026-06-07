import { AIProvider, AIProviderInterface, AIProviderConfig } from './types';
import { TogetherAIProvider } from './togetherProvider';
import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { OpenAICompatibleProvider } from './openaiCompatProvider';
import { PROVIDER_REGISTRY } from './registry';

// Provider factory
export function createProvider(config: AIProviderConfig): AIProviderInterface {
  const meta = PROVIDER_REGISTRY[config.provider];

  if (meta && ['freellmapi', 'ollama', 'groq', 'openrouter', 'mistral', 'google', 'custom'].includes(config.provider)) {
    return new OpenAICompatibleProvider({
      name: meta.label,
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || meta.defaultBaseUrl || '',
      defaultModel: config.model || meta.defaultModel,
      models: meta.models,
    });
  }

  switch (config.provider) {
    case 'together':
      return new TogetherAIProvider();
    case 'openai':
      return new OpenAIProvider(config.apiKey);
    case 'anthropic':
      return new AnthropicProvider(config.apiKey);
    default:
      throw new Error(`Unknown provider: ${config.provider}`);
  }
}

// Get default provider based on available API keys
export function getDefaultProvider(): AIProvider {
  if (process.env.FREELLMAPI_API_KEY || process.env.FREELLMAPI_BASE_URL) return 'freellmapi';
  if (process.env.TOGETHER_API_KEY) return 'together';
  if (process.env.OLLAMA_BASE_URL) return 'ollama';
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GROQ_API_KEY) return 'groq';
  return 'together';
}

function initOpenAICompatFromEnv(provider: AIProvider): AIProviderInterface | null {
  const meta = PROVIDER_REGISTRY[provider];
  if (!meta) return null;

  const apiKey = meta.envKey ? process.env[meta.envKey] : undefined;
  const baseUrl =
    (meta.envBaseUrl && process.env[meta.envBaseUrl]) || meta.defaultBaseUrl;

  if (meta.requiresApiKey && !apiKey) return null;
  if (meta.requiresBaseUrl && !baseUrl) return null;
  if (!baseUrl && !apiKey) return null;

  return new OpenAICompatibleProvider({
    name: meta.label,
    apiKey: apiKey || (provider === 'ollama' ? 'ollama' : undefined),
    baseUrl: baseUrl || '',
    defaultModel: meta.defaultModel,
    models: meta.models,
  });
}

// Get all available providers (server env only)
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (process.env.TOGETHER_API_KEY) providers.push('together');
  if (process.env.OPENAI_API_KEY) providers.push('openai');
  if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
  if (process.env.FREELLMAPI_API_KEY || process.env.FREELLMAPI_BASE_URL) providers.push('freellmapi');
  if (process.env.OLLAMA_BASE_URL) providers.push('ollama');
  if (process.env.GROQ_API_KEY) providers.push('groq');
  if (process.env.OPENROUTER_API_KEY) providers.push('openrouter');
  if (process.env.MISTRAL_API_KEY) providers.push('mistral');
  if (process.env.GOOGLE_AI_API_KEY) providers.push('google');
  return providers;
}

// Provider manager
export class ProviderManager {
  private providers: Map<AIProvider, AIProviderInterface> = new Map();
  private initialized = false;

  private initialize() {
    if (this.initialized) return;

    try {
      if (process.env.TOGETHER_API_KEY) {
        this.providers.set('together', new TogetherAIProvider());
      }
      if (process.env.OPENAI_API_KEY) {
        this.providers.set('openai', new OpenAIProvider());
      }
      if (process.env.ANTHROPIC_API_KEY) {
        this.providers.set('anthropic', new AnthropicProvider());
      }

      for (const id of ['freellmapi', 'ollama', 'groq', 'openrouter', 'mistral', 'google'] as AIProvider[]) {
        const instance = initOpenAICompatFromEnv(id);
        if (instance) this.providers.set(id, instance);
      }

      this.initialized = true;
    } catch (error) {
      console.error('Error initializing providers:', error);
    }
  }

  getProvider(provider: AIProvider): AIProviderInterface | null {
    this.initialize();
    return this.providers.get(provider) || null;
  }

  getAvailableProviders(): AIProvider[] {
    this.initialize();
    return Array.from(this.providers.keys());
  }

  getDefaultProvider(): AIProvider {
    this.initialize();
    const available = this.getAvailableProviders();
    if (available.length === 0) {
      throw new Error('No AI providers available. Please configure at least one API key.');
    }
    return getDefaultProvider();
  }
}

let _providerManager: ProviderManager | null = null;

export function getProviderManager(): ProviderManager {
  if (!_providerManager) {
    _providerManager = new ProviderManager();
  }
  return _providerManager;
}

export const providerManager = getProviderManager();

export { PROVIDER_REGISTRY, TOP_PROVIDERS, SUPPORT_EMAIL } from './registry';
