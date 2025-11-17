import React, { useEffect, useRef, useState } from 'react'

export default function Error503Overlay() {
  // Toggle the overlay: Set to true to show, false to hide
  // You can also use environment variable: VITE_SHOW_503_OVERLAY=true
  const ENABLE_503_OVERLAY = true // Change this to false to disable
  
  const showOverlay = ENABLE_503_OVERLAY || import.meta.env.VITE_SHOW_503_OVERLAY === 'true'
  const overlayRef = useRef(null)
  const [forceRender, setForceRender] = useState(0)

  useEffect(() => {
    if (!showOverlay) return

    let observer = null
    let interval = null

    // Small delay to ensure ref is set
    const timeoutId = setTimeout(() => {
      // Prevent interaction with underlying content
      document.body.style.pointerEvents = 'none'
      const overlayElement = overlayRef.current
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'auto'
      }

      // Monitor if overlay is removed from DOM
      const checkOverlay = () => {
        const currentElement = overlayRef.current
        if (currentElement && !document.body.contains(currentElement)) {
          // Overlay was removed, force re-render
          setForceRender(prev => prev + 1)
        }
      }

      // Use MutationObserver to watch for removal
      observer = new MutationObserver((mutations) => {
        const currentElement = overlayRef.current
        if (!currentElement) {
          setForceRender(prev => prev + 1)
          return
        }
        
        mutations.forEach((mutation) => {
          mutation.removedNodes.forEach((node) => {
            if (node === currentElement || (node.contains && node.contains(currentElement))) {
              setForceRender(prev => prev + 1)
            }
          })
        })
        checkOverlay()
      })

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      // Also check periodically as a backup
      interval = setInterval(checkOverlay, 100)
    }, 10)

    return () => {
      clearTimeout(timeoutId)
      if (observer) observer.disconnect()
      if (interval) clearInterval(interval)
      document.body.style.pointerEvents = ''
    }
  }, [showOverlay, forceRender])

  if (!showOverlay) {
    return null
  }

  return (
    <div 
      key={`error-503-overlay-${forceRender}`}
      ref={overlayRef}
      data-error-503-overlay="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="text-center px-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-2">503</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-4">
            Oops! We're Taking a Quick Break
          </h2>
        </div>
        <div className="space-y-4 text-white/80">
          <p className="text-lg md:text-xl max-w-md mx-auto">
            Our servers decided to take a coffee break ☕ (or maybe they're just being dramatic). 
            We're working on getting everything back to normal!
          </p>
          <div className="pt-4 space-y-3">
            <p className="text-base md:text-lg text-white/90">
              Need to reach us?
            </p>
            <div className="flex flex-col items-center gap-2">
              <a 
                href="mailto:missioncontrol@byteverse.app" 
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/50 hover:decoration-blue-300"
              >
                missioncontrol@byteverse.app
              </a>
              <p className="text-sm text-white/60">or</p>
              <p className="text-sm text-white/70">
                Want to chat with the Founder?
              </p>
              <a 
                href="mailto:connect@dhanikeshkarunanithi.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-400/50 hover:decoration-blue-300"
              >
                connect@dhanikeshkarunanithi.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

