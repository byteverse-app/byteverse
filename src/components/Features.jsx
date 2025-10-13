import React from 'react'

const Feature = ({ title, desc }) => (
  <div className="nimbus-card p-6">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-white/70">{desc}</p>
  </div>
)

export default function Features() {
  const items = [
    {
      title: 'Multimodal Learning',
      desc: 'Standard, Flashcards, Video, Audio, and Mind Map. Pick a mode and switch anytime.'
    },
    {
      title: 'Lesson Seed',
      desc: 'Align once, reuse everywhere. One source generates every modality.'
    },
    {
      title: 'Seamless Switching',
      desc: 'Stay in the same unit while changing modes. Context and progress carry over.'
    },
    {
      title: 'AI-Powered Creation',
      desc: 'Generate lessons and transformations with Together AI models (Llama, Gemma, DeepSeek, Flux).'
    },
    {
      title: 'Open & Fast',
      desc: 'Open-source, Vite + React + Tailwind. Deployed on GitHub Pages.'
    }
  ];

  return (
    <section id="features" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold">Why ByteVerse</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl p-5 bg-white/70 dark:bg-white/5 shadow-card ring-1 ring-black/5">
            <div className="font-semibold">{it.title}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
