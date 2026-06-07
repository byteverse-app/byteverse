import { z } from 'zod';

export const aiProviderEnum = z.enum([
  'platform',
  'together',
  'openai',
  'anthropic',
  'freellmapi',
  'ollama',
  'groq',
  'openrouter',
  'mistral',
  'google',
  'custom',
]);

export const providerConfigSchema = z
  .object({
    apiKey: z.string().max(512).optional(),
    baseUrl: z.string().max(2048).optional(),
    model: z.string().max(256).optional(),
  })
  .optional();

export const chatBodySchema = z.object({
  message: z.string().min(1).max(32_000),
  history: z.array(z.record(z.unknown())).optional(),
  provider: aiProviderEnum.optional(),
  providerConfig: providerConfigSchema,
  uploadedFiles: z.array(z.object({ name: z.string() })).optional(),
  contextSessionId: z.string().max(128).optional(),
});

export const urlUploadSchema = z.object({
  url: z.string().url().max(2048),
  contextSessionId: z.string().max(128).optional(),
});

export const textUploadSchema = z.object({
  text: z.string().min(1).max(500_000),
  filename: z.string().max(255).optional(),
  contextSessionId: z.string().max(128).optional(),
});

export const generateOutlineSchema = z.object({
  config: z.record(z.unknown()),
  provider: aiProviderEnum.optional(),
  providerConfig: providerConfigSchema,
  chatHistory: z.array(z.record(z.unknown())).optional(),
  contextSessionId: z.string().max(128).optional(),
  sourceChunks: z.array(z.record(z.unknown())).optional(),
});

export const generateContentSchema = z.object({
  config: z.record(z.unknown()),
  outline: z.record(z.unknown()).optional(),
  stage: z.record(z.unknown()).optional(),
  provider: aiProviderEnum.optional(),
  providerConfig: providerConfigSchema,
  contextSessionId: z.string().max(128).optional(),
  sourceChunks: z.array(z.record(z.unknown())).optional(),
});

export function parseJsonBody<T>(schema: z.ZodSchema<T>, body: unknown):
  | { success: true; data: T }
  | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join('; ');
    return { success: false, error: message || 'Invalid request body' };
  }
  return { success: true, data: result.data };
}
