import type { Metadata } from 'next';
import LoginClient from './LoginClient';
import { SITE_URL } from '@/lib/seo/siteConfig';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to ByteVerse — forever-free AI microlearning content generator.',
  alternates: { canonical: `${SITE_URL}/login` },
  robots: { index: true, follow: true },
};

export default function LoginPage() {
  return <LoginClient />;
}