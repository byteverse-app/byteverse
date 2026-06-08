import type { MetadataRoute } from 'next';
import { AI_CRAWLER_USER_AGENTS, DISALLOWED_PATHS, SITE_URL } from '@/lib/seo/siteConfig';

export default function robots(): MetadataRoute.Robots {
  const aiRules = AI_CRAWLER_USER_AGENTS.map((userAgent) => ({
    userAgent,
    allow: '/',
    disallow: [...DISALLOWED_PATHS],
  }));

  return {
    rules: [
      ...aiRules,
      {
        userAgent: '*',
        allow: '/',
        disallow: [...DISALLOWED_PATHS],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
