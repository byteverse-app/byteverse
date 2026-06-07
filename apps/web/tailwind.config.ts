import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg1: "var(--bg1)",
        bg2: "var(--bg2)",
        bg3: "var(--bg3)",
        bg4: "var(--bg4)",
        bgInverse: "var(--bgInverse)",
        bgInverse2: "var(--bgInverse2)",
        border: "var(--border)",
        accent1: "var(--accent1)",
        accent2: "var(--accent2)",
        brand: {
          primary: "var(--brand-primary)",
          deep: "var(--brand-deep)",
          export: "var(--brand-export)",
        },
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
        space: ["var(--font-space)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
