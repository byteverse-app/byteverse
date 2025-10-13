import React from 'react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
      <div className="container-narrow py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/images/ByteVerse-Brand-Pack/ByteVerse/transparent/ByteVerse_transparent_512.png" 
            alt="ByteVerse Logo" 
            className="w-7 h-7"
          />
          <span className="font-semibold tracking-tight">ByteVerse</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href="#features" className="hover:underline">Overview</a>
          <a href="/seed" className="hover:underline">Seed</a>
          <a href="#faq" className="hover:underline">FAQ</a>
        </nav>
      </div>
    </header>
  )
}
