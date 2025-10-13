import React, { useState } from 'react';

const MODES = [
  { key: 'standard', title: 'Standard', blurb: 'Clear explanations and examples for quick understanding.' },
  { key: 'flashcards', title: 'Flashcards', blurb: 'Active recall for stronger memory.' },
  { key: 'video', title: 'Video', blurb: 'Watch, pause, and jump with timed notes.' },
  { key: 'audio', title: 'Audio', blurb: 'Listen on the go with transcript and speed control.' },
  { key: 'mindmap', title: 'Mind Map', blurb: 'See the big picture and relationships between ideas.' },
];

export default function ModesSection() {
  const [active, setActive] = useState(MODES[0]);

  return (
    <section id="modes" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-ink mb-2">Learn your way</h2>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Pick a modality, switch anytime. Your progress and context stay in sync.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white/70 dark:bg-white/5 rounded-2xl p-4 shadow-card ring-1 ring-black/5">
          <div className="h-[260px] rounded-xl bg-[radial-gradient(circle_at_20%_20%,#eef,#dde)] dark:bg-[linear-gradient(160deg,#1b1b3d,#1a3b5c_70%,#2b9ac7)] grid place-items-center text-center">
            <div>
              <div className="text-sm uppercase tracking-wide text-slate-500 mb-1">Preview</div>
              <div className="text-xl font-bold">{active.title}</div>
              <p className="max-w-md mx-auto mt-2 text-slate-700/90 dark:text-slate-100/90">{active.blurb}</p>
              <p className="mt-3 text-xs text-slate-500">Generated from the same Lesson Seed.</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {MODES.map(mode => (
            <button
              key={mode.key}
              onClick={() => setActive(mode)}
              className={`w-full text-left p-4 rounded-xl ring-1 ring-black/5 shadow-card transition
                ${active.key === mode.key ? 'bg-accent text-white' : 'bg-white/80 dark:bg-white/5 hover:bg-white/90'}`}
            >
              <div className="font-semibold">{mode.title}</div>
              <div className={`text-sm ${active.key === mode.key ? 'text-white/90' : 'text-slate-600 dark:text-slate-300'}`}>
                {mode.blurb}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
