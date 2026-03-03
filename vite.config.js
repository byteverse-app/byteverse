import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// NOTE: If deploying to GitHub Pages under a repo like /ByteVerse,
// set base: '/ByteVerse/' below. If using a custom domain, keep base: '/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      'three/addons': 'three/examples/jsm'
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          ogl: ['ogl']
        }
      }
    }
  }
})