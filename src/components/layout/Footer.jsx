import React from 'react';

const Footer = () => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const menuItems = [
    { name: 'Platform', links: [
      { name: 'Universe', href: '#universe' },
      { name: 'Features', href: '#features' },
      { name: 'Journey', href: '#journey' }
    ]},
    { name: 'Company', links: [
      { name: 'Mission', href: '#mission' },
      { name: 'Founder', href: '#founder' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' }
    ]},
    { name: 'Connect', links: [
      { name: 'Waitlist', href: '#waitlist' },
      { name: 'Contact', href: '#contact' },
      { name: 'GitHub', href: 'https://github.com/Dhanikesh-Karunanithi' },
      { name: 'LinkedIn', href: 'https://www.linkedin.com/in/dhanikesh-karunanithi/' }
    ]}
  ];

  return (
    <footer className="py-32 px-6 border-t border-white/5 bg-[#030303]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-8 cursor-pointer group" onClick={scrollToTop}>
            <img 
              src="/images/icons/ByteB_white.png" 
              alt="ByteVerse Logo" 
              className="w-10 h-10 transition-transform group-hover:rotate-12"
            />
            <span className="font-syne font-bold text-lg tracking-tighter">BYTEVERSE</span>
          </div>
          <p className="font-space text-gray-500 text-sm leading-relaxed mb-10">
            ByteVerse learns with you; for you. Personalized, adaptive, memory-aware.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32">
          {menuItems.map((column) => (
            <div key={column.name}>
              <h4 className="font-syne text-xs font-bold tracking-[0.3em] text-white/40 uppercase mb-8">{column.name}</h4>
              <ul className="space-y-4">
                {column.links.map(link => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      onClick={(e) => scrollToSection(e, link.href)}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                      className="font-space text-sm text-gray-500 hover:text-white transition-colors block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 font-space text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">
        <p>© 2025 BYTEVERSE ARCHITECTURE. ALL SYSTEMS NOMINAL.</p>
        <p>Built in Bombay</p>
      </div>
    </footer>
  );
};

export default Footer;
