import {
  AIProviderInterface,
  ChatMessage,
  ChatOptions,
  ChatResponse,
  JSONGenerationOptions,
} from './types';

export interface OpenAICompatConfig {
  name: string;
  apiKey?: string;
  baseUrl: string;
  defaultModel: string;
  models?: string[];
}

/**
 * Generic provider for any OpenAI-compatible endpoint:
 * FreeLLMAPI, Ollama, Groq, OpenRouter, Mistral, LM Studio, vLLM, etc.
 */
export class OpenAICompatibleProvider implements AIProviderInterface {
  name: string;
  private apiKey: string;
  private baseUrl: string;
  private defaultModel: string;
  private models: string[];

  constructor(config: OpenAICompatConfig) {
    this.name = config.name;
    this.apiKey = config.apiKey || 'not-needed';
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.defaultModel = config.defaultModel;
    this.models = config.models || [config.defaultModel, 'auto'];
  }

  isAvailable(): boolean {
    return !!this.baseUrl;
  }

  getAvailableModels(): string[] {
    return this.models;
  }

  private endpoint(path: string): string {
    const base = this.baseUrl.endsWith('/v1') ? this.baseUrl : `${this.baseUrl}/v1`;
    return `${base}${path}`;
  }

  async chatCompletion(
    messages: ChatMessage[],
    options: ChatOptions = {}
  ): Promise<ChatResponse> {
    const {
      model = this.defaultModel,
      temperature = 0.7,
      maxTokens = 4000,
      responseFormat = 'text',
    } = options;

    const body: Record<string, unknown> = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (responseFormat === 'json_object') {
      body.response_format = { type: 'json_object' };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey && this.apiKey !== 'not-needed') {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(this.endpoint('/chat/completions'), {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`${this.name} API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return {
      content: data.choices?.[0]?.message?.content || '',
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens || 0,
            completionTokens: data.usage.completion_tokens || 0,
            totalTokens: data.usage.total_tokens || 0,
          }
        : undefined,
    };
  }

  async generateJSON<T>(
    messages: ChatMessage[],
    options: JSONGenerationOptions = {}
  ): Promise<T> {
    const {
      model = this.defaultModel,
      temperature = 0.3,
      maxTokens = 8000,
      retries = 2,
    } = options;

    const systemMessage: ChatMessage = {
      role: 'system',
      content:
        'You are a JSON generation assistant. You MUST respond with ONLY valid JSON. Do not include any text before or after the JSON.',
    };

    const enhancedMessages = [systemMessage, ...messages];
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.chatCompletion(enhancedMessages, {
          model,
          temperature,
          maxTokens,
          responseFormat: 'json_object',
        });

        try {
          return JSON.parse(response.content) as T;
        } catch {
          const jsonMatch = response.content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as T;
          }
          if (attempt === retries) {
            throw new Error(`Failed to parse JSON: ${response.content.substring(0, 200)}`);
          }
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    throw lastError || new Error('Failed to generate JSON');
  }
}
