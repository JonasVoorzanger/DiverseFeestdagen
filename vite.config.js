import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        preprocessOptions: {
          // Enable Pug templating
          plugins: []
        }
      }
    }),
    vuetify({ autoImport: true })
  ],
  // Important for GitHub Pages
  base: '/DiverseFeestdagen/',
  server: {
    // Enable CORS for development
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  build: {
    // Output directory for GitHub Pages
    outDir: 'dist',
    // Ensure CORS headers are set
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
