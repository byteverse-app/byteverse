import React from 'react';
import { motion } from 'framer-motion';

const Navigation = () => {
  const scrollToSection = (e, href) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-8 px-6 pointer-events-none"
    >
      <nav className="apple-glass px-10 py-3.5 rounded-full flex items-center gap-10 pointer-events-auto border border-white/5 shadow-2xl">
        <a 
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 pr-4 border-r border-white/10 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/images/icons/ByteB_white.png" 
            alt="ByteVerse Logo" 
            className="w-8 h-8"
          />
          <span className="font-syne font-bold text-xs tracking-widest">BYTEVERSE</span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {[
            { name: 'Universe', href: '#universe' },
            { name: 'Features', href: '#features' },
            { name: 'Journey', href: '#journey' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'FAQ', href: '#faq' }
          ].map((item) => (
            <a 
              key={item.name}
              href={item.href}
              onClick={(e) => scrollToSection(e, item.href)}
              className="font-space text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 hover:text-white transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>

        <a 
          href="#waitlist"
          onClick={(e) => scrollToSection(e, '#waitlist')}
          className="font-space text-[10px] font-bold uppercase tracking-[0.2em] bg-white text-black px-6 py-2.5 rounded-full hover:bg-[#7D7DFF] hover:text-white transition-all duration-500"
        >
          Join Waitlist
        </a>
      </nav>
    </motion.header>
  );
};

export default Navigation;
