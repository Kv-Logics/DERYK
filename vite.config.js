import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/chats': 'http://localhost:8000',
    },
    allowedHosts: ['manicotti-muck-unsent.ngrok-free.dev'],
  },
})
