'use client';

import { motion } from 'framer-motion';
import { Key, Server, Cpu, Layers, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const PROVIDERS = [
  { name: 'ByteVerse AI', desc: 'Included hosted models — free tier with daily limits', tag: 'Included' },
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
            Start free on ByteVerse AI with included hosted models. Hit your limit? Add your own API keys from
            Groq, OpenRouter, Google, and more — or run models locally with Ollama for unlimited creation.
          </p>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: Layers,
                title: 'ByteVerse AI included',
                desc: '5 full course generations per day on our hosted models — no API key required.',
              },
              {
                icon: Cpu,
                title: 'Local LLMs with Ollama',
                desc: 'Keep data on your machine. LM Studio, vLLM, and llama.cpp work via custom endpoints too.',
              },
              {
                icon: Key,
                title: 'Bring your own keys',
                desc: 'Configure OpenAI, Anthropic, Groq, Mistral, Gemini, and more in settings for unlimited use.',
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
          transition={{ duration: 0.8 }}
          className="apple-glass rounded-[2rem] border border-white/5 p-8"
        >
          <h3 className="font-syne text-xl font-bold mb-6">Supported providers</h3>
          <div className="grid grid-cols-2 gap-3">
            {PROVIDERS.map((p) => (
              <div
                key={p.name}
                className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-brand-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-syne text-sm font-bold">{p.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-white/30 font-space">{p.tag}</span>
                </div>
                <p className="text-[11px] text-gray-500 font-space">{p.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-gray-600 font-space mt-6 text-center">
            + Together AI, custom OpenAI-compatible endpoints
          </p>
          <Link
            href="/signup"
            className="mt-6 block w-full text-center py-3 bg-brand-primary/20 border border-brand-primary/40 rounded-full font-syne text-sm font-bold hover:bg-brand-primary hover:text-white transition-all"
          >
            Get early access
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
