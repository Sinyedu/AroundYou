import { fileURLToPath } from 'node:url'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'e2e/**'],
    root: fileURLToPath(new URL('./', import.meta.url)),

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'e2e/', 'dist/', '**/*.d.ts'],
    },
  },
})
