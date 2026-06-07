'use client';

import Link from 'next/link';

const STEPS = [
  { n: '01', title: 'Export from ByteVerse', body: 'Download SCORM 1.2 or HTML when your module is ready.' },
  { n: '02', title: 'Import in Sudar Studio', body: 'Upload the ZIP via SCORM import—edit and publish like any course.' },
  { n: '03', title: 'Deliver on Sudar Learn', body: 'Learners get adaptive paths, modalities, and the memory-aware tutor—without rebuilding content in Studio.' },
];

export default function DeploySudar() {
  return (
    <section className="py-32 px-6 max-w-5xl mx-auto">
      <p className="font-space text-[10px] tracking-[0.5em] text-brand-primary uppercase mb-4 text-center">
        Optional hosting
      </p>
      <h2 className="font-syne text-4xl md:text-6xl font-extrabold text-center tracking-tighter mb-16">
        DEPLOY WITH <span className="text-brand-primary">SUDAR</span>
      </h2>
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {STEPS.map((s) => (
          <div key={s.n} className="apple-glass p-8 rounded-2xl border border-white/5 text-center">
            <div className="text-brand-primary font-syne font-bold text-sm mb-4">{s.n}</div>
            <h3 className="font-syne text-lg font-bold mb-3">{s.title}</h3>
            <p className="font-space text-sm text-gray-400">{s.body}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-500 text-sm font-space mb-8 max-w-2xl mx-auto">
        ByteVerse and Sudar are independent products: create here, host there. You can also import SCORM into Moodle, Canvas, or any compliant LMS.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="https://teachwithsudar.com"
          target="_blank"
          rel="noreferrer"
          className="px-8 py-4 border border-white/20 rounded-full font-syne font-bold text-sm hover:bg-white/5"
        >
          Learn about Sudar
        </a>
        <Link
          href="/app/new"
          className="px-8 py-4 bg-white text-black rounded-full font-syne font-bold text-sm hover:bg-brand-primary hover:text-white transition-all"
        >
          Start in ByteVerse
        </Link>
      </div>
    </section>
  );
}
