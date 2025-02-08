import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Entropy-Softworks.github.io/',
  plugins: [react()],
})
