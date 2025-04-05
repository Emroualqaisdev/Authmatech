
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '353b3020-5e3a-4d55-9034-f0fbdb700c05-00-2hh6md6mibx01.pike.replit.dev'
    ]
  }
})
