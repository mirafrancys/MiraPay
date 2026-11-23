
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';

const dir = dirname(fileURLToPath(import.meta.url));
const rootDir = dir.replace(/^[a-z]:/, (m) => m.toUpperCase());

const angularPlugins = angular().map((plugin) => {
  if (
    plugin &&
    typeof plugin === 'object' &&
    'name' in plugin &&
    plugin.name === 'analogjs-router-optimization' &&
    'transform' in plugin &&
    plugin.transform &&
    typeof plugin.transform === 'object' &&
    'handler' in plugin.transform
  ) {
    const origHandler = plugin.transform.handler as (
      code: string,
      id: string,
    ) => unknown;
    return {
      ...plugin,
      transform(this: unknown, code: string, id: string) {
        if (id.startsWith('\0') || !/fesm(.*?)\.mjs/.test(id)) return null;
        return origHandler.call(this, code, id);
      },
    };
  }
  return plugin;
});

export default defineConfig({
  root: rootDir,
  plugins: [angularPlugins],
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
