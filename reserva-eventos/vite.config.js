import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/app/', // 👈 esto es lo clave
  plugins: [react()],
})