import type { Metadata } from 'next';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import {
  ECOSYSTEM,
  FOUNDER,
  FOREVER_FREE_PLEDGE,
  FOUNDER_BIO,
  SITE_URL,
} from '@/lib/seo/siteConfig';

export const metadata: Metadata = {
  title: 'About — ByteVerse',
  description:
    'ByteVerse is forever free. Meet founder Dhanikesh Karunanithi and learn how ByteVerse and Sudar form an open inter-tech learning ecosystem.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About ByteVerse — Forever Free, Open Education',
    description: FOREVER_FREE_PLEDGE,
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd />
      <div className="min-h-screen bg-[#0a0a12] text-white">
        <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center max-w-5xl mx-auto">
          <Link href="/" className="font-syne font-bold text-lg">
            ByteVerse
          </Link>
          <div className="flex gap-6 text-sm">
            <Link href="/showcase" className="text-white/60 hover:text-white transition-colors">
              Showcase
            </Link>
            <Link href="/signup" className="text-brand-primary hover:underline">
              Get access
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-20 space-y-20">
          <section>
            <p className="font-space text-[10px] font-bold tracking-[0.5em] text-brand-primary uppercase mb-6">
              Accessibility first
            </p>
            <h1 className="font-syne text-5xl md:text-6xl font-extrabold tracking-tighter mb-8">
              Forever Free
            </h1>
            <p className="font-space text-gray-400 text-lg leading-relaxed">{FOREVER_FREE_PLEDGE}</p>
            <p className="font-space text-gray-500 mt-6 leading-relaxed">
              ByteVerse AI is included free and unlimited. Connect your own models via Ollama, OpenAI,
              Anthropic, Groq, Mistral, and more — or use the hosted ByteVerse AI with no caps. Export
              SCORM 1.2, HTML, or JSON with no vendor lock-in.
            </p>
          </section>

          <section>
            <h2 className="font-syne text-3xl font-bold mb-6">Meet Dhani</h2>
            <p className="font-space text-gray-400 leading-relaxed mb-4">{FOUNDER_BIO}</p>
            <p className="font-space text-gray-400 leading-relaxed mb-6">
              Dhani is also Global Head of Learning Tech &amp; Data Strategy at a global CX MNC. A
              lifelong learner, he has spent years seeking methods that put the learner first — that
              same drive powers ByteVerse and Sudar.
            </p>
            <a
              href={FOUNDER.url}
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary hover:text-white transition-colors font-space text-sm"
            >
              {FOUNDER.url.replace('https://', '')} →
            </a>
          </section>

          <section>
            <h2 className="font-syne text-3xl font-bold mb-6">The open learning ecosystem</h2>
            <p className="font-space text-gray-400 leading-relaxed mb-6">
              ByteVerse and Sudar are independent products in an inter-tech learning stack. Create
              microlearning modules in ByteVerse, export SCORM or HTML, then optionally import into{' '}
              <a
                href={ECOSYSTEM.sudar}
                target="_blank"
                rel="noreferrer"
                className="text-brand-primary hover:text-white"
              >
                Sudar Studio
              </a>{' '}
              for adaptive delivery on Sudar Learn — or use Moodle, Canvas, or any compliant LMS.
            </p>
            <ol className="font-space text-gray-500 space-y-3 list-decimal list-inside">
              <li>Finish a module in ByteVerse and open Export</li>
              <li>Download SCORM 1.2 ZIP or standalone HTML</li>
              <li>Import into Sudar Studio (or your LMS) and publish to learners</li>
            </ol>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href={ECOSYSTEM.sudar}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-white/20 rounded-full text-sm font-syne font-bold hover:border-brand-primary transition-colors"
              >
                Learn about Sudar
              </a>
              <a
                href={ECOSYSTEM.byteverseGithub}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 border border-white/20 rounded-full text-sm font-syne font-bold hover:border-brand-primary transition-colors"
              >
                ByteVerse on GitHub
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-syne text-3xl font-bold mb-6">Join the journey</h2>
            <p className="font-space text-gray-400 leading-relaxed mb-8">
              ByteVerse is in active development, built for educators and creators worldwide.
              Feedback, contributions, and collaboration are welcome.
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-brand-primary rounded-full font-syne font-bold hover:bg-brand-deep transition-colors"
            >
              Get early access
            </Link>
          </section>
        </main>

        <footer className="py-12 text-center text-white/30 text-xs font-space tracking-widest uppercase border-t border-white/5">
          <p>
            Founded by{' '}
            <a href={FOUNDER.url} target="_blank" rel="noreferrer" className="text-brand-primary hover:text-white">
              {FOUNDER.name}
            </a>
            {' · '}
            <a href={ECOSYSTEM.sudar} target="_blank" rel="noreferrer" className="text-brand-primary hover:text-white">
              Host on Sudar
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
