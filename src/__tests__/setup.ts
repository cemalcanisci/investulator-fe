import { cloneElement, type ReactElement } from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { i18n } from '@/i18n';
import { resetTransactions } from '@/services/transactions';

// jsdom has no ResizeObserver; antd components (Segmented, Select, ...) use it to measure themselves.
class ResizeObserverStub {
  observe(): void {
    // no-op: tests never rely on resize callbacks firing
  }
  unobserve(): void {
    // no-op: nothing is observed, so nothing to stop observing
  }
  disconnect(): void {
    // no-op: no observations or callbacks to tear down
  }
}

globalThis.ResizeObserver ??= ResizeObserverStub;

// jsdom has no matchMedia; antd's responsive helpers use it internally.
window.matchMedia ??= (query: string): MediaQueryList =>
  // The listener methods are deliberately simplified; nothing here fires them.
  // oxlint-disable-next-line typescript/consistent-type-assertions
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;

// Theme and language are persisted in localStorage and on <html>; reset them between tests.
afterEach(async () => {
  cleanup();
  resetTransactions();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('style');
  await i18n.changeLanguage('tr');
});

// jsdom has no layout, so Recharts' ResponsiveContainer would measure 0x0 and draw nothing.
// Give its chart child a fixed size so the SVG is rendered and can be asserted on.
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>();
  return {
    ...actual,
    ResponsiveContainer: ({
      children,
    }: {
      readonly children: ReactElement<{ width?: number; height?: number }>;
    }): ReactElement => cloneElement(children, { width: 600, height: 280 }),
  };
});
