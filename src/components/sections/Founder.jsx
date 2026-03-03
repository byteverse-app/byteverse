import React from 'react';
import { motion } from 'framer-motion';

const Founder = () => {
  const points = [
    {
      id: "01",
      title: "Meet Dhani",
      content: "Dhani is the Founder of ByteVerse and Global Head of Learning Tech and Data Strategy. He leads the vision behind the ByteVerse ecosystem—an AI-powered learning platform built to be intuitive, adaptive, and free from traditional barriers. A lifelong learner, he has spent years seeking methods that put the learner first; that same drive now powers ByteVerse."
    },
    {
      id: "02",
      title: "The Vision",
      content: "ByteVerse exists to make learning so natural and dynamic that anyone, anywhere, can confidently master new skills. From learners in remote communities to professionals upskilling at scale, the mission is clear: no one should be left behind in the knowledge economy."
    },
    {
      id: "04",
      title: "Join the Journey",
      content: "ByteVerse is in active development, with a team committed to building a world-class platform for the global learning community. Feedback, contributions, and collaboration from educators and learners are what will make ByteVerse the standard for adaptive, AI-powered learning."
    }
  ];

  return (
    <section id="founder" className="py-32 md:py-40 px-4 md:px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-24">
          {points.slice(0, 2).map((point) => (
            <motion.div 
              key={point.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1 }}
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-10 h-10 rounded-full bg-[#5227FF]/20 border border-[#5227FF]/40 flex items-center justify-center">
                  <span className="font-syne font-bold text-xs text-[#5227FF]">{point.id}</span>
                </div>
                <h3 className="font-syne text-3xl font-bold text-white tracking-tight">{point.title}</h3>
              </div>
              <p className="font-space text-gray-400 leading-relaxed text-lg font-light pl-16">
                {point.content}
              </p>
            </motion.div>
          ))}
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 1 }}
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#5227FF]/20 border border-[#5227FF]/40 flex items-center justify-center">
                <span className="font-syne font-bold text-xs text-[#5227FF]">04</span>
              </div>
              <h3 className="font-syne text-3xl font-bold text-white tracking-tight">Join the Journey</h3>
            </div>
            <p className="font-space text-gray-400 leading-relaxed text-lg font-light pl-16">
              ByteVerse is in active development, with a team committed to building a world-class platform for the global learning community. Feedback, contributions, and collaboration from educators and learners are what will make ByteVerse the standard for adaptive, AI-powered learning.
            </p>
          </motion.div>
        </div>

        <div className="lg:sticky lg:top-40 space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="apple-glass p-12 rounded-[3rem] border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="flex items-center gap-6 mb-10">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center">
                <span className="font-syne font-bold text-xs text-[#FFD700]">03</span>
              </div>
              <h3 className="font-syne text-3xl font-bold text-white tracking-tight">Forever Free</h3>
            </div>
            <p className="font-space text-gray-400 text-lg leading-relaxed font-light mb-8">
              Education should never be a barrier. ByteVerse will always remain free—powerful AI-assisted learning design tools belong in the hands of everyone, from individual educators to global L&D teams.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
