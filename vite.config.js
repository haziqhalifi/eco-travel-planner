import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
      autoprefixer()
  ],
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
            // '/api': 'http://localhost:5000',
            // changeOrigin: true,
            // secure: false,
        },
    },
})
