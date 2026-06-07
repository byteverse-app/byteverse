'use client';

import { motion } from 'framer-motion';
import { Key, Server, Cpu, Layers, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PROVIDERS = [
  { name: 'ByteVerse AI', desc: 'Included hosted models — free and unlimited', tag: 'Included' },
  { name: 'Ollama', desc: 'Local Llama, Mistral, Qwen', tag: 'Local' },
  { name: 'OpenAI', desc: 'GPT-4o & GPT-4o-mini', tag: 'Cloud' },
  { name: 'Anthropic', desc: 'Claude 3.5 Sonnet', tag: 'Cloud' },
  { name: 'Groq', desc: 'Ultra-fast Llama inference', tag: 'Cloud' },
  { name: 'OpenRouter', desc: '100+ models, free routes', tag: 'Cloud' },
  { name: 'Mistral', desc: 'Large, Codestral, Devstral', tag: 'Cloud' },
  { name: 'Google Gemini', desc: 'Gemini 2.5 Flash & Pro', tag: 'Cloud' },
];

export default function AIProvidersSection() {
  return (
    <section id="ai-providers" className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <p className="font-space text-[10px] font-bold tracking-[0.5em] text-brand-primary uppercase mb-6">
            Your AI, your keys
          </p>
          <h2 className="font-syne text-4xl md:text-6xl font-extrabold tracking-tighter mb-6">
            BRING YOUR <br />
            <span className="text-white/20 italic">OWN LLM</span>
          </h2>
          <p className="font-space text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
            ByteVerse AI is included free with unlimited course generation — no API key required.
            Prefer your own provider? Connect Groq, OpenRouter, Google, and more, or run models locally with Ollama.
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: Layers,
                title: 'ByteVerse AI included',
                desc: 'Hosted models, free and unlimited — start creating immediately, no API key required.',
              },
              {
                icon: Cpu,
                title: 'Local LLMs with Ollama',
                desc: 'Keep data on your machine. LM Studio, vLLM, and llama.cpp work via custom endpoints too.',
              },
              {
                icon: Key,
                title: 'Bring your own keys',
                desc: 'Configure OpenAI, Anthropic, Groq, Mistral, Gemini, and more in settings for model choice and privacy.',
              },
              {
                icon: Server,
                title: 'Free model directory',
                desc: 'Step-by-step links to get free-tier API keys from major providers — all in one settings page.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sm mb-1">{item.title}</h3>
                  <p className="font-space text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="apple-glass p-5 rounded-2xl border border-white/5 flex items-start gap-3">
            <Mail className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
            <p className="font-space text-xs text-gray-400 leading-relaxed">
              Provider not listed? Write to{' '}
              <a href="mailto:missioncontrol@byteverse.app" className="text-brand-primary hover:text-white">
                missioncontrol@byteverse.app
              </a>{' '}
              and we will help you connect it.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-3"
        >
          {PROVIDERS.map((p) => (
            <div
              key={p.name}
              className="apple-glass p-4 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-syne font-bold text-sm">{p.name}</h3>
                <span className="text-[10px] font-space tracking-wider text-brand-primary uppercase">{p.tag}</span>
              </div>
              <p className="font-space text-xs text-gray-500">{p.desc}</p>
            </div>
          ))}
          <Link
            href="/signup"
            className="col-span-2 apple-glass p-5 rounded-2xl border border-brand-primary/20 flex items-center justify-between group hover:border-brand-primary/50 transition-colors"
          >
            <span className="font-syne font-bold text-sm">Request early access</span>
            <ExternalLink className="w-4 h-4 text-brand-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
