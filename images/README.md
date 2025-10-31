# ByteVerse Images Directory

This directory contains all the images, logos, and visual assets for the ByteVerse website.

## Folder Structure

```
public/images/
├── icons/          # Main ByteVerse brand icons and UI graphics
│   ├── ByteB_black.png      # Main ByteVerse logo (black)
│   ├── ByteB_white.png      # Main ByteVerse logo (white)
│   ├── bytefooter.png       # Footer/contact icon
│   ├── byterow_black.png    # LinkedIn icon (black)
│   ├── byterow_white.png    # LinkedIn icon (white)
│   ├── bytesquare_black.png # GitHub icon (black)
│   └── bytesquare_white.png # GitHub icon (white)
├── ByteVerse-Brand-Pack/    # Complete brand asset collection
│   ├── ByteAI/             # ByteAI product logos
│   ├── ByteAnalytics/      # ByteAnalytics product logos
│   ├── ByteGenie/          # ByteGenie product logos
│   ├── ByteHub/            # ByteHub product logos
│   ├── ByteLab/            # ByteLab product logos
│   ├── ByteNimbus/         # ByteNimbus product logos
│   ├── ByteSim/            # ByteSim product logos
│   ├── ByteTok/            # ByteTok product logos
│   └── ByteVerse/          # ByteVerse product logos
├── hero/           # Hero section images and banners
├── avatars/        # Profile pictures and avatars
└── README.md       # This file
```

## Usage in Components

### Main ByteVerse Logo
```jsx
<img src="/images/icons/ByteB_white.png" alt="ByteVerse Logo" className="w-7 h-7" />
```

### Social Media Icons
```jsx
<img src="/images/icons/byterow_black.png" alt="LinkedIn" className="w-4 h-4" />
<img src="/images/icons/bytesquare_black.png" alt="GitHub" className="w-4 h-4" />
<img src="/images/icons/bytefooter.png" alt="Contact" className="w-4 h-4" />
```

### Product Logos
```jsx
<img src="/images/ByteVerse-Brand-Pack/ByteAI/transparent/ByteAI_transparent_512.png" alt="ByteAI Logo" />
```

## Image Guidelines

- **Format**: Use PNG for main brand icons, SVG for scalable graphics, JPG/PNG for photos
- **Optimization**: Compress images for web performance
- **Alt Text**: Always include descriptive alt text
- **Responsive**: Use appropriate sizes for different screen sizes
- **Branding**: Maintain consistent ByteVerse branding across all components
- **Color Variants**: Use white icons on dark backgrounds (current implementation), black icons on light backgrounds

## File Naming Convention

- Use lowercase with hyphens: `byteverse-logo.svg`
- Be descriptive: `hero-background.jpg` not `bg1.jpg`
- Include version if needed: `logo-v2.svg`
- Group related files: `feature-ai.svg`, `feature-analytics.svg`




