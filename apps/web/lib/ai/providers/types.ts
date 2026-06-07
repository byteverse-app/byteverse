// AI Provider Types
export type AIProvider =
  | 'platform'
  | 'together'
  | 'openai'
  | 'anthropic'
  | 'freellmapi'
  | 'ollama'
  | 'groq'
  | 'openrouter'
  | 'mistral'
  | 'google'
  | 'custom';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json_object';
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface JSONGenerationOptions extends Omit<ChatOptions, 'responseFormat'> {
  schema?: any;
  retries?: number;
}

// Provider interface
export interface AIProviderInterface {
  name: string;
  chatCompletion(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  generateJSON<T>(messages: ChatMessage[], options?: JSONGenerationOptions): Promise<T>;
  isAvailable(): boolean;
  getAvailableModels(): string[];
}

/** Optional user-supplied config passed from client to API routes */
export interface ProviderRequestConfig {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}
