import React from 'react'

const items = [
  { title: 'Multimodal Learning', desc: 'Standard, Flashcards, Video, Audio, and Mind Map. Pick a mode and switch anytime.' },
  { title: 'Lesson Seed', desc: 'Align once, reuse everywhere. One source generates every modality.' },
  { title: 'Seamless Switching', desc: 'Stay in the same unit while changing modes. Context and progress carry over.' },
  { title: 'AI-Powered Creation', desc: 'Generate lessons and transformations with Together AI models (Llama, Gemma, DeepSeek, Flux).' },
  { title: 'Open & Fast', desc: 'Open-source, Vite + React + Tailwind. Deployed on GitHub Pages.' }
];

const Feature = ({ title, desc }) => (
  <div className="nimbus-card p-6">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-white/70">{desc}</p>
  </div>
)

export default function Features() {
  return (
    <section id="features" className="container-narrow py-20">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">ByteVerse Features</h2>
      <p className="mt-3 text-center text-white/70 max-w-3xl mx-auto">Choose your learning modality, switch anytime, and stay aligned with the same Lesson Seed.</p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Feature key={index} title={item.title} desc={item.desc} />
        ))}
      </div>
    </section>
  )
}
