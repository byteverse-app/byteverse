# ByteVerse — AI-Powered Ecosystem Overview

Apple‑inspired, product‑grade SaaS landing page for **ByteVerse**. Built with **React + Vite**, **Tailwind**, and a premium‑feeling **Gradient Blinds** GLSL background (via `ogl`).

> Part of the ByteVerse family. Keep branding/system consistent across repos.

---

## ✨ Features

- Polished Apple‑style hero with animated gradient blinds background
- Clean sections: Features, Pricing, FAQ, Waitlist (Formspree-ready)
- Accessible, responsive, and fast (Vite + Tailwind)
- Zero backend needed; deploy on **GitHub Pages** for free
- GitHub Actions workflow included
- No secrets hardcoded — `.env.example` provided

---

## 🧱 Tech

- **React 18** + **Vite**
- **Tailwind CSS 3**
- **ogl** (WebGL) for background shader
- Optional **Formspree** for waitlist

---

## 🚀 Quickstart

```bash
# 1) Unzip and enter
npm install

# 2) (Optional) copy env
cp .env.example .env
# set VITE_FORMSPREE_ID=your_form_id

# 3) Dev
npm run dev  # open http://localhost:5173

# 4) Build
npm run build
npm run preview
```

---

## 🌐 Deploy (GitHub Pages)

1. Create a new **public** repo named `ByteVerse` (or your choice).
2. Push this project.
3. In repo **Settings → Pages → Build and deployment**, set **Source: GitHub Actions**.
4. Commit to `main` and the included workflow deploys automatically.

### If your site is under a subpath (e.g. `/ByteVerse/`)

- Add a repo/action variable under **Settings → Secrets and variables → Actions → Variables**:
  - `VITE_BASE_PATH` = `/ByteVerse/`
- The workflow passes it at build time.

### Custom domain

If using `dhanikeshkarunanithi.com` or subdomain, keep `VITE_BASE_PATH` unset (defaults to `/`). Configure DNS to Pages.

---

## 🧩 Reusing the Gradient Background

Use the component anywhere:

```jsx
import GradientBlinds from './components/GradientBlinds'

<GradientBlinds
  gradientColors={['#F5F5F7', '#7D7DFF', '#5227FF']}
  angle={12}
  noise={0.20}
  blindCount={18}
  blindMinWidth={44}
  spotlightRadius={0.6}
  spotlightSoftness={1.4}
  spotlightOpacity={0.9}
  mouseDampening={0.2}
  distortAmount={0.5}
  shineDirection="left"
  mixBlendMode="screen"
/>
```

**Note**: This component depends on `ogl` and is adapted for local use.

---

## 🧭 Repo structure

```
.
├── .github/workflows/deploy.yml
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CTA.jsx
│   │   ├── FAQ.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── GradientBlinds.css
│   │   ├── GradientBlinds.jsx
│   │   ├── Header.jsx
│   │   └── Hero.jsx
│   ├── styles/global.css
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

## 🔮 Roadmap hooks (ByteVerse consistency)

- Add **ByteAnalytics** badge to footer once analytics is ready (e.g. Plausible/Umami)
- Replace hero **video** with real demo (Loom, MP4)
- Add **/docs** with design system tokens used across ByteVerse
- Create shared GitHub Issue templates + project board

---

## 🙏 Credits & License

- Gradient shader concept inspired by: reactbits.dev (Gradient Blinds)
- This template is provided under MIT. Verify third‑party licenses before commercial use.
