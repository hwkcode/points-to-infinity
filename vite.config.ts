import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      'spaces-docker-pw-231.dxspda.pw1.bcc.bloomberg.com'
    ]
  }
})
