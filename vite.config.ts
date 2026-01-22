import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/preet_portfolio/' : '/',
  publicDir: 'public',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    copyPublicDir: true,
  },
  optimizeDeps: {
    exclude: ['latex.js'],
  },
  assetsInclude: ['**/*.keep'],
})
