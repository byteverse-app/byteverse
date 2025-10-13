# Quick Setup Guide - Fix Email Error

## The Problem
You're getting "Failed to send message" because the email service isn't configured yet.

## The Solution - Use Formspree (Easiest)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io/](https://formspree.io/)
2. Click "Get Started" or "Sign Up"
3. Create a free account (no credit card required)

### Step 2: Create a New Form
1. Once logged in, click "New Form"
2. Give it a name like "ByteVerse Contact Form"
3. Set the email to: `connect@dhanikeshkarunanithi.com`
4. Click "Create Form"

### Step 3: Get Your Form ID
1. After creating the form, you'll see a form endpoint URL like:
   `https://formspree.io/f/xpzgkqyw`
2. Copy the form ID part (e.g., `xpzgkqyw`)

### Step 4: Update Your Code
1. Open `src/components/Contact.jsx`
2. Find this line:
   ```javascript
   const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```
3. Replace `YOUR_FORM_ID` with your actual form ID:
   ```javascript
   const response = await fetch('https://formspree.io/f/xpzgkqyw', {
   ```

### Step 5: Test the Form
1. Save the file
2. Refresh your website
3. Fill out the contact form
4. Submit it
5. Check your email inbox at `connect@dhanikeshkarunanithi.com`

## Alternative: Use Netlify Forms (If deploying to Netlify)

If you're deploying to Netlify, you can use their built-in form handling:

1. Add `data-netlify="true"` to the form element
2. Add a hidden input with `name="_to"` and `value="connect@dhanikeshkarunanithi.com"`
3. No external service needed!

## Troubleshooting
- Make sure you copied the correct form ID
- Check that your Formspree account is verified
- Try testing with a different email address
- Check the browser console for any error messages

## Need Help?
If you're still having issues, I can help you set up a different email service or debug the problem.
