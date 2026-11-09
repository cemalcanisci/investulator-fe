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
  build: {
    rolldownOptions: {
      output: {
        // Keep growing static research data below the import parser's memory limit.
        codeSplitting: {
          groups: [
            {
              name: 'research-data',
              test: /[/\\]src[/\\]data[/\\]research[/\\].*\.json$/,
              maxSize: 500_000,
            },
            {
              name: 'translations',
              test: /[/\\]src[/\\]i18n[/\\]locales[/\\].*\.json$/,
            },
          ],
        },
      },
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
    // These files round-trip real XLSX/ZIP/crypto work against a local fixture file and a
    // mocked `fetch` (no real network call in any of them) — deterministic, but CPU-heavy
    // enough that the slowest case alone used to take ~54s under v8 coverage instrumentation.
    // Fixed at the source rather than by raising the timeout: the full 10-company export was
    // split into its own file and scoped to export just the one company under test (see
    // externalResearchWorkbookRoundTrip.test.ts), and ResearchTransferUrlImport.test.tsx's
    // upload/URL-load cases were split apart and stopped re-reading their own exported buffer
    // (that round-trip is already independently covered) — each case now finishes within a few
    // seconds, comfortably inside the 30s cap, even under coverage. Isolated to its own
    // single-threaded project so these files never contend with the ~95 fast unit files either.
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            'src/__tests__/lib/externalResearchWorkbook.test.ts',
            'src/__tests__/lib/externalResearchWorkbookRoundTrip.test.ts',
            'src/__tests__/components/ResearchTransferUrlImport.test.tsx',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          include: [
            'src/__tests__/lib/externalResearchWorkbook.test.ts',
            'src/__tests__/lib/externalResearchWorkbookRoundTrip.test.ts',
            'src/__tests__/components/ResearchTransferUrlImport.test.tsx',
          ],
          testTimeout: 30000,
          pool: 'threads',
          maxWorkers: 1,
          minWorkers: 1,
        },
      },
    ],
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
