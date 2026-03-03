import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BYTE_COMPONENTS } from '../../constants';
import { ChevronRight } from 'lucide-react';
import CelestialPreview from '../space/CelestialPreview';

const UniverseExplore = () => {
  const [active, setActive] = useState(BYTE_COMPONENTS[0]);

  return (
    <section id="universe" className="py-32 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="font-space text-[10px] font-bold tracking-[0.5em] text-[#7D7DFF] uppercase mb-6"
          >
            Structural Mapping
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-syne text-4xl md:text-6xl font-extrabold tracking-tighter mb-10 leading-[1.1]"
          >
            THE BYTEVERSE <br />
            <span className="text-white/20 italic">ECOSYSTEM</span>
          </motion.h2>
          
          <div className="flex flex-col gap-1">
            {BYTE_COMPONENTS.map((comp) => (
              <button
                key={comp.id}
                onMouseEnter={() => setActive(comp)}
                className="group relative py-6 flex items-center justify-between text-left transition-all border-b border-white/5"
              >
                <div className="flex items-center gap-6">
                  <span className={`font-space text-[10px] font-bold tracking-widest ${active.id === comp.id ? 'text-[#7D7DFF]' : 'text-white/20'}`}>
                    0{(BYTE_COMPONENTS.indexOf(comp) + 1)}
                  </span>
                  <span className={`font-syne text-xl md:text-2xl font-bold tracking-tight transition-all duration-500 ${active.id === comp.id ? 'translate-x-4 text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                    {comp.name}
                  </span>
                </div>
                {active.id === comp.id && (
                  <motion.div layoutId="arrow" className="text-[#7D7DFF]">
                    <ChevronRight strokeWidth={2.5} size={20} />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="relative min-h-[500px] md:min-h-[600px] lg:h-[700px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotateY: 15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="apple-glass p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] w-full relative z-10 overflow-hidden border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]"
            >
              <div 
                className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[140px] opacity-30 transition-all duration-1000"
                style={{ background: active.color }}
              />
              
              <div className="flex flex-col items-center mb-10">
                <div className="w-64 h-64">
                   <CelestialPreview type={active.celestialType} color={active.color} />
                </div>
              </div>

              <div className="font-space text-[10px] font-bold tracking-[0.3em] text-white/30 mb-3 uppercase">{active.tagline}</div>
              <h3 className="font-syne text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">{active.name}</h3>
              
              <p className="font-space text-white/60 font-light text-lg leading-relaxed mb-12">
                {active.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                {active.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: active.color, boxShadow: `0 0 12px ${active.color}` }} />
                    <span className="font-space text-[11px] font-medium text-white/80 tracking-wide uppercase">{f}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Background Visual Ornament */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none scale-150">
            <div className="w-full h-full border border-white/10 rounded-full animate-[spin_120s_linear_infinite]" />
            <div className="absolute w-[80%] h-[80%] border border-white/20 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniverseExplore;
