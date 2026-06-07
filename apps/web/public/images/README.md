# ByteVerse Images Directory

This directory contains all the images, logos, and visual assets for the ByteVerse website.

## Folder Structure

```
public/images/
├── brand/
│   └── wordmark/
│       ├── byteverse-white.png   # Stacked BYTE/verse lockup (dark backgrounds)
│       └── byteverse-black.png   # Stacked BYTE/verse lockup (light backgrounds)
├── email/
│   └── byteverse-wordmark-dark.png  # Copy of byteverse-white for auth emails
├── icons/          # B letter mark and UI graphics
│   ├── ByteB_black.png      # ByteLetter icon (black, light backgrounds)
│   ├── ByteB_white.png      # ByteLetter icon (white, dark backgrounds)
│   ├── bytefooter.png       # Footer/contact icon
│   ├── byterow_black.png    # LinkedIn icon (black)
│   ├── byterow_white.png    # LinkedIn icon (white)
│   ├── bytesquare_black.png # GitHub icon (black)
│   └── bytesquare_white.png # GitHub icon (white)
├── ByteVerse-Brand-Pack/    # Complete brand asset collection
├── hero/           # Hero section images and banners
├── avatars/        # Profile pictures and avatars
└── README.md       # This file
```

## Typography

- **BYTE** in wordmarks uses **Blou W90 Black** (see `app/fonts/Blou-LICENSE.txt` for CC BY 4.0 attribution).
- **verse** uses Times New Roman MT with outline (baked into wordmark PNGs).

## Usage in Components

### Full wordmark (hero) vs B icon (nav, auth header)
```jsx
import ByteVerseWordmark from '@/components/marketing/ByteVerseWordmark';

<ByteVerseWordmark size="hero" theme="dark" animated />
<ByteVerseWordmark size="nav" theme="dark" asLink />
```

Nav uses `ByteB_*.png`; hero uses trimmed `brand/wordmark/byteverse-*.png`.
After replacing wordmark sources, run `node scripts/crop-wordmarks.mjs`.

### B letter icon (favicon, compact marks)
```jsx
<img src="/images/icons/ByteB_white.png" alt="ByteVerse" className="h-7 w-7" />
```

### Social Media Icons
```jsx
<img src="/images/icons/byterow_black.png" alt="LinkedIn" className="w-4 h-4" />
<img src="/images/icons/bytesquare_black.png" alt="GitHub" className="w-4 h-4" />
<img src="/images/icons/bytefooter.png" alt="Contact" className="w-4 h-4" />
```

## Image Guidelines

- **Format**: Use PNG for brand lockups and icons; SVG for scalable UI graphics
- **Wordmarks**: Prefer committed PNGs over live CSS text for pixel-perfect BYTE/verse styling
- **Color variants**: `byteverse-white` / `ByteB_white` on dark backgrounds; black variants on light backgrounds
- **Email logo**: Run `node scripts/generate-email-logo.mjs` after updating `brand/wordmark/byteverse-white.png`
