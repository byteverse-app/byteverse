import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const Pricing = () => {
  const features = [
    "AI-assisted design following ADDIE framework",
    "Bloom's Taxonomy-aligned learning objectives",
    "Adult learning principles integration",
    "SCORM/xAPI export capabilities",
    "Team collaboration features (coming soon)"
  ];

  return (
    <section id="pricing" className="py-32 md:py-40 px-4 md:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="apple-glass rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 border border-white/10 relative overflow-hidden"
        >
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#7D7DFF]/10 blur-[150px] rounded-full" />
          
          <div className="grid lg:grid-cols-2 gap-16 md:gap-20 items-center relative z-10">
            <div>
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8 }}
                className="font-space text-[10px] font-bold tracking-[0.5em] text-[#7D7DFF] uppercase mb-8 block"
              >
                ACCESSIBILITY FIRST
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-syne text-[clamp(2.5rem,8vw,5.5rem)] font-extrabold text-white tracking-tighter mb-10 leading-none"
              >
                Forever Free
              </motion.h2>
              <p className="font-space text-gray-500 text-lg md:text-xl leading-relaxed font-light max-w-lg">
                ByteVerse will always be free. We believe in democratizing AI-powered learning design tools for educators and creators worldwide.
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1 }}
              className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-center shadow-2xl"
            >
              <div className="font-syne text-7xl md:text-8xl font-black text-white mb-4">$0</div>
              <div className="font-space text-[10px] font-bold tracking-[0.4em] text-[#7D7DFF] uppercase mb-12">NO SUBSCRIPTION REQUIRED</div>
              <a 
                href="#waitlist"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#waitlist')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-6 bg-white text-black font-syne font-bold text-lg rounded-2xl hover:bg-[#7D7DFF] hover:text-white transition-all duration-500 hover:scale-[1.02] flex items-center justify-center"
              >
                Join Waitlist
              </a>
            </motion.div>
          </div>

          <div className="mt-20 md:mt-24 pt-16 md:pt-24 border-t border-white/5">
            <div className="text-center mb-16">
              <span className="font-space text-[10px] font-bold tracking-[0.4em] text-white/40 uppercase">INCLUDED IN EVERY ACCOUNT</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
              {features.map((feature, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-5 group"
                >
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#7D7DFF]/20 flex items-center justify-center text-[#7D7DFF] group-hover:bg-[#7D7DFF] group-hover:text-white transition-all shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <span className="font-space text-white/60 text-lg font-light leading-tight">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
