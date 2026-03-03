import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Layers, FileText, BookOpen } from 'lucide-react';

const FeatureCard = ({ title, desc, icon: Icon, className, color }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`apple-glass p-10 rounded-[2.5rem] flex flex-col justify-between group overflow-hidden relative ${className}`}
  >
    <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity" style={{ background: color }} />
    
    <div>
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
        <Icon className="w-6 h-6 text-white/80" strokeWidth={1.5} />
      </div>
      <h3 className="font-syne text-2xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="font-space text-gray-400 text-sm leading-relaxed font-light">{desc}</p>
    </div>

    <div className="mt-12 flex items-center gap-2 text-[10px] font-space font-bold tracking-[0.2em] text-white/20 group-hover:text-white transition-colors">
      CORE PROTOCOL <span className="opacity-0 group-hover:opacity-100 transition-all">→</span>
    </div>
  </motion.div>
);

const BentoFeatures = () => {
  return (
    <section id="features" className="py-32 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8 }}
            className="font-space text-[10px] font-bold tracking-[0.5em] text-white/40 uppercase mb-4"
          >
            ByteVerse Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-syne text-5xl md:text-7xl font-extrabold tracking-tighter"
          >
            LEARNING THAT <br />
            <span className="text-white/20 italic">REMEMBERS YOU</span>
          </motion.h2>
        </div>
        <p className="font-space text-gray-500 text-sm max-w-xs md:text-right leading-relaxed">
          Learning that remembers you and adapts. Choose your modality, switch anytime; memory and context stay with you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[340px] gap-8">
        <FeatureCard 
          className="md:col-span-7"
          title="AI Tutor with Memory"
          desc="Byte remembers your struggles and preferences across sessions and courses — not stateless chat."
          icon={Brain}
          color="#7D7DFF"
        />
        <FeatureCard 
          className="md:col-span-5"
          title="Built for L&D and Learners"
          desc="Author in Studio (AI course gen, paths, compliance); learn in Learn (personalised dashboard, paths, certificates)."
          icon={Users}
          color="#7D7DFF"
        />
        <FeatureCard 
          className="md:col-span-5"
          title="Multimodal Learning"
          desc="Text, Flashcards, Video, and Audio. Switch anytime; context and progress carry over."
          icon={Layers}
          color="#FF6B35"
        />
        <FeatureCard 
          className="md:col-span-7"
          title="Contextual & Memory-Aware"
          desc="Leverages course context and your past learning history for a connected, holistic experience."
          icon={FileText}
          color="#FFD700"
        />
        <FeatureCard 
          className="md:col-span-12"
          title="Open & Research-Backed"
          desc="Open-source, evidence-informed. No vendor lock-in."
          icon={BookOpen}
          color="#5227FF"
        />
      </div>
    </section>
  );
};

export default BentoFeatures;
