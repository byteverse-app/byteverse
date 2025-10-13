/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Helvetica Neue','Arial','Noto Sans','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji', 'sans-serif']
      },
      colors: {
        nimbus: {
          bg: '#0A0A0A',
          card: '#0E0E10',
          border: '#1C1C1F',
          accent: '#D1D1D6'
        }
      },
      dropShadow: {
        'glow': ['0 0 30px rgba(255,255,255,0.15)']
      }
    }
  },
  plugins: []
}