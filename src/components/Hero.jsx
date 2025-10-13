import React from 'react'
import GradientBlinds from './GradientBlinds'
import Ballpit from './Ballpit'

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <GradientBlinds
          gradientColors={['#F5F5F7', '#7D7DFF', '#5227FF']}
          angle={12}
          noise={0.20}
          blindCount={18}
          blindMinWidth={44}
          spotlightRadius={0.6}
          spotlightSoftness={1.4}
          spotlightOpacity={0.9}
          mouseDampening={0.2}
          distortAmount={0.5}
          shineDirection="left"
          mixBlendMode="screen"
        />
      </div>
      <div className="gradient-ring"></div>

      <div className="relative container-narrow text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 text-black text-xs font-medium mb-6">
          ByteAI powered
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] drop-shadow-glow">
          Choose <span className="text-white/80">How</span> You Learn
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
          Choose how you learn — text, flashcards, video, audio, or mind maps — all generated from the same lesson seed.
        </p>
        <p className="mt-3 text-lg font-medium text-white/90">
          One seed. Infinite ways to learn.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#try" className="px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-90 transition hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl">Explore ByteVerse</a>
          <a href="#waitlist" className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition hover:scale-105 transform duration-200">Join waitlist</a>
          <a href="#demo" className="px-6 py-3 rounded-full border border-white/20 hover:border-white/40 transition hover:scale-105 transform duration-200">Watch demo</a>
        </div>

        <div className="mt-16 nimbus-card p-5">
          <div style={{position: 'relative', overflow: 'hidden', height: '255px', width: '100%', borderRadius: '1rem'}}>
            <Ballpit
              count={50}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
              colors={['#7D7DFF', '#5227FF', '#F5F5F7']}
            />
          </div>
          <div className="mt-3 text-xs text-white/60">Experience ByteVerse ecosystem in action - Each sphere represents a core component of our AI-powered platform suite</div>
        </div>

        <div className="mt-6 text-xs text-white/50">
          Part of the ByteVerse Ecosystem • Powered by ByteAI • Built for modern L&D teams
        </div>
      </div>
    </section>
  )
}
