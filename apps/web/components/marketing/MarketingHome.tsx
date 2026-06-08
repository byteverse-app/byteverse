'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ByteVerseHeroTitle from './ByteVerseHeroTitle';
import MarketingNav from './MarketingNav';
import CreationPipeline from './CreationPipeline';
import DeploySudar from './DeploySudar';
import AIProvidersSection from './AIProvidersSection';
import ProductWireframeDemo from './wireframe-demo/ProductWireframeDemo';
import WaitlistSection from './WaitlistSection';
import { FOUNDER } from '@/lib/seo/siteConfig';

const SectionWrapper = ({ children, id }: { children: React.ReactNode; id?: string }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

export default function MarketingHome() {
  return (
    <div className="relative min-h-screen">
      <MarketingNav />

      <main className="relative z-10">
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] font-space tracking-[0.4em] uppercase text-white/50 mb-8"
          >
            AI-powered microlearning content generator
          </motion.span>
          <ByteVerseHeroTitle />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-syne text-2xl md:text-4xl font-bold tracking-tight text-white/30 mb-8"
          >
            Big ideas. Bite-sized.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-space text-gray-400 max-w-2xl text-lg mb-12"
          >
            Chat with ByteAI, upload your sources, and export pedagogy-first microlearning—SCORM, HTML, or hand off to{' '}
            <a href="https://teachwithsudar.com" className="text-brand-primary hover:text-white" target="_blank" rel="noreferrer">
              Sudar
            </a>{' '}
            for adaptive delivery.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/app/new"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-syne font-bold rounded-full hover:scale-105 transition-all"
            >
              Create a module <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </section>

        <SectionWrapper id="tour">
          <ProductWireframeDemo />
        </SectionWrapper>

        <SectionWrapper id="pipeline">
          <CreationPipeline />
        </SectionWrapper>

        <SectionWrapper>
          <AIProvidersSection />
        </SectionWrapper>

        <SectionWrapper id="features">
          <section className="py-32 px-6 max-w-7xl mx-auto">
            <h2 className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter mb-16">
              BUILT FOR <span className="text-white/20 italic">CREATORS</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Conversational brief',
                  desc: 'Talk through goals in chat—upload PDFs, URLs, and paste text with RAG-backed context.',
                },
                {
                  title: 'Pedagogy visible',
                  desc: 'ADDIE at module scale, Bloom-tagged objectives, and a 3–7 minute time budget by design.',
                },
                {
                  title: 'Export-first',
                  desc: 'SCORM 1.2, standalone HTML, and JSON source—no vendor lock-in.',
                },
                {
                  title: 'Quality guardrails',
                  desc: 'Validation, fact-check hooks, and multi-provider AI fallbacks inspired by production LMS tooling.',
                },
                {
                  title: 'Your keys, your models',
                  desc: 'ByteVerse AI included forever free and unlimited. Prefer your own model? Connect Ollama, OpenAI, Groq, Mistral, and more.',
                },
              ].map((f) => (
                <div key={f.title} className="apple-glass p-10 rounded-[2rem] border border-white/5">
                  <h3 className="font-syne text-2xl font-bold mb-4">{f.title}</h3>
                  <p className="font-space text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        <SectionWrapper id="deploy">
          <DeploySudar />
        </SectionWrapper>

        <WaitlistSection />

        <section className="py-24 px-6 max-w-3xl mx-auto text-center">
          <p className="font-space text-gray-500 leading-relaxed">
            ByteVerse is forever free — built by{' '}
            <a
              href={FOUNDER.url}
              target="_blank"
              rel="noreferrer"
              className="text-brand-primary hover:text-white transition-colors"
            >
              Dhanikesh &ldquo;Dhani&rdquo; Karunanithi
            </a>{' '}
            to make AI-powered education open and accessible.{' '}
            <Link href="/about" className="text-brand-primary hover:text-white transition-colors">
              Read our story →
            </Link>
          </p>
        </section>

        <section className="py-32 px-6 text-center">
          <h2 className="font-syne text-4xl font-bold mb-8">Create free. Export anywhere.</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto font-space">
            AI-assisted microlearning design belongs in every educator&apos;s hands — forever free, like Sudar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="px-12 py-5 bg-brand-primary rounded-full font-syne font-bold hover:bg-brand-deep transition-colors">
              Get early access
            </Link>
            <Link href="/showcase" className="px-12 py-5 border border-white/20 rounded-full font-syne font-bold hover:border-brand-primary transition-colors">
              View showcase
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-12 text-center text-white/30 text-xs font-space tracking-widest uppercase space-y-2">
        <p>
          ByteVerse — microlearning factory ·{' '}
          <a href="https://teachwithsudar.com" className="text-brand-primary" target="_blank" rel="noreferrer">
            Host on Sudar
          </a>
        </p>
        <p>
          Founded by{' '}
          <a href={FOUNDER.url} className="text-brand-primary hover:text-white" target="_blank" rel="noreferrer">
            {FOUNDER.name}
          </a>
        </p>
      </footer>

    </div>
  );
}
