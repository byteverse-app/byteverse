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
            ByteNimbus is part of the ByteVerse ecosystem, powered by ByteAI - democratizing AI-powered learning 
            design for educators, trainers, and content creators worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Meet Dhani</h3>
              <p className="text-white/70 leading-relaxed">
                Hey there! I'm Dhani, Founder of ByteVerse. By day, I'm the Global Head of Learning Tech 
                and Data Strategy (yep, that's a mouthful), but after I've survived the daily grind, I'm busy building 
                the ByteVerse ecosystem. I've always called myself a "daft student" — the kind who's constantly hunting 
                for learning methods that are as intuitive, adaptive, and free from the shackles of traditional 
                classrooms as possible.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">The Vision</h3>
              <p className="text-white/70 leading-relaxed">
                My mission is to make learning so natural, accessible, and dynamic that anyone, anywhere, 
                can confidently master new skills. From students in remote communities to seasoned professionals 
                seeking to upskill - no one should be left behind in the knowledge economy.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">The ByteVerse Ecosystem</h3>
              <p className="text-white/70 leading-relaxed">
                ByteNimbus is just one application within the broader ByteVerse ecosystem I'm building in my 
                spare time, all powered by ByteAI's advanced learning algorithms. This ecosystem represents my 
                personal vision for transforming how we create, deliver, and experience learning in the digital age.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Why Forever Free?</h3>
              <p className="text-white/70 leading-relaxed">
                Education should never be a barrier. ByteNimbus will always remain free because I believe 
                that powerful AI-assisted learning design tools should be accessible to everyone - from 
                individual educators to global L&D teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-3">Join the Journey</h3>
              <p className="text-white/70 leading-relaxed">
                This project is in early development, and I'm committed to building something truly amazing 
                for the learning community. Your feedback, contributions, and collaboration are what will 
                make ByteNimbus extraordinary.
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
