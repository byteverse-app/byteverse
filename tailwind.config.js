/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        ui: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: '#0E0F1A',
        accent: '#5B63FF',
        accent2: '#6CF3B2',
        panel: '#0E0F1A0D',
        nimbus: {
          bg: '#0A0A0A',
          card: '#0E0E10',
          border: '#1C1C1F',
          accent: '#D1D1D6'
        }
      },
      dropShadow: {
        'glow': ['0 0 30px rgba(255,255,255,0.15)']
      },
      boxShadow: {
        card: '0 10px 20px rgba(10,12,38,.08)'
      }
    }
  },
  plugins: []
}