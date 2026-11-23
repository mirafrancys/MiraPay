
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

const dir = dirname(fileURLToPath(import.meta.url));
const rootDir = dir.replace(/^[a-z]:/, (m) => m.toUpperCase());

export default defineConfig({
  root: rootDir,
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
  },
});
