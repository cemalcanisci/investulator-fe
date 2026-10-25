import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { researchStore } from './dev/researchStore.ts';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    ...(mode === 'test' ? [] : [researchStore()]),
    tailwindcss(),
    react(),
    // The React Compiler is off under Vitest: it injects memoization-cache
    // branches that a single render never takes, which would skew branch
    // coverage away from the branches in our own source.
    ...(mode === 'test' ? [] : [babel({ presets: [reactCompilerPreset()] })]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // The frontend always calls the same-origin `/api`; in production a reverse
    // proxy does what this does in dev, so no CORS setup is needed anywhere.
    proxy: {
      '/api': 'http://localhost:8081',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/__tests__/**',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
}));
