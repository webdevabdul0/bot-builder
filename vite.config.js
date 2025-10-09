import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allow external access (not just localhost)
    port: 5173, // your app port
    allowedHosts: ['builder.flossly.ai', 'n8n.flossly.ai'], // ✅ allow your domains
  },
})
