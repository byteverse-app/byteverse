import React from 'react';

export default function SeedPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-ink mb-3">Lesson Seed</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        The Seed is the single source of truth. We personalize it once, then generate aligned modalities from it.
      </p>
      <pre className="rounded-xl p-4 bg-slate-900 text-slate-100 overflow-auto shadow-card">
{`{
  "units":[
    {
      "title":"Intro",
      "content":{"keyIdea":"Core concept","bullets":["Point A","Point B"]},
      "flashcards":[{"q":"What is the core concept?","a":"..."},{"q":"Why does it matter?","a":"..."}],
      "mindmap":{"center":"Concept","nodes":[{"id":"A","label":"Def","x":220,"y":110},{"id":"B","label":"Why","x":520,"y":120}],"edges":[["center","A"],["center","B"]]}
    }
  ]
}`}
      </pre>
      <ul className="mt-6 list-disc pl-6 text-slate-700 dark:text-slate-200 space-y-2">
        <li><strong>Align once, reuse everywhere:</strong> the same concepts appear coherently in every mode.</li>
        <li><strong>Switch anytime:</strong> learners can jump modes without losing progress.</li>
        <li><strong>Adaptation:</strong> analytics nudge the next best mode (e.g., flashcards for recall).</li>
      </ul>
    </main>
  );
}
