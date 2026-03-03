import React from 'react';
import CosmicBackground from './components/space/CosmicBackground';
import Navigation from './components/ui/Navigation';
import Hero from './components/sections/Hero';
import Mission from './components/sections/Mission';
import Founder from './components/sections/Founder';
import BentoFeatures from './components/sections/BentoFeatures';
import UniverseExplore from './components/sections/UniverseExplore';
import Journey from './components/sections/Journey';
import Pricing from './components/sections/Pricing';
import FAQ from './components/sections/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import Footer from './components/layout/Footer';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children, id }) => (
  <motion.div
    id={id}
    initial={{ opacity: 0, y: 40, scale: 0.98 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
);

const App = () => {
  return (
    <div className="relative min-h-screen selection:bg-[#7D7DFF]/30 selection:text-white overflow-x-hidden bg-black">
      <CosmicBackground />
      <Navigation />
      
      <main className="relative z-10">
        <Hero />
        
        <SectionWrapper id="mission">
          <Mission />
        </SectionWrapper>
        
        <SectionWrapper id="universe">
          <UniverseExplore />
        </SectionWrapper>
        
        <SectionWrapper id="features">
          <BentoFeatures />
        </SectionWrapper>
        
        <SectionWrapper id="founder">
          <Founder />
        </SectionWrapper>
        
        <SectionWrapper id="journey">
          <Journey />
        </SectionWrapper>
        
        <SectionWrapper id="pricing">
          <Pricing />
        </SectionWrapper>
        
        <SectionWrapper id="faq">
          <FAQ />
        </SectionWrapper>
        
        <SectionWrapper id="waitlist">
          <CTA />
        </SectionWrapper>
        
        <SectionWrapper id="contact">
          <Contact />
        </SectionWrapper>
        
        <section id="portal" className="py-32 md:py-64 px-4 md:px-6 flex flex-col items-center justify-center relative overflow-hidden bg-[#030303]">
          <div className="absolute w-[1200px] h-[1200px] bg-[#7D7DFF]/5 blur-[250px] rounded-full pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl text-center relative z-10"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8 }}
              className="font-space text-[10px] font-bold tracking-[0.6em] text-[#7D7DFF] uppercase mb-12"
            >
              Terminal Access
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-syne text-5xl md:text-7xl lg:text-9xl font-extrabold tracking-tighter mb-12 md:mb-16 leading-[0.9]"
            >
              <span className="block whitespace-nowrap">BEYOND THE</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white/40 to-white/5 italic block whitespace-nowrap">HORIZON.</span>
            </motion.h2>
            <p className="font-space text-gray-400 text-xl mb-24 font-light max-w-2xl mx-auto tracking-tight leading-relaxed">
              Synthesize your learning journey. Memory-aware, adaptive.
            </p>
            <a 
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative px-20 py-8 bg-white text-black font-syne font-bold text-lg tracking-tight rounded-full overflow-hidden transition-all duration-700 hover:scale-105 active:scale-95 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.4)] inline-block"
            >
              <span className="relative z-10">Join Waitlist</span>
              <div className="absolute inset-0 bg-[#7D7DFF] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </a>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-[linear-gradient(transparent_0%,_#030303_100%)] z-[5]" />
          <div 
            className="absolute bottom-[-100px] left-[-20%] right-[-20%] h-[400px] opacity-10 pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at center, transparent 0, #030303 70%), linear-gradient(0deg, #7D7DFF 1px, transparent 1px), linear-gradient(90deg, #7D7DFF 1px, transparent 1px)',
              backgroundSize: '100% 100%, 80px 80px, 80px 80px',
              transform: 'perspective(500px) rotateX(60deg)'
            }}
          />
        </section>
      </main>

      <Footer />

      <div className="fixed bottom-12 right-12 hidden lg:flex items-center gap-6 apple-glass px-6 py-3 rounded-full border border-white/5 z-[100] shadow-2xl backdrop-blur-xl">
        <div className="flex gap-1.5 h-3 items-end">
          <div className="w-[2.5px] h-1/2 bg-[#7D7DFF] rounded-full animate-[pulse_1.5s_infinite]" />
          <div className="w-[2.5px] h-full bg-[#7D7DFF] rounded-full animate-[pulse_1.5s_infinite_200ms]" />
          <div className="w-[2.5px] h-2/3 bg-[#7D7DFF] rounded-full animate-[pulse_1.5s_infinite_400ms]" />
        </div>
        <span className="font-space text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">ByteAI: NOMINAL</span>
        <div className="w-1.5 h-1.5 rounded-full bg-[#7D7DFF] shadow-[0_0_10px_#7D7DFF]" />
        <span className="font-space text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase">0.02ms Response</span>
      </div>
    </div>
  );
};

export default App;