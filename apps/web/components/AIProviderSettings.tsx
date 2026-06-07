'use client';

import { useState, useEffect } from 'react';
import { AIProvider } from '@/lib/ai/providers/types';
import {
  loadUserAISettings,
  saveUserAISettings,
  UserAISettings,
} from '@/lib/ai/userProviderConfig';
import { PROVIDER_REGISTRY, SUPPORT_EMAIL, USER_FACING_PROVIDERS } from '@/lib/ai/providers/registry';
import QuotaMeter from '@/components/settings/QuotaMeter';
import { ExternalLink, Key, Server, Cpu, Mail } from 'lucide-react';

interface AIProviderSettingsProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
}

export default function AIProviderSettings({
  selectedProvider,
  onProviderChange,
}: AIProviderSettingsProps) {
  const [settings, setSettings] = useState<UserAISettings>(() => loadUserAISettings());
  const [serverProviders, setServerProviders] = useState<AIProvider[]>([]);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/providers')
      .then((res) => res.json())
      .then((data) => {
        if (data.available) setServerProviders(data.available);
      })
      .catch(console.error);
  }, []);

  const meta = PROVIDER_REGISTRY[selectedProvider];
  const providerConfig = settings.providers[selectedProvider] || {};

  const updateProviderField = (field: 'apiKey' | 'baseUrl' | 'model', value: string) => {
    const next: UserAISettings = {
      ...settings,
      providers: {
        ...settings.providers,
        [selectedProvider]: {
          ...settings.providers[selectedProvider],
          [field]: value,
        },
      },
    };
    setSettings(next);
    saveUserAISettings(next);
  };

  const selectProvider = (provider: AIProvider) => {
    const next = { ...settings, selectedProvider: provider };
    setSettings(next);
    saveUserAISettings(next);
    onProviderChange(provider);
    setTestResult(null);
  };

  const isConfigured = (provider: AIProvider): boolean => {
    if (provider === 'platform') return serverProviders.includes('platform');
    if (serverProviders.includes(provider)) return true;
    const cfg = settings.providers[provider];
    const m = PROVIDER_REGISTRY[provider];
    if (m.requiresApiKey && cfg?.apiKey) return true;
    if (m.requiresBaseUrl && cfg?.baseUrl) return true;
    return false;
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/test-provider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          providerConfig: settings.providers[selectedProvider],
        }),
      });
      const data = await res.json();
      setTestResult({
        ok: res.ok,
        message: data.message || data.error || (res.ok ? 'Connection successful' : 'Connection failed'),
      });
      if (res.ok && selectedProvider !== 'platform') {
        fetch('/api/achievements/byok', { method: 'POST' }).catch(() => {});
      }
    } catch {
      setTestResult({ ok: false, message: 'Could not reach the provider' });
    } finally {
      setTesting(false);
    }
  };

  const categoryIcon = (cat: string) => {
    if (cat === 'local') return <Cpu className="w-3.5 h-3.5" />;
    if (cat === 'aggregator') return <Server className="w-3.5 h-3.5" />;
    return <Key className="w-3.5 h-3.5" />;
  };

  return (
    <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      <div>
        <label className="block text-sm font-semibold mb-2 text-text-primary">AI Provider</label>
        <p className="text-xs text-text-tertiary mb-3">
          Bring your own key (BYOK) or use server-configured providers. Your keys stay in your browser.
        </p>
        <div className="space-y-1.5">
          {USER_FACING_PROVIDERS.map((provider) => {
            const m = PROVIDER_REGISTRY[provider];
            const configured = isConfigured(provider);
            return (
              <label
                key={provider}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider === provider
                    ? 'border-accent1 bg-accent1/10'
                    : 'border-border hover:bg-bg2'
                }`}
              >
                <input
                  type="radio"
                  name="provider"
                  checked={selectedProvider === provider}
                  onChange={() => selectProvider(provider)}
                  className="mt-1 w-4 h-4 text-accent1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{m.label}</span>
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-wide text-text-tertiary">
                      {categoryIcon(m.category)}
                      {m.category}
                    </span>
                    {configured && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">
                        ready
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5">{m.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {selectedProvider === 'platform' && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-bg2">
          <h3 className="text-sm font-semibold">ByteVerse AI (included)</h3>
          <p className="text-xs text-text-tertiary">
            Our hosted models — limited full course generations per day. No API key needed.
          </p>
          <QuotaMeter compact />
        </div>
      )}

      {meta && selectedProvider !== 'platform' && (
        <div className="border border-border rounded-lg p-4 space-y-3 bg-bg2">
          <h3 className="text-sm font-semibold">Configure {meta.label}</h3>

          {meta.requiresBaseUrl && (
            <div>
              <label className="block text-xs font-medium mb-1 text-text-secondary">Base URL</label>
              <input
                type="url"
                value={providerConfig.baseUrl || ''}
                onChange={(e) => updateProviderField('baseUrl', e.target.value)}
                placeholder={meta.defaultBaseUrl}
                className="w-full px-3 py-2 text-sm bg-bg1 border border-border rounded-lg focus:outline-none focus:border-accent1"
              />
              {selectedProvider === 'ollama' && (
                <p className="text-xs text-text-tertiary mt-1">
                  Install{' '}
                  <a href="https://ollama.com" target="_blank" rel="noreferrer" className="text-accent1 hover:underline">
                    Ollama
                  </a>
                  , run <code className="text-[11px] bg-bg3 px-1 rounded">ollama pull llama3.2</code>, then use{' '}
                  <code className="text-[11px] bg-bg3 px-1 rounded">http://localhost:11434/v1</code>.
                </p>
              )}
              {selectedProvider === 'custom' && (
                <p className="text-xs text-text-tertiary mt-1">
                  LM Studio, vLLM, llama.cpp, or any OpenAI-compatible server.
                </p>
              )}
            </div>
          )}

          {meta.requiresApiKey && (
            <div>
              <label className="block text-xs font-medium mb-1 text-text-secondary">API Key</label>
              <input
                type="password"
                value={providerConfig.apiKey || ''}
                onChange={(e) => updateProviderField('apiKey', e.target.value)}
                placeholder="sk-…"
                className="w-full px-3 py-2 text-sm bg-bg1 border border-border rounded-lg focus:outline-none focus:border-accent1"
              />
              {meta.setupUrl && (
                <a
                  href={meta.setupUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-accent1 hover:underline inline-flex items-center gap-1 mt-1"
                >
                  Get an API key <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1 text-text-secondary">Model (optional)</label>
            <input
              type="text"
              value={providerConfig.model || ''}
              onChange={(e) => updateProviderField('model', e.target.value)}
              placeholder={meta.defaultModel}
              className="w-full px-3 py-2 text-sm bg-bg1 border border-border rounded-lg focus:outline-none focus:border-accent1"
            />
            <p className="text-xs text-text-tertiary mt-1">
              Suggested: {meta.models.slice(0, 3).join(', ')}
            </p>
          </div>

          <button
            type="button"
            onClick={testConnection}
            disabled={testing}
            className="w-full py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg3 disabled:opacity-50"
          >
            {testing ? 'Testing…' : 'Test connection'}
          </button>
          {testResult && (
            <p className={`text-xs ${testResult.ok ? 'text-green-400' : 'text-red-400'}`}>
              {testResult.message}
            </p>
          )}
        </div>
      )}

      <div className="border border-border rounded-lg p-4 bg-bg2/50">
        <div className="flex items-start gap-2">
          <Mail className="w-4 h-4 text-accent1 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Need a provider that is not listed? Email{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent1 hover:underline font-medium">
                {SUPPORT_EMAIL}
              </a>{' '}
              and we will help you integrate it.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
