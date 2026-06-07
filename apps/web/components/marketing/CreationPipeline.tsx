'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { PIPELINE_STEPS } from './constants';
import CelestialPreview from './CelestialPreview';

export default function CreationPipeline() {
  const [active, setActive] = useState(PIPELINE_STEPS[0]);

  return (
    <section className="py-32 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div>
          <p className="font-space text-[10px] font-bold tracking-[0.5em] text-brand-primary uppercase mb-6">
            Creation pipeline
          </p>
          <h2 className="font-syne text-4xl md:text-6xl font-extrabold tracking-tighter mb-10">
            FROM BRIEF <br />
            <span className="text-white/20 italic">TO EXPORT</span>
          </h2>
          <div className="flex flex-col gap-1">
            {PIPELINE_STEPS.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onMouseEnter={() => setActive(step)}
                className="group py-5 flex items-center justify-between border-b border-white/5 text-left"
              >
                <div className="flex items-center gap-6">
                  <span
                    className={`font-space text-[10px] font-bold ${
                      active.id === step.id ? 'text-brand-primary' : 'text-white/20'
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`font-syne text-xl font-bold transition-all ${
                      active.id === step.id ? 'text-white translate-x-2' : 'text-white/40'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {active.id === step.id && <ChevronRight className="text-brand-primary" size={20} />}
              </button>
            ))}
          </div>
        </div>

        <div className="relative min-h-[480px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="apple-glass p-10 rounded-[3rem] w-full border border-white/10"
            >
              <div className="w-48 h-48 mx-auto mb-8">
                <CelestialPreview type={active.celestialType} color={active.color} />
              </div>
              <p className="text-brand-primary text-xs font-space uppercase tracking-widest mb-2">
                {active.tagline}
              </p>
              <h3 className="font-syne text-2xl font-bold mb-4">{active.name}</h3>
              <p className="font-space text-gray-400 text-sm leading-relaxed">{active.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
