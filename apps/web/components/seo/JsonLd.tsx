import {
  ECOSYSTEM,
  FOUNDER,
  FOREVER_FREE_PLEDGE,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
  SITE_URL,
  SUPPORT_EMAIL,
} from '@/lib/seo/siteConfig';

export default function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ByteVerse',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    email: SUPPORT_EMAIL,
    founder: {
      '@type': 'Person',
      name: FOUNDER.name,
      url: FOUNDER.url,
      sameAs: [FOUNDER.url, FOUNDER.github, ECOSYSTEM.sudar],
    },
    sameAs: [ECOSYSTEM.byteverseGithub, ECOSYSTEM.sudar, FOUNDER.url, FOUNDER.github],
  };

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FOUNDER.name,
    alternateName: FOUNDER.nickname,
    url: FOUNDER.url,
    jobTitle: 'Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'ByteVerse',
      url: SITE_URL,
    },
    sameAs: [FOUNDER.url, FOUNDER.github, ECOSYSTEM.sudar, ECOSYSTEM.sudarGithub, SITE_URL],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ByteVerse',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: 'ByteVerse',
    },
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ByteVerse',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    slogan: SITE_TAGLINE,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: FOREVER_FREE_PLEDGE,
    },
    author: {
      '@type': 'Person',
      name: FOUNDER.name,
      url: FOUNDER.url,
    },
    isAccessibleForFree: true,
  };

  const graphs = [organization, person, website, software];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graphs) }}
    />
  );
}
