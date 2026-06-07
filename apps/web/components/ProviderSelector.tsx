'use client';

import { useState, useEffect } from 'react';
import { AIProvider } from '@/lib/ai/providers/types';
import { PROVIDER_REGISTRY, TOP_PROVIDERS } from '@/lib/ai/providers/registry';

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  availableProviders?: AIProvider[];
}

export default function ProviderSelector({
  selectedProvider,
  onProviderChange,
  availableProviders,
}: ProviderSelectorProps) {
  const [providers, setProviders] = useState<AIProvider[]>(availableProviders || TOP_PROVIDERS);

  useEffect(() => {
    fetch('/api/providers')
      .then((res) => res.json())
      .then((data) => {
        if (data.available && Array.isArray(data.available)) {
          setProviders(data.available);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="bg-bg2 border border-border rounded-lg p-4">
      <label className="block text-sm font-semibold mb-3">AI Provider</label>
      <div className="space-y-2">
        {TOP_PROVIDERS.map((provider) => {
          const meta = PROVIDER_REGISTRY[provider];
          const serverReady = providers.includes(provider);
          return (
            <label
              key={provider}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedProvider === provider
                  ? 'border-accent1 bg-accent1/10'
                  : 'border-border hover:bg-bg3'
              }`}
            >
              <input
                type="radio"
                name="provider"
                value={provider}
                checked={selectedProvider === provider}
                onChange={() => onProviderChange(provider)}
                className="w-4 h-4 text-accent1"
              />
              <div className="flex-1">
                <div className="font-medium flex items-center gap-2">
                  {meta.label}
                  {serverReady && (
                    <span className="text-[10px] text-green-400">server</span>
                  )}
                </div>
                <div className="text-xs text-gray-600">{meta.description}</div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
