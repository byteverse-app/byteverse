import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="container-narrow py-12 text-sm text-white/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <p>&copy; <span id="year">{new Date().getFullYear()}</span> ByteVerse. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:Conect@dhanikeshkarunanithi.com" className="hover:text-white">Contact</a>
          <a href="https://www.linkedin.com/in/dhanikesh-karunanithi/" target="_blank" rel="noreferrer" className="hover:text-white">LinkedIn</a>
          <a href="https://github.com/lorddannykay" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          <a href="#privacy" className="hover:text-white">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
