import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyTheme, readStoredTheme, storeTheme } from '@/theme/applyTheme';
import { getThemeTokens } from '@/theme/themes';

describe('applyTheme', () => {
  it('writes the theme name, color scheme and every token on <html>', () => {
    applyTheme('dark');

    const root = document.documentElement;
    expect(root.dataset.theme).toBe('dark');
    expect(root.style.colorScheme).toBe('dark');
    expect(root.style.getPropertyValue('--primary')).toBe(
      getThemeTokens('dark').primary,
    );
    expect(root.style.getPropertyValue('--nav-active-bg')).toBe(
      getThemeTokens('dark')['nav-active-bg'],
    );
  });
});

describe('theme storage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to the default theme when nothing valid is stored', () => {
    expect(readStoredTheme()).toBe('default');
    localStorage.setItem('inv-theme', 'sepia');
    expect(readStoredTheme()).toBe('default');
  });

  it('remembers the stored theme', () => {
    storeTheme('light');
    expect(readStoredTheme()).toBe('light');
  });

  it('survives unavailable storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readStoredTheme()).toBe('default');
    expect(() => storeTheme('dark')).not.toThrow();
  });
});
