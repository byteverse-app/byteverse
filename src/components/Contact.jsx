import React, { useState } from 'react'

export default function Contact() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Using Formspree - you need to replace 'YOUR_FORM_ID' with your actual Formspree form ID
      // Go to https://formspree.io/ to get your form ID
      const response = await fetch('https://formspree.io/f/xpwypvng', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          subject: subject,
          message: message,
          _replyto: email, // This ensures replies go to the sender
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setEmail('')
        setMessage('')
        setSubject('')
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="container-narrow py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Let's Build the Future of Learning Together
        </h2>
        <p className="text-lg text-white/80 max-w-3xl mx-auto">
          Join the conversation about how technology can transform learning experiences and make education more meaningful for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="nimbus-card p-8">
          <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
          
          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/30">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-400 font-medium">Message sent successfully!</p>
              </div>
              <p className="text-green-300 text-sm mt-1">I'll get back to you soon.</p>
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-400 font-medium">Failed to send message</p>
              </div>
              <p className="text-red-300 text-sm mt-1">Please try again or contact me directly at connect@dhanikeshkarunanithi.com</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 text-white placeholder-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 text-white backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <option value="" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Select a topic</option>
                <option value="Collaboration on ByteNimbus" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Collaboration on ByteNimbus</option>
                <option value="Feedback & Suggestions" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Feedback & Suggestions</option>
                <option value="Future of Learning Discussion" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Future of Learning Discussion</option>
                <option value="Technology in Education" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Technology in Education</option>
                <option value="Partnership Opportunities" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Partnership Opportunities</option>
                <option value="Other" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white' }}>Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isSubmitting}
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 text-white placeholder-white/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Share your thoughts on the future of learning, collaboration ideas, or feedback on ByteNimbus..."
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-3 rounded-xl bg-white text-black font-medium hover:opacity-90 transition hover:scale-105 transform duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>

        {/* Discussion Topics */}
        <div className="space-y-8">
          <div className="nimbus-card p-8">
            <h3 className="text-2xl font-semibold mb-6">Let's Discuss</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">AI-Powered Learning</h4>
                <p className="text-white/70 text-sm">
                  How can we leverage AI to create more personalized and adaptive learning experiences?
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Global Accessibility</h4>
                <p className="text-white/70 text-sm">
                  What technologies can bridge the learning gap between different communities and regions?
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Meaningful Learning</h4>
                <p className="text-white/70 text-sm">
                  How do we design learning experiences that truly engage and transform learners?
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Future of Education</h4>
                <p className="text-white/70 text-sm">
                  What will learning look like in 10 years? How can we prepare for that future?
                </p>
              </div>
            </div>
          </div>

          <div className="nimbus-card p-8">
            <h3 className="text-2xl font-semibold mb-6">Connect with Dhani</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/images/icons/bytefooter.png" alt="Email" className="w-5 h-5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Email</h4>
                  <a 
                    href="mailto:connect@dhanikeshkarunanithi.com" 
                    className="text-white/70 hover:text-white transition text-sm"
                  >
                    connect@dhanikeshkarunanithi.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <img src="/images/icons/byterow_black.png" alt="LinkedIn" className="w-5 h-5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">LinkedIn</h4>
                  <a 
                    href="https://www.linkedin.com/in/dhanikesh-karunanithi/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-white/70 hover:text-white transition text-sm"
                  >
                    linkedin.com/in/dhanikesh-karunanithi/
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <img src="/images/icons/bytesquare_black.png" alt="GitHub" className="w-5 h-5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">GitHub</h4>
                  <a 
                    href="https://github.com/lorddannykay" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-white/70 hover:text-white transition text-sm"
                  >
                    github.com/lorddannykay
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/80">
                <strong>Note:</strong> I tend to procrastinate (who doesn't?), but if you find this project interesting 
                and would love to collaborate, please reach out! Maybe I'll leave my astrophysics rabbit holes and choose to 
                continue building this with you! 🌌
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
