import { AIProvider } from './types';

export interface ProviderMeta {
  id: AIProvider;
  label: string;
  description: string;
  category: 'cloud' | 'aggregator' | 'local' | 'custom';
  envKey?: string;
  envBaseUrl?: string;
  defaultBaseUrl?: string;
  defaultModel: string;
  models: string[];
  setupUrl?: string;
  requiresApiKey: boolean;
  requiresBaseUrl: boolean;
}

export const PROVIDER_REGISTRY: Record<AIProvider, ProviderMeta> = {
  platform: {
    id: 'platform',
    label: 'ByteVerse AI',
    description: 'Included free tier — limited daily full course generations on our hosted models',
    category: 'cloud',
    defaultModel: 'auto',
    models: ['auto', 'gemini-2.5-flash', 'llama-3.3-70b-versatile', 'gpt-4o-mini'],
    requiresApiKey: false,
    requiresBaseUrl: false,
  },
  freellmapi: {
    id: 'freellmapi',
    label: 'FreeLLMAPI',
    description: '16 free providers (~1.7B tokens/mo) via one OpenAI-compatible endpoint',
    category: 'aggregator',
    envKey: 'FREELLMAPI_API_KEY',
    envBaseUrl: 'FREELLMAPI_BASE_URL',
    defaultBaseUrl: 'http://localhost:3001/v1',
    defaultModel: 'auto',
    models: ['auto', 'gemini-2.5-flash', 'llama-3.3-70b-versatile', 'gpt-4o-mini'],
    setupUrl: 'https://github.com/tashfeenahmed/freellmapi',
    requiresApiKey: true,
    requiresBaseUrl: true,
  },
  ollama: {
    id: 'ollama',
    label: 'Ollama (Local)',
    description: 'Run models locally — Llama, Mistral, Qwen, and more',
    category: 'local',
    envBaseUrl: 'OLLAMA_BASE_URL',
    defaultBaseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3.2',
    models: ['llama3.2', 'llama3.1', 'mistral', 'qwen2.5', 'gemma2', 'phi3'],
    setupUrl: 'https://ollama.com',
    requiresApiKey: false,
    requiresBaseUrl: true,
  },
  together: {
    id: 'together',
    label: 'Together AI',
    description: 'Fast, cost-effective open models (Llama, Qwen)',
    category: 'cloud',
    envKey: 'TOGETHER_API_KEY',
    defaultModel: 'meta-llama/Llama-3.2-3B-Instruct-Turbo',
    models: [
      'meta-llama/Llama-3.2-3B-Instruct-Turbo',
      'meta-llama/Llama-3.3-70B-Instruct-Turbo',
      'Qwen/Qwen2.5-72B-Instruct-Turbo',
    ],
    setupUrl: 'https://api.together.xyz',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  openai: {
    id: 'openai',
    label: 'OpenAI',
    description: 'GPT-4o, GPT-4o-mini, and GPT-3.5',
    category: 'cloud',
    envKey: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    setupUrl: 'https://platform.openai.com/api-keys',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic',
    description: 'Claude 3.5 Sonnet and Haiku',
    category: 'cloud',
    envKey: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    setupUrl: 'https://console.anthropic.com',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  groq: {
    id: 'groq',
    label: 'Groq',
    description: 'Ultra-fast inference — Llama 3.3, Llama 4, Qwen3',
    category: 'cloud',
    envKey: 'GROQ_API_KEY',
    defaultBaseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    setupUrl: 'https://console.groq.com/keys',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  openrouter: {
    id: 'openrouter',
    label: 'OpenRouter',
    description: '100+ models including free-tier routes',
    category: 'cloud',
    envKey: 'OPENROUTER_API_KEY',
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    models: [
      'meta-llama/llama-3.3-70b-instruct:free',
      'google/gemini-2.0-flash-exp:free',
      'qwen/qwen-2.5-72b-instruct:free',
    ],
    setupUrl: 'https://openrouter.ai/keys',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  mistral: {
    id: 'mistral',
    label: 'Mistral AI',
    description: 'Mistral Large, Medium, Codestral, and Devstral',
    category: 'cloud',
    envKey: 'MISTRAL_API_KEY',
    defaultBaseUrl: 'https://api.mistral.ai/v1',
    defaultModel: 'mistral-small-latest',
    models: ['mistral-large-latest', 'mistral-small-latest', 'codestral-latest'],
    setupUrl: 'https://console.mistral.ai/api-keys',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  google: {
    id: 'google',
    label: 'Google Gemini',
    description: 'Gemini 2.5 Flash and Pro via OpenAI-compatible endpoint',
    category: 'cloud',
    envKey: 'GOOGLE_AI_API_KEY',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.5-flash',
    models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
    setupUrl: 'https://aistudio.google.com/apikey',
    requiresApiKey: true,
    requiresBaseUrl: false,
  },
  custom: {
    id: 'custom',
    label: 'Custom endpoint',
    description: 'LM Studio, vLLM, llama.cpp, or any OpenAI-compatible API',
    category: 'custom',
    defaultBaseUrl: 'http://localhost:8080/v1',
    defaultModel: 'auto',
    models: ['auto'],
    requiresApiKey: false,
    requiresBaseUrl: true,
  },
};

export const SUPPORT_EMAIL = 'missioncontrol@byteverse.app';

/** User-facing providers (freellmapi is backend-only). */
export const USER_FACING_PROVIDERS: AIProvider[] = [
  'platform',
  'ollama',
  'openai',
  'anthropic',
  'together',
  'groq',
  'openrouter',
  'mistral',
  'google',
  'custom',
];

/** @deprecated Use USER_FACING_PROVIDERS */
export const TOP_PROVIDERS: AIProvider[] = USER_FACING_PROVIDERS;

export interface FreeModelEntry {
  name: string;
  provider: string;
  setupUrl: string;
  description: string;
}

/** Curated free models users can access via BYOK — no FreeLLMAPI branding. */
export const FREE_MODEL_DIRECTORY: FreeModelEntry[] = [
  {
    name: 'Llama 3.3 70B (free tier)',
    provider: 'Groq',
    setupUrl: 'https://console.groq.com/keys',
    description: 'Fast inference — add your free Groq API key in settings',
  },
  {
    name: 'Gemini 2.0 Flash (free tier)',
    provider: 'OpenRouter',
    setupUrl: 'https://openrouter.ai/keys',
    description: 'Use model meta-llama/llama-3.3-70b-instruct:free or google/gemini-2.0-flash-exp:free',
  },
  {
    name: 'Qwen 2.5 72B (free tier)',
    provider: 'OpenRouter',
    setupUrl: 'https://openrouter.ai/keys',
    description: 'Use model qwen/qwen-2.5-72b-instruct:free with your OpenRouter key',
  },
  {
    name: 'Llama 3.2 / Mistral (local)',
    provider: 'Ollama',
    setupUrl: 'https://ollama.com',
    description: 'Run unlimited courses locally — no API key required',
  },
  {
    name: 'Google Gemini Flash',
    provider: 'Google AI',
    setupUrl: 'https://aistudio.google.com/apikey',
    description: 'Free tier available — add your Google AI Studio key',
  },
];
