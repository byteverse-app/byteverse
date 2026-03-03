export default function SeedSection() {
  return (
    <section id="personalized" className="container-narrow py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-center mb-3">Personalized Learning</h2>
        <p className="text-center text-white/70 max-w-3xl mx-auto mb-10">
          ByteVerse leverages memory and contextual awareness of the course and your past learning history to deliver a holistic experience. One source, every modality—aligned and adaptive.
        </p>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Memory-aware</h3>
            <p className="text-white/70 text-sm">Byte remembers your struggles, preferences, and progress across sessions and courses.</p>
          </div>
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Switch anytime</h3>
            <p className="text-white/70 text-sm">Learners can jump between text, video, audio, and flashcards without losing progress.</p>
          </div>
          <div className="nimbus-card p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Adaptation</h3>
            <p className="text-white/70 text-sm">Context and behaviour shape the next best action and personalisation for every session.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
