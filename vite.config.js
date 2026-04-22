import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d32neyt9p9wyaf.cloudfront.net',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})