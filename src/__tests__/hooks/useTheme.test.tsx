import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from '@/hooks/useTheme';
import { ThemeProvider } from '@/theme/ThemeProvider';

function wrapper({ children }: { readonly children: ReactNode }): ReactNode {
  return <ThemeProvider>{children}</ThemeProvider>;
}

describe('useTheme', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the current theme and a setter inside the provider', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('default');
    expect(typeof result.current.setTheme).toBe('function');
  });

  it('fails loudly outside the provider', () => {
    // React logs the thrown error; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
  });
});
