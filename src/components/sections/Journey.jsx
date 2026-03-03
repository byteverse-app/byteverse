import React from 'react';
import { motion } from 'framer-motion';

const JourneyStep = ({ number, title, desc, align }) => (
  <motion.div 
    initial={{ opacity: 0, x: align === 'left' ? -20 : 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    className={`flex items-center gap-8 mb-32 last:mb-0 ${align === 'right' ? 'flex-row-reverse text-right' : 'text-left'}`}
  >
    <div className="hidden md:block flex-1">
       <div className={`p-10 rounded-[2.5rem] apple-glass border border-white/5 hover:border-[#7D7DFF]/20 transition-all group relative overflow-hidden`}>
         <div className="absolute inset-0 bg-gradient-to-br from-[#7D7DFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
         <h4 className="font-syne text-2xl font-bold text-white mb-4 tracking-tight">{title}</h4>
         <p className="font-space text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
       </div>
    </div>
    
    <div className="relative flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-black border border-white/10 shadow-[0_0_30px_rgba(125,125,255,0.2)] flex items-center justify-center z-10">
        <span className="font-syne font-black text-xl text-white">{number}</span>
      </div>
      <div className="absolute top-16 bottom-[-150%] w-[1px] bg-gradient-to-b from-[#7D7DFF] via-white/10 to-transparent opacity-30" />
    </div>

    <div className="flex-1 md:hidden">
       <div className="p-8 rounded-[2rem] apple-glass border border-white/5">
         <h4 className="font-syne text-xl font-bold text-white mb-3 tracking-tight">{title}</h4>
         <p className="font-space text-gray-400 text-xs leading-relaxed font-light">{desc}</p>
       </div>
    </div>
    <div className="hidden md:block flex-1" />
  </motion.div>
);

const Journey = () => {
  const steps = [
    { number: '01', title: 'Your Context', desc: 'ByteVerse uses your goals, prior knowledge, and preferences to shape your learning path from the start.' },
    { number: '02', title: 'Byte Learns With You', desc: 'The AI learns with you—understanding your needs, remembering struggles and preferences, and planning personalized multimodal experiences.' },
    { number: '03', title: 'Multimodal Delivery', desc: 'Learn in the format that fits: text, audio, flashcards, and video. Switch anytime; context and progress carry over.' },
    { number: '04', title: 'Your Mode, Your Pace', desc: 'Switch between learning modes seamlessly. ByteVerse adapts to how you learn best, without losing your progress.' },
    { number: '05', title: 'Continuous Adaptation', desc: 'Your progress and interactions flow back—memory and contextual awareness refine personalization for every future session.' },
  ];

  return (
    <section id="journey" className="py-32 md:py-40 px-4 md:px-6 relative overflow-hidden bg-black">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="font-space text-[10px] font-bold tracking-[0.5em] text-[#7D7DFF] uppercase mb-6"
          >
            The Protocol
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-syne text-5xl md:text-7xl font-extrabold text-white mb-10 tracking-tighter"
          >
            THE ARCHITECTURE <br />
            <span className="text-white/20 italic">OF GROWTH</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-space text-gray-500 text-lg max-w-xl mx-auto font-light leading-relaxed"
          >
            From your context and goals to a personalized, multidimensional learning experience.
          </motion.p>
        </div>

        <div className="relative">
          {steps.map((step, i) => (
            <JourneyStep key={i} {...step} align={i % 2 === 0 ? 'left' : 'right'} />
          ))}
        </div>
      </div>
      
      {/* Decorative background depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(125,125,255,0.03)_0%,_transparent_70%)] pointer-events-none" />
    </section>
  );
};

export default Journey;
