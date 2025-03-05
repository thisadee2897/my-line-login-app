import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/line-auth/', 
  plugins: [react()],
})
//comand build project : npm run build