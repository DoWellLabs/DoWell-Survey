import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
  },
  plugins: [react()],
  base: '/DoWell-Survey/',
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true,
    manifest: true,
  },
})
