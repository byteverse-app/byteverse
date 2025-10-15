import React, { useState } from 'react'
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
        },
        body: JSON.stringify({
          ...userData,
          type: 'waitlist_signup',
          _subject: 'New ByteNimbus Waitlist Signup',
          _replyto: email,
        }),
      })

      if (response.ok) {
        // Send welcome email to user
        await emailService.sendWelcomeEmail(userData)
        
        // Send admin notification
        await emailService.sendAdminNotification(userData)
        
        setSubmitStatus('success')
        setEmail('')
        setName('')
        setCompany('')
        setShowDetails(false)
      } else {
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
    <section id="waitlist" className="container-narrow py-20">
      <div className="nimbus-card p-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Transform Your Learning Design</h2>
        <p className="mt-2 text-white/70">Join the waitlist and be among the first to experience the complete ByteVerse ecosystem.</p>
        
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
              Please try again or contact us directly at connect@dhanikeshkarunanithi.com
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
                className="px-4 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-72 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button 
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-90 transition hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
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
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-48 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company (optional)"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 w-48 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="mt-3 text-xs text-white/50">
          We'll only email for launch updates and ByteVerse ecosystem news. No spam, ever.
        </p>
      </div>
    </section>
  )
}