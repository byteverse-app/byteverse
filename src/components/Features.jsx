import React from 'react'

const Feature = ({ title, desc }) => (
  <div className="nimbus-card p-6">
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-white/70">{desc}</p>
  </div>
)

export default function Features() {
  return (
    <section id="features" className="container-narrow py-20">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center">AI-Enhanced Learning Design</h2>
      <p className="mt-3 text-center text-white/70 max-w-3xl mx-auto">Leverage cutting-edge AI to create pedagogically-sound microlearning that follows proven instructional design frameworks and adult learning principles.</p>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Feature title="ADDIE Framework Integration" desc="AI-assisted Analysis, Design, Development, Implementation, and Evaluation following industry-standard instructional design methodology."/>
        <Feature title="Bloom's Taxonomy Alignment" desc="Automatically align learning objectives with cognitive levels—from Remember to Create—ensuring proper skill progression and assessment design."/>
        <Feature title="Adult Learning Principles" desc="Incorporate Knowles' principles of andragogy: self-direction, experience-based learning, and immediate application to real-world scenarios."/>
      </div>
    </section>
  )
}
