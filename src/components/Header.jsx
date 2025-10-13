import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="container-narrow py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/images/ByteVerse-Brand-Pack/ByteNimbus/transparent/ByteNimbus_transparent_512.png" 
            alt="ByteNimbus Logo" 
            className="w-7 h-7"
          />
          <span className="font-semibold tracking-tight">ByteVerse</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#try" className="hover:text-white transition">Try Now</a>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#mission" className="hover:text-white transition">Mission</a>
          <a href="#about-byteverse" className="hover:text-white transition">ByteVerse</a>
          <a href="/seed" className="hover:text-white transition">Seed</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
          <a href="#contact" className="px-4 py-2 rounded-full bg-white text-black font-medium hover:opacity-90 transition">Connect</a>
        </nav>
      </div>
    </header>
  )
}
