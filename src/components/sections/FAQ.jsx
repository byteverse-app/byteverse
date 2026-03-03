import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-10 flex items-center justify-between text-left group"
      >
        <span className="font-syne text-xl md:text-3xl font-bold text-white group-hover:text-[#7D7DFF] transition-colors tracking-tight">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-[#7D7DFF]"
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pb-10 pl-2 max-w-4xl">
              <p className="font-space text-gray-400 text-lg leading-relaxed font-light">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How does ByteVerse incorporate pedagogical frameworks?",
      answer: "ByteVerse uses AI to automatically apply ADDIE methodology, align with Bloom's Taxonomy, and integrate adult learning principles (andragogy) for pedagogically-sound microlearning design."
    },
    {
      question: "What AI learning research does ByteVerse leverage?",
      answer: "Our AI incorporates latest research in cognitive load theory, spaced repetition, microlearning effectiveness, and adaptive learning to create optimal learning experiences."
    },
    {
      question: "Does it support instructional design standards?",
      answer: "Yes. ByteVerse follows SCORM/xAPI standards, supports learning analytics, and integrates with major LMS platforms for seamless deployment."
    },
    {
      question: "How does ByteAI enhance the learning design process?",
      answer: "ByteAI is the core engine that powers the entire ByteVerse ecosystem. It analyzes content complexity, suggests learning objectives, recommends assessment strategies, and optimizes content for different learning styles."
    }
  ];

  return (
    <section id="faq" className="py-32 md:py-40 px-4 md:px-6 bg-[#030303]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="apple-glass p-8 md:p-20 rounded-[4rem] border border-white/5"
        >
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
