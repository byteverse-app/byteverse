import { AIProvider, ProviderRequestConfig } from './providers/types';
import { UserProviderSettings } from './userProviderConfig';

export function providerConfigFromBody(
  provider: AIProvider,
  providerConfig?: ProviderRequestConfig
): UserProviderSettings {
  return {
    provider,
    apiKey: providerConfig?.apiKey,
    baseUrl: providerConfig?.baseUrl,
    model: providerConfig?.model,
  };
}
