import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

const isTest = process.env.VITEST === 'true'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),

    //Skips tailwind in testing
    !isTest && tailwindcss(),
  ].filter(Boolean),

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
