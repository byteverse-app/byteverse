# ByteNimbus Images Directory

This directory contains all the images, logos, and visual assets for the ByteNimbus website.

## Folder Structure

```
public/images/
├── logos/          # Company logos and brand assets
│   ├── bytenimbus-logo.svg
│   ├── byteverse-logo.svg
│   ├── byteai-logo.svg
│   └── favicon.svg
├── icons/          # UI icons and small graphics
│   ├── email-icon.svg
│   ├── linkedin-icon.svg
│   ├── github-icon.svg
│   └── feature-icons/
├── hero/           # Hero section images and banners
│   ├── hero-background.jpg
│   ├── demo-screenshots/
│   └── product-showcase/
├── avatars/        # Profile pictures and avatars
│   ├── dhani-avatar.jpg
│   └── team-photos/
└── README.md       # This file
```

## Usage in Components

### Logos
```jsx
<img src="/images/logos/bytenimbus-logo.svg" alt="ByteNimbus Logo" />
```

### Icons
```jsx
<img src="/images/icons/email-icon.svg" alt="Email" className="w-5 h-5" />
```

### Hero Images
```jsx
<img src="/images/hero/hero-background.jpg" alt="ByteNimbus Hero" />
```

## Image Guidelines

- **Format**: Use SVG for logos and icons, JPG/PNG for photos
- **Optimization**: Compress images for web performance
- **Alt Text**: Always include descriptive alt text
- **Responsive**: Use appropriate sizes for different screen sizes
- **Branding**: Maintain consistent ByteNimbus/ByteVerse branding

## File Naming Convention

- Use lowercase with hyphens: `byteverse-logo.svg`
- Be descriptive: `hero-background.jpg` not `bg1.jpg`
- Include version if needed: `logo-v2.svg`
- Group related files: `feature-ai.svg`, `feature-analytics.svg`




