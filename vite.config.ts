import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages project site: https://<user>.github.io/modus-prototype-setup-prompt/
  base: process.env.BASE_PATH ?? '/',
})
