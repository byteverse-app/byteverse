import type { Metadata } from 'next';
import SignupClient from './SignupClient';
import { SITE_URL } from '@/lib/seo/siteConfig';

export const metadata: Metadata = {
  title: 'Get Early Access',
  description:
    'Join ByteVerse early access — forever-free AI microlearning design for educators and L&D teams.',
  alternates: { canonical: `${SITE_URL}/signup` },
  openGraph: {
    title: 'Get Early Access to ByteVerse',
    url: `${SITE_URL}/signup`,
  },
};

export default function SignupPage() {
  return <SignupClient />;
}