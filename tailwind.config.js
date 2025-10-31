/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#FFFFFF',
        muted: '#A0A0A0',
        panel: 'rgba(255,255,255,0.02)',
        accent: '#5B63FF',
        accent2: '#6CF3B2',
        ok: '#0EB97D',
        nimbus: {
          bg: '#0A0A0A',
          card: '#0E0E10',
          border: '#1C1C1F',
          accent: '#D1D1D6'
        }
      },
      fontFamily: { 
        ui: ['Inter', 'system-ui', 'sans-serif'] 
      },
      borderRadius: { 
        lg: '1.25rem', 
        md: '.75rem', 
        sm: '.5rem' 
      },
      boxShadow: { 
        card: '0 10px 20px rgba(10,12,38,.08)' 
      },
      dropShadow: {
        'glow': ['0 0 30px rgba(255,255,255,0.15)']
      }
    }
  },
  plugins: []
}