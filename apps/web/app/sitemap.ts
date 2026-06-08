import type { MetadataRoute } from 'next';
import { SITE_URL, SITEMAP_ENTRIES } from '@/lib/seo/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ENTRIES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
