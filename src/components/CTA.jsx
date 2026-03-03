import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { emailService } from '../services/emailService'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    const userData = {
      email: email,
      name: name || 'Not provided',
      company: company || 'Not provided',
      signupDate: new Date().toISOString()
    }

    try {
      // Send to Formspree for data collection
      const response = await fetch('https://formspree.io/f/xpwypvng', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name || 'Not provided',
          company: company || 'Not provided',
          type: 'waitlist_signup',
          _subject: 'New ByteVerse Waitlist Signup',
          _replyto: email,
          message: `Waitlist signup from ${name || 'Anonymous'}. Company: ${company || 'Not provided'}. Signup date: ${new Date().toISOString()}`,
        }),
      })

      const responseData = await response.json().catch(() => ({}))
      
      // Formspree returns 200 OK on success, or 200 with errors field
      if (response.ok && !responseData.errors) {
        setSubmitStatus('success')
        setEmail('')
        setName('')
        setCompany('')
        setShowDetails(false)
        
        // Try to send welcome email (non-blocking, don't wait for it)
        emailService.sendWelcomeEmail(userData).catch(err => {
          console.log('Welcome email optional:', err)
        })
        
        // Try to send admin notification (non-blocking, don't wait for it)
        emailService.sendAdminNotification(userData).catch(err => {
          console.log('Admin notification optional:', err)
        })
      } else {
        console.error('Formspree error:', responseData)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error joining waitlist:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="waitlist" className="py-32 md:py-40 px-4 md:px-6 max-w-7xl mx-auto">
      <div className="apple-glass p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#7D7DFF]/10 blur-[150px] rounded-full" />
        <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="font-space text-[10px] font-bold tracking-[0.5em] text-[#7D7DFF] uppercase mb-6"
        >
          Join the Journey
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-syne text-4xl md:text-6xl font-extrabold tracking-tighter mb-6 text-white"
        >
          Get Early Access
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-space text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-light leading-relaxed"
        >
          Join the waitlist and be among the first to experience the complete ByteVerse ecosystem — or explore the platform on GitHub today.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mb-12"
        >
          <a 
            href="https://github.com/lorddannykay/ByteOS" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-syne font-bold hover:bg-white/10 transition-all duration-300"
          >
            View on GitHub
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
          </a>
        </motion.div>
        
        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mt-6 p-6 rounded-xl bg-green-500/20 border border-green-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h3 className="text-green-400 font-semibold text-lg">Welcome to the ByteVerse Waitlist!</h3>
            </div>
            <p className="text-green-300 text-sm">
              You'll receive a confirmation email shortly. We'll notify you as soon as the ByteVerse ecosystem is ready for you to explore!
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mt-6 p-6 rounded-xl bg-red-500/20 border border-red-500/30">
            <div className="flex items-center justify-center gap-2 mb-2">
              <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <h3 className="text-red-400 font-semibold text-lg">Something went wrong</h3>
            </div>
            <p className="text-red-300 text-sm">
              Please try again or contact us directly at missioncontrol@byteverse.app
            </p>
          </div>
        )}

        {/* Waitlist Form */}
        {submitStatus !== 'success' && (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col md:flex-row items-center gap-3 justify-center mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={isSubmitting}
                className="px-6 py-4 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-full md:w-80 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed font-space"
              />
              <button 
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-8 py-4 rounded-full bg-white text-black font-syne font-bold hover:bg-[#7D7DFF] hover:text-white transition-all duration-500 hover:scale-105 transform shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    Joining...
                  </>
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </div>

            {/* Optional Details */}
            {!showDetails && (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="text-sm text-white/60 hover:text-white/80 transition underline"
              >
                Add optional details (name, company)
              </button>
            )}

            {showDetails && (
              <div className="mt-4 flex flex-col md:flex-row items-center gap-3 justify-center">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-full md:w-48 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed font-space text-sm"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company (optional)"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-full md:w-48 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed font-space text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="text-sm text-white/60 hover:text-white/80 transition"
                >
                  Hide details
                </button>
              </div>
            )}
          </form>
        )}

        <p className="mt-6 text-sm text-white/50 font-space">
          We'll only email for launch updates and ByteVerse ecosystem news. No spam, ever.
        </p>
        </div>
      </div>
    </section>
  )
}