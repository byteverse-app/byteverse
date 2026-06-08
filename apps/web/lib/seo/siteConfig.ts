export const SITE_URL = 'https://byteverse.app';

export const FOUNDER = {
  name: 'Dhanikesh Karunanithi',
  nickname: 'Dhani',
  url: 'https://dhanikeshkarunanithi.com',
  github: 'https://github.com/Dhanikesh-Karunanithi',
} as const;

export const ECOSYSTEM = {
  sudar: 'https://teachwithsudar.com',
  sudarGithub: 'https://github.com/Dhanikesh-Karunanithi/Sudar',
  byteverseGithub: 'https://github.com/byteverse-app/byteverse',
} as const;

/** IndexNow key — hosted at `/{INDEXNOW_KEY}.txt` for Bing/Yandex instant indexing. */
export const INDEXNOW_KEY = 'byteverseindex2026bv';

export function getPublicSitemapUrls(): string[] {
  return SITEMAP_ENTRIES.map(({ path }) =>
    path === '/' ? SITE_URL : `${SITE_URL}${path}`,
  );
}

export const SUPPORT_EMAIL = 'missioncontrol@byteverse.app';

/** Explicitly allowed AI and search crawler user-agents. */
export const AI_CRAWLER_USER_AGENTS = [
  'Googlebot',
  'Google-Extended',
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'PerplexityBot',
  'Bingbot',
  'Meta-ExternalAgent',
  'FacebookBot',
  'Applebot',
  'Applebot-Extended',
  'CCBot',
  'cohere-ai',
] as const;

export const DISALLOWED_PATHS = ['/app/', '/api/', '/admin', '/analytics', '/auth/'] as const;

export const SITEMAP_ENTRIES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/showcase', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/signup', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/login', priority: 0.5, changeFrequency: 'yearly' },
  { path: '/forgot-password', priority: 0.3, changeFrequency: 'yearly' },
];

export const SITE_DESCRIPTION =
  'ByteVerse is a forever-free AI microlearning content generator. Chat with ByteAI, upload sources, and export pedagogy-first modules as SCORM or HTML.';

export const SITE_TAGLINE = 'Big ideas. Bite-sized.';

export const FOREVER_FREE_PLEDGE =
  'ByteVerse will always be free. We believe AI-powered learning design belongs in every educator\'s hands — open, accessible, and without paywalls.';

export const FOUNDER_BIO =
  'Dhanikesh "Dhani" Karunanithi is the founder of ByteVerse and Sudar. He leads the vision for an open, inter-tech learning ecosystem where creators build microlearning in ByteVerse and optionally deliver it adaptively through Sudar or any LMS.';
