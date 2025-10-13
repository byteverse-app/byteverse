import React from 'react'

export default function Pricing() {
  return (
    <section id="pricing" className="container-narrow py-20">
      <div className="nimbus-card p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Forever Free</h2>
            <p className="mt-2 text-white/70">ByteVerse will always be free - democratizing AI-powered learning design for everyone.</p>
          </div>
          <div className="text-right md:w-72">
            <div className="text-4xl font-semibold">Free</div>
            <div className="text-white/60">Forever</div>
            <a href="#waitlist" className="mt-4 inline-block px-5 py-3 rounded-full bg-white text-black font-medium hover:opacity-90 transition">Join waitlist</a>
          </div>
        </div>
        <ul className="mt-6 text-white/70 list-disc pl-5 space-y-2">
          <li>AI-assisted instructional design following ADDIE framework</li>
          <li>Bloom's Taxonomy-aligned learning objectives</li>
          <li>Adult learning principles integration</li>
          <li>SCORM/xAPI export capabilities</li>
          <li>Team collaboration features (coming soon)</li>
        </ul>
      </div>
    </section>
  )
}
