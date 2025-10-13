# ByteVerse GitHub Pages Deployment Guide

## 🚀 Quick Setup Steps

### 1. GitHub Repository Setup
1. Push your code to GitHub (if not already done)
2. Go to your repository settings
3. Navigate to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"

### 2. Domain Configuration (GoDaddy)
1. Log into your GoDaddy account
2. Go to your domain management for `byteVerse.app`
3. Add these DNS records:
   - **Type**: A
   - **Name**: @
   - **Value**: 185.199.108.153
   - **TTL**: 600

   - **Type**: A
   - **Name**: @
   - **Value**: 185.199.109.153
   - **TTL**: 600

   - **Type**: A
   - **Name**: @
   - **Value**: 185.199.110.153
   - **TTL**: 600

   - **Type**: A
   - **Name**: @
   - **Value**: 185.199.111.153
   - **TTL**: 600

   - **Type**: CNAME
   - **Name**: www
   - **Value**: yourusername.github.io
   - **TTL**: 600

### 3. GitHub Pages Settings
1. In your repository, go to Settings → Pages
2. Under "Custom domain", enter: `byteVerse.app`
3. Check "Enforce HTTPS" (available after initial deployment)

### 4. Automatic Deployment
The GitHub Actions workflow will automatically:
- Build your React app
- Deploy to GitHub Pages
- Configure the custom domain

## 🔧 Manual Deployment (if needed)
```bash
npm install
npm run build
npm run deploy
```

## 📝 Important Notes
- The CNAME file is already configured for `byteVerse.app`
- DNS changes may take 24-48 hours to propagate
- Your site will be available at both `byteVerse.app` and `www.byteVerse.app`
- HTTPS will be automatically enabled by GitHub Pages

## 🐛 Troubleshooting
- If the domain doesn't work immediately, wait for DNS propagation
- Check GitHub Pages settings to ensure the custom domain is properly configured
- Verify DNS records are correctly set in GoDaddy
- Ensure the CNAME file contains exactly `byteVerse.app`

## 🎉 Success!
Once everything is set up, your ByteVerse app will be live at `https://byteVerse.app`!
