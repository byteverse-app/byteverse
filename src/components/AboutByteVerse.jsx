import React from 'react';

export default function AboutByteVerse() {
  return (
    <section id="about-byteverse" className="container-narrow py-20">
      <div className="nimbus-card p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            The ByteVerse Universe
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            Small, elegant pieces—connected with purpose. Every symbol is intentionally simple, 
            like a good API: predictable, reusable, and easy to combine.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ByteAI - The Core Nucleus */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteAI/transparent/ByteAI_transparent_512.png" 
                alt="ByteAI Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteAI</h3>
                <p className="text-sm text-white/60">The Core Nucleus</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              At the center of the ByteVerse is a calm, bright nucleus. Eight short rays radiate 
              outward—eight bits forming a single byte—while a protective ring suggests a focused mind.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Octagon core + 8 rays inside a ring = the byte that powers everything.
            </div>
          </div>

          {/* ByteVerse - The Connected Universe */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteVerse/transparent/ByteVerse_transparent_512.png" 
                alt="ByteVerse Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteVerse</h3>
                <p className="text-sm text-white/60">The Connected Universe</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Zoom out and you'll see routes, not walls. Lines converge into a strong "V", showing 
              how tools, data, and people connect across the ecosystem.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> A V-shaped constellation lattice; everything orbits purpose.
            </div>
          </div>

          {/* ByteNimbus - Design-Heavy Content Generator */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteNimbus/transparent/ByteNimbus_transparent_512.png" 
                alt="ByteNimbus Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteNimbus</h3>
                <p className="text-sm text-white/60">Design-Heavy Content Generator</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Nimbus is the studio in the sky. It blends visual craft with AI speed—beautiful, 
              on-brand learning collateral at the push of a button.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Creative cloud + pen-nib diamond + export arrow.
            </div>
          </div>

          {/* ByteTok - Social, Snackable Learning */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteTok/transparent/ByteTok_transparent_512.png" 
                alt="ByteTok Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteTok</h3>
                <p className="text-sm text-white/60">Social, Snackable Learning</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Learning is social. ByteTok turns insights into shareable, scroll-friendly posts 
              and short videos. The bubbles overlap to show conversation.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Overlapping chat bubbles with a play triangle.
            </div>
          </div>

          {/* ByteLab - Experimentation & Rapid Prototyping */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteLab/transparent/ByteLab_transparent_512.png" 
                alt="ByteLab Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteLab</h3>
                <p className="text-sm text-white/60">Experimentation & Rapid Prototyping</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              ByteLab is where ideas get their first oxygen. Spin up prototypes, compare versions, 
              and measure impact. The simple math around the flask is the loop.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Flask with ± and =. Try, tweak, learn.
            </div>
          </div>

          {/* ByteAnalytics - Dashboards & Insight */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteAnalytics/transparent/ByteAnalytics_transparent_512.png" 
                alt="ByteAnalytics Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteAnalytics</h3>
                <p className="text-sm text-white/60">Dashboards & Insight</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Data deserves clarity. ByteAnalytics translates activity into understanding—where 
              learners struggle, which content works, what to fix next.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Three bars and a rising line to a focus dot.
            </div>
          </div>

          {/* ByteSim - Scenario Practice with Feedback Loops */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteSim/transparent/ByteSim_transparent_512.png" 
                alt="ByteSim Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteSim</h3>
                <p className="text-sm text-white/60">Scenario Practice with Feedback Loops</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Confidence comes from reps. ByteSim lets learners make choices, see consequences, 
              and loop again—without real-world risk.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Decision diamond, branching path, and a loop-back arrow.
            </div>
          </div>

          {/* ByteHub - Library of Prebuilt & Curated Content */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteHub/transparent/ByteHub_transparent_512.png" 
                alt="ByteHub Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteHub</h3>
                <p className="text-sm text-white/60">Library of Prebuilt & Curated Content</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Not everything needs to be built from scratch. ByteHub is the shelf where ready-to-use 
              modules live—curated, tagged, remixable.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Shelves with a bookmark tab.
            </div>
          </div>

          {/* ByteGenie - Contextual Assistant & Automation */}
          <div className="nimbus-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img 
                src="/images/ByteVerse-Brand-Pack/ByteGenie/transparent/ByteGenie_transparent_512.png" 
                alt="ByteGenie Logo" 
                className="w-12 h-12"
              />
              <div>
                <h3 className="text-xl font-semibold">ByteGenie</h3>
                <p className="text-sm text-white/60">Contextual Assistant & Automation</p>
              </div>
            </div>
            <p className="text-white/70 text-sm mb-3">
              Genie is the co-pilot that reduces friction: it fetches what you need, suggests the 
              next step, and automates the boring bits.
            </p>
            <div className="text-xs text-white/50">
              <strong>Symbolism:</strong> Minimal wand, guiding star, and a dotted path.
            </div>
          </div>
        </div>

        {/* The ByteVerse Promise */}
        <div className="mt-12 nimbus-card p-8">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-4">The ByteVerse Promise</h3>
            <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto">
              Together they form a constellation—your learning universe—where content is beautiful, 
              data is legible, practice is safe, and help is always one prompt away.
            </p>
            <div className="mt-6 text-sm text-white/60">
              <p>Every symbol is intentionally simple, like a good API: predictable, reusable, and easy to combine.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}