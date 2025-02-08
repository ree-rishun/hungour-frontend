import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/variables.scss";`
      }
    }
  },
  define: {
    'import.meta.env.VITE_API_URL': 'window.__ENV__.VITE_API_URL',
    'import.meta.env.VITE_LIFF_ID': 'window.__ENV__.VITE_LIFF_ID',
  },
  server: {
    port: 8080
  }
})
