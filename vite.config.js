import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// In dev, the React app (vite, :5173) proxies API + upload requests to the backend (:8787).
// In production, the backend serves the built app from ./dist itself — one process, one URL.
const api = process.env.VITE_API_PROXY || 'http://localhost:8787'

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: { proxy: { '/api': api, '/uploads': api } },
})
