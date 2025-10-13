# Contact Form Setup Guide

## Option 1: EmailJS (Recommended)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Create a new service (Gmail, Outlook, etc.)

### Step 2: Create Email Template
1. In EmailJS dashboard, go to "Email Templates"
2. Create a new template with these variables:
   - `{{from_email}}` - sender's email
   - `{{subject}}` - email subject
   - `{{message}}` - email message
   - `{{to_email}}` - your email (connect@dhanikeshkarunanithi.com)

### Step 3: Get Your Credentials
1. Service ID: Found in "Email Services" section
2. Template ID: Found in "Email Templates" section  
3. Public Key: Found in "Account" section

### Step 4: Update Contact.jsx
Replace these lines in `src/components/Contact.jsx`:
```javascript
const serviceId = 'service_your_service_id' // Replace with your EmailJS service ID
const templateId = 'template_your_template_id' // Replace with your EmailJS template ID
const publicKey = 'your_public_key' // Replace with your EmailJS public key
```

## Option 2: Formspree (Easier Alternative)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Sign up for a free account
3. Create a new form
4. Get your form endpoint URL

### Step 2: Update Contact.jsx
Replace the EmailJS implementation with Formspree:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)
  setSubmitStatus(null)

  try {
    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        subject: subject,
        message: message,
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
```

## Option 3: Netlify Forms (If Deploying to Netlify)

Add `data-netlify="true"` to the form element and use Netlify's built-in form handling.

## Testing
1. Fill out the form
2. Submit and check for success/error messages
3. Check your email inbox for the message

## Troubleshooting
- Make sure all credentials are correct
- Check browser console for errors
- Verify email service is properly configured
- Test with different email addresses
