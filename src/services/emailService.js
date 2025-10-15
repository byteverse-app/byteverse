// Email Service for ByteNimbus Waitlist
// This service handles all email notifications for the waitlist system

export class EmailService {
  constructor() {
    this.formspreeEndpoint = 'https://formspree.io/f/xpwypvng'
  }

  // Send welcome email to user when they join waitlist
  async sendWelcomeEmail(userData) {
    const emailData = {
      to: userData.email,
      subject: 'Welcome to ByteNimbus Waitlist! 🚀',
      template: 'welcome',
      userData: userData,
      _replyto: 'connect@dhanikeshkarunanithi.com'
    }

    return this.sendEmail(emailData)
  }

  // Send access granted email to user
  async sendAccessGrantedEmail(userData) {
    const emailData = {
      to: userData.email,
      subject: '🎉 ByteNimbus Access Granted - You\'re In!',
      template: 'access_granted',
      userData: userData,
      _replyto: 'connect@dhanikeshkarunanithi.com'
    }

    return this.sendEmail(emailData)
  }

  // Send admin notification when someone joins waitlist
  async sendAdminNotification(userData) {
    const emailData = {
      to: 'connect@dhanikeshkarunanithi.com',
      subject: 'New ByteNimbus Waitlist Signup',
      template: 'admin_notification',
      userData: userData,
      _replyto: userData.email
    }

    return this.sendEmail(emailData)
  }

  // Send custom message to user
  async sendCustomMessage(userData, message) {
    const emailData = {
      to: userData.email,
      subject: 'Message from ByteNimbus Team',
      template: 'custom_message',
      userData: userData,
      customMessage: message,
      _replyto: 'connect@dhanikeshkarunanithi.com'
    }

    return this.sendEmail(emailData)
  }

  // Generic email sending method
  async sendEmail(emailData) {
    try {
      const response = await fetch(this.formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...emailData,
          type: 'email_notification',
          timestamp: new Date().toISOString()
        }),
      })

      if (response.ok) {
        return { success: true, message: 'Email sent successfully' }
      } else {
        throw new Error(`Email sending failed: ${response.status}`)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return { success: false, message: error.message }
    }
  }
}

// Email templates
export const emailTemplates = {
  welcome: (userData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0;">Welcome to ByteNimbus! 🚀</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0;">You're now on the waitlist for the future of AI-powered learning design.</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: white; margin-top: 0;">What happens next?</h2>
        <ul style="color: rgba(255,255,255,0.9); line-height: 1.6;">
          <li>We'll notify you as soon as ByteNimbus is ready for you to try</li>
          <li>You'll get early access to new features and updates</li>
          <li>We'll share insights about the future of learning technology</li>
        </ul>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="color: white; margin-top: 0;">What is ByteNimbus?</h3>
        <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
          ByteNimbus is an AI-powered platform that transforms how you create learning content. 
          Following the ADDIE framework and Bloom's Taxonomy, it generates complete microlearning 
          modules from any topic you provide.
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">
          Questions? Reply to this email or reach out at 
          <a href="mailto:connect@dhanikeshkarunanithi.com" style="color: white;">connect@dhanikeshkarunanithi.com</a>
        </p>
        <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin-top: 20px;">
          You're receiving this because you joined the ByteNimbus waitlist.
        </p>
      </div>
    </div>
  `,

  access_granted: (userData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0;">🎉 You're In! ByteNimbus Access Granted</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0;">Welcome to the future of AI-powered learning design!</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: white; margin-top: 0;">Your ByteNimbus Access</h2>
        <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
          Congratulations! You now have access to ByteNimbus. Here's what you can do:
        </p>
        <ul style="color: rgba(255,255,255,0.9); line-height: 1.6;">
          <li>Generate complete microlearning modules from any topic</li>
          <li>Export content in SCORM/xAPI formats</li>
          <li>Collaborate with your team (coming soon)</li>
          <li>Access advanced AI features</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bytenimbus.com" style="background: white; color: #4facfe; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Start Using ByteNimbus
        </a>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h3 style="color: white; margin-top: 0;">Need Help Getting Started?</h3>
        <p style="color: rgba(255,255,255,0.9); line-height: 1.6;">
          Check out our documentation or reach out if you have any questions. 
          We're here to help you create amazing learning experiences!
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">
          Questions? Reply to this email or reach out at 
          <a href="mailto:connect@dhanikeshkarunanithi.com" style="color: white;">connect@dhanikeshkarunanithi.com</a>
        </p>
      </div>
    </div>
  `,

  admin_notification: (userData) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4facfe; margin: 0;">New ByteNimbus Waitlist Signup</h1>
        <p style="color: #ccc; margin: 10px 0;">Someone just joined the waitlist!</p>
      </div>
      
      <div style="background: #2a2a2a; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: white; margin-top: 0;">User Details</h2>
        <table style="width: 100%; color: #ccc;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;">${userData.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Name:</td>
            <td style="padding: 8px 0;">${userData.name || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Company:</td>
            <td style="padding: 8px 0;">${userData.company || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Signup Date:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://bytenimbus.com/admin" style="background: #4facfe; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Manage Waitlist
        </a>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #999; font-size: 12px;">
          This is an automated notification from the ByteNimbus waitlist system.
        </p>
      </div>
    </div>
  `,

  custom_message: (userData, customMessage) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: white; margin: 0;">Message from ByteNimbus Team</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 10px 0;">Hello ${userData.name || 'there'}!</p>
      </div>
      
      <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h2 style="color: white; margin-top: 0;">Our Message</h2>
        <p style="color: rgba(255,255,255,0.9); line-height: 1.6; white-space: pre-line;">
          ${customMessage}
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: rgba(255,255,255,0.8); font-size: 14px;">
          Questions? Reply to this email or reach out at 
          <a href="mailto:connect@dhanikeshkarunanithi.com" style="color: white;">connect@dhanikeshkarunanithi.com</a>
        </p>
      </div>
    </div>
  `
}

// Export singleton instance
export const emailService = new EmailService()