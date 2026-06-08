import type { Metadata } from 'next';
import Link from 'next/link';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/seo/siteConfig';

export const metadata: Metadata = {
  title: 'Community Showcase',
  description:
    'Public microlearning courses created with ByteVerse. Explore community showcase projects and get inspired to build your own.',
  alternates: { canonical: `${SITE_URL}/showcase` },
  openGraph: {
    title: 'ByteVerse Community Showcase',
    url: `${SITE_URL}/showcase`,
  },
};

export const dynamic = 'force-dynamic';
export default async function ShowcasePage() {
  let projects: { id: string; title: string; metadata: Record<string, unknown> }[] = [];

  try {
    const supabase = createServiceRoleSupabaseClient();
    const { data } = await supabase
      .from('projects')
      .select('id, title, metadata')
      .eq('is_public_showcase', true)
      .order('updated_at', { ascending: false })
      .limit(24);
    projects = data ?? [];
  } catch {
    projects = [];
  }

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white">
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-syne font-bold">ByteVerse</Link>
        <Link href="/signup" className="text-sm text-brand-primary hover:underline">Get access</Link>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-syne text-4xl font-extrabold mb-4">Community showcase</h1>
        <p className="text-gray-400 mb-10 max-w-xl">
          Courses created by ByteVerse creators. Opt in from your project settings to feature your work here.
        </p>
        {projects.length === 0 ? (
          <p className="text-gray-500">No public showcases yet. Be the first to create and share!</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl border border-white/10 bg-white/5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  {(p.metadata?.description as string) || 'Microlearning course'}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
