import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ParticleStream = () => {
  const particles = useMemo(() => 
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      distance: 100 + Math.random() * 400,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full bg-gradient-to-tr from-white to-[#7D7DFF] blur-[1px]"
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: Math.cos(p.angle) * p.distance,
            y: Math.sin(p.angle) * p.distance,
            scale: [0, 1, 2],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            width: p.size,
            height: p.size,
            filter: 'drop-shadow(0 0 10px rgba(125, 125, 255, 0.5))',
          }}
        />
      ))}
    </div>
  );
};

const CharReveal = ({ text, delay = 0, nowrap = false }) => {
  return (
    <span className={`inline-flex justify-center ${nowrap ? 'whitespace-nowrap' : ''}`}>
      {text.split("").map((char, i) => (
        <span key={i} className="relative inline-block overflow-hidden">
          <motion.span
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.02,
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const yTranslate = useTransform(scrollY, [0, 500], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 sm:pt-32 pb-12 md:pb-16 overflow-hidden px-4 sm:px-6">
      <motion.div 
        style={{ y: yTranslate, opacity }}
        className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
      >
        <ParticleStream />
      </motion.div>

      <div className="relative z-10 text-center max-w-7xl mx-auto pointer-events-none px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          className="pointer-events-auto"
        >
          <motion.span 
            variants={itemVariants} 
            transition={{ delay: 0.1 }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 font-space text-[10px] font-bold tracking-[0.4em] uppercase mb-12 text-white/50"
          >
            AI-Powered Learning
          </motion.span>
          
          <h1 className="font-syne text-[clamp(1.75rem,6vw,4rem)] sm:text-[clamp(2.5rem,9vw,4rem)] md:text-[clamp(3.5rem,7.5vw,8rem)] font-extrabold leading-[0.95] tracking-tighter mb-6 sm:mb-12 uppercase">
            <span className="whitespace-nowrap block">
              <CharReveal text="BYTEVERSE" delay={0.3} nowrap />
            </span>
          </h1>

          <motion.p 
            variants={itemVariants} 
            transition={{ delay: 1.3 }}
            className="font-space text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-4 leading-relaxed tracking-tight text-balance font-light"
          >
            The platform remembers each learner and adapts — leveraging memory and contextual awareness of the course and your learning history for a holistic experience.
          </motion.p>

          <motion.p 
            variants={itemVariants} 
            transition={{ delay: 1.4 }}
            className="font-space text-sm text-gray-500 max-w-2xl mx-auto mb-16 leading-relaxed tracking-tight"
          >
            Personalized. Adaptive.
          </motion.p>

          <motion.div 
            variants={itemVariants} 
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-stretch sm:items-center w-full sm:w-auto"
          >
            <a 
              href="#universe"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#universe')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 sm:px-12 py-4 sm:py-6 bg-white text-black font-syne font-bold text-sm tracking-tight rounded-full hover:scale-105 transition-all duration-700 flex items-center justify-center gap-4 shadow-[0_30px_60px_-15px_rgba(255,255,255,0.3)] w-full sm:w-auto min-h-[48px]"
            >
              Explore ByteVerse
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="https://github.com/lorddannykay/ByteOS"
              target="_blank"
              rel="noreferrer"
              className="px-8 sm:px-12 py-4 sm:py-6 border border-white/10 text-white/80 font-syne font-bold text-sm tracking-tight rounded-full hover:bg-white/5 transition-all w-full sm:w-auto min-h-[48px] flex items-center justify-center"
            >
              View on GitHub
            </a>
            <a 
              href="#waitlist"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 sm:px-12 py-4 sm:py-6 border border-white/10 text-white/80 font-syne font-bold text-sm tracking-tight rounded-full hover:bg-white/5 transition-all w-full sm:w-auto min-h-[48px] flex items-center justify-center"
            >
              Join Waitlist
            </a>
          </motion.div>

          <motion.p 
            variants={itemVariants} 
            transition={{ delay: 1.6 }}
            className="font-space text-[10px] text-white/40 max-w-2xl mx-auto mt-8 tracking-[0.2em] uppercase"
          >
            Part of the ByteVerse Ecosystem • Built for learners and L&D teams
          </motion.p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-12 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/40 to-transparent" />
        <span className="font-space text-[9px] font-bold tracking-[0.5em] text-white/40 uppercase">Scroll to Explore</span>
      </motion.div>
    </section>
  );
};

export default Hero;
