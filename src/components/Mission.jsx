import React from 'react'

export default function Mission() {
  return (
    <section id="mission" className="container-narrow py-20">
      <div className="nimbus-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto">
            ByteVerse is an AI-powered learning platform, powered by ByteAI - democratizing AI-powered learning 
            design for educators, trainers, and content creators worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Meet Dhani</h3>
              <p className="text-white/70 leading-relaxed">
                Dhani is the Founder of ByteVerse and Global Head of Learning Tech and Data Strategy. He leads the vision 
                behind the ByteVerse ecosystem—an AI-powered learning platform built to be intuitive, adaptive, and free 
                from traditional barriers. A lifelong learner, he has spent years seeking methods that put the learner 
                first; that same drive now powers ByteVerse.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">The Vision</h3>
              <p className="text-white/70 leading-relaxed">
                ByteVerse exists to make learning so natural and dynamic that anyone, anywhere, can confidently master 
                new skills. From learners in remote communities to professionals upskilling at scale, the mission is 
                clear: no one should be left behind in the knowledge economy.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">The ByteVerse Ecosystem</h3>
              <p className="text-white/70 leading-relaxed">
                ByteVerse is the comprehensive ecosystem powered by ByteAI's advanced learning algorithms, built to 
                transform how we create, deliver, and experience learning in the digital age.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Why Forever Free?</h3>
              <p className="text-white/70 leading-relaxed">
                Education should never be a barrier. ByteVerse will always remain free—powerful AI-assisted learning 
                design tools belong in the hands of everyone, from individual educators to global L&D teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Join the Journey</h3>
              <p className="text-white/70 leading-relaxed">
                ByteVerse is in active development, with a team committed to building a world-class platform for the 
                global learning community. Feedback, contributions, and collaboration from educators and learners are 
                what will make ByteVerse the standard for adaptive, AI-powered learning.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-white/60">
            Let's build something great together! 🚀
          </p>
        </div>
      </div>
    </section>
  )
}
