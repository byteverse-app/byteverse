export default function SeedSection() {
  return (
    <section id="seed" className="container-narrow py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-3">Lesson Seed</h2>
        <p className="text-center text-white/70 max-w-3xl mx-auto mb-10">
          The Seed is the single source of truth. We personalize it once, then generate aligned modalities from it.
        </p>
        <div className="nimbus-card p-6">
          <pre className="rounded-xl p-4 bg-gray-900 text-gray-100 overflow-auto text-sm">
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
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Align once, reuse everywhere</h3>
            <p className="text-white/70 text-sm">The same concepts appear coherently in every mode.</p>
          </div>
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Switch anytime</h3>
            <p className="text-white/70 text-sm">Learners can jump modes without losing progress.</p>
          </div>
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Adaptation</h3>
            <p className="text-white/70 text-sm">Analytics nudge the next best mode (e.g., flashcards for recall).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
