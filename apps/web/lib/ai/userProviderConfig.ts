import { AIProvider } from './providers/types';

export interface UserProviderSettings {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface UserAISettings {
  selectedProvider: AIProvider;
  providers: Partial<Record<AIProvider, { apiKey?: string; baseUrl?: string; model?: string }>>;
}

const STORAGE_KEY = 'byteverse-ai-settings';

export function getDefaultAISettings(): UserAISettings {
  return {
    selectedProvider: 'platform',
    providers: {},
  };
}

export function loadUserAISettings(): UserAISettings {
  if (typeof window === 'undefined') return getDefaultAISettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultAISettings();
    return { ...getDefaultAISettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultAISettings();
  }
}

export function saveUserAISettings(settings: UserAISettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function getProviderPayload(provider?: AIProvider): {
  provider: AIProvider;
  providerConfig?: { apiKey?: string; baseUrl?: string; model?: string };
} {
  const settings = loadUserAISettings();
  const selected = provider || settings.selectedProvider;
  const cfg = settings.providers[selected];
  return {
    provider: selected,
    providerConfig: cfg
      ? {
          apiKey: cfg.apiKey,
          baseUrl: cfg.baseUrl,
          model: cfg.model,
        }
      : undefined,
  };
}

export function getUserProviderConfig(
  provider: AIProvider,
  settings?: UserAISettings
): UserProviderSettings {
  const s = settings || loadUserAISettings();
  const providerConfig = s.providers[provider] || {};
  return {
    provider,
    apiKey: providerConfig.apiKey,
    baseUrl: providerConfig.baseUrl,
    model: providerConfig.model,
  };
}
