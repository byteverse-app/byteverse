import React from 'react'

const QA = ({q,a}) => (
  <details className="nimbus-card p-5">
    <summary className="cursor-pointer font-medium">{q}</summary>
    <p className="mt-2 text-white/70">{a}</p>
  </details>
)

export default function FAQ() {
  return (
    <section id="faq" className="container-narrow py-20">
      <h2 className="text-3xl font-semibold tracking-tight text-center">Frequently asked</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-5">
        <QA q="How does ByteVerse incorporate pedagogical frameworks?" a="ByteVerse uses AI to automatically apply ADDIE methodology, align with Bloom's Taxonomy, and integrate adult learning principles (andragogy) for pedagogically-sound microlearning design."/>
        <QA q="What AI learning research does ByteVerse leverage?" a="Our AI incorporates latest research in cognitive load theory, spaced repetition, microlearning effectiveness, and adaptive learning to create optimal learning experiences."/>
        <QA q="Does it support instructional design standards?" a="Yes. ByteVerse follows SCORM/xAPI standards, supports learning analytics, and integrates with major LMS platforms for seamless deployment."/>
        <QA q="How does ByteAI enhance the learning design process?" a="ByteAI is the core engine that powers the entire ByteVerse ecosystem. It analyzes content complexity, suggests learning objectives, recommends assessment strategies, and optimizes content for different learning styles and cognitive preferences."/>
      </div>
    </section>
  )
}
