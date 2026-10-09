import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useLanguage } from '@/hooks/useLanguage';
import { i18n } from '@/i18n';

describe('useLanguage', () => {
  it('reports the current language', () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('tr');
  });

  it('changes the language and remembers it', async () => {
    const { result } = renderHook(() => useLanguage());

    await act(async () => {
      result.current.setLanguage('en');
      await Promise.resolve();
    });

    expect(i18n.language).toBe('en');
    expect(result.current.language).toBe('en');
    expect(localStorage.getItem('inv-lang')).toBe('en');
  });

  it('falls back to the default language for an unsupported one', async () => {
    await i18n.changeLanguage('de');
    const { result } = renderHook(() => useLanguage());

    expect(result.current.language).toBe('tr');
  });
});
