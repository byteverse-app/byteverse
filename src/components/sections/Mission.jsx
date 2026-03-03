import React from 'react';
import { motion } from 'framer-motion';

const Mission = () => {
  return (
    <section id="mission" className="py-32 md:py-40 px-4 md:px-6 bg-black text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-space text-[10px] font-bold tracking-[0.5em] text-[#7D7DFF] uppercase mb-8 block"
        >
          THE JOURNEY
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne text-[clamp(2.5rem,10vw,5rem)] font-extrabold tracking-tighter mb-12 text-white leading-none"
        >
          Our Mission
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-space text-gray-400 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto font-light text-balance"
        >
          We're democratizing the future of knowledge design for educators and creators worldwide.
        </motion.p>
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(125,125,255,0.04)_0%,_transparent_70%)] pointer-events-none" />
    </section>
  );
};

export default Mission;
