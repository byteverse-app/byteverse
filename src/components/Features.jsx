import React from 'react'

const items = [
  { title: 'AI Tutor with Memory', desc: 'Byte remembers your struggles and preferences across sessions and courses — not stateless chat.' },
  { title: 'Built for L&D and Learners', desc: 'Author in Studio (AI course gen, paths, compliance); learn in Learn (personalised dashboard, paths, certificates).' },
  { title: 'Multimodal Learning', desc: 'Text, Flashcards, Video, and Audio. Switch anytime; context and progress carry over.' },
  { title: 'Contextual & Memory-Aware', desc: 'Leverages course context and your past learning history for a connected, holistic experience.' },
  { title: 'Open & Research-Backed', desc: 'Open-source, evidence-informed. No vendor lock-in.' }
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
      <p className="mt-3 text-center text-white/70 max-w-3xl mx-auto">Learning that remembers you and adapts. Choose your modality, switch anytime; memory and context stay with you.</p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Feature key={index} title={item.title} desc={item.desc} />
        ))}
      </div>
    </section>
  )
}
