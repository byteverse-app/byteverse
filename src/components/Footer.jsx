import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="container-narrow py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <img 
              src="/images/icons/ByteB_white.png" 
              alt="ByteVerse Logo" 
              className="w-8 h-8"
            />
            <div>
              <span className="font-semibold text-white">ByteVerse</span>
              <p className="text-xs text-white/60">AI-Powered Ecosystem</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-white/60">
            <a href="/docs/MasterPlan.md" className="hover:text-white transition">Master Plan</a>
            <a href="#seed" className="hover:text-white transition">Seed</a>
            <a href="/docs/Roadmap.md" className="hover:text-white transition">Roadmap</a>
            <a href="mailto:Conect@dhanikeshkarunanithi.com" className="hover:text-white transition flex items-center gap-2">
              <img src="/images/icons/bytefooter.png" alt="Contact" className="w-4 h-4" />
              Contact
            </a>
            <a href="https://www.linkedin.com/in/dhanikesh-karunanithi/" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-2">
              <img src="/images/icons/byterow_black.png" alt="LinkedIn" className="w-4 h-4" />
              LinkedIn
            </a>
            <a href="https://github.com/lorddannykay" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-2">
              <img src="/images/icons/bytesquare_black.png" alt="GitHub" className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-white/50">
          <p>&copy; <span id="year">{new Date().getFullYear()}</span> ByteVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
