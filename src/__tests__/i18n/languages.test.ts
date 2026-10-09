import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  LANGUAGES,
  isSupportedLanguage,
  readStoredLanguage,
  storeLanguage,
} from '@/i18n/languages';

describe('languages', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('supports Turkish and English', () => {
    expect(LANGUAGES).toEqual(['tr', 'en']);
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('de')).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });

  it('defaults to Turkish and remembers the stored language', () => {
    expect(readStoredLanguage()).toBe('tr');
    storeLanguage('en');
    expect(readStoredLanguage()).toBe('en');
    localStorage.setItem('inv-lang', 'de');
    expect(readStoredLanguage()).toBe('tr');
  });

  it('survives unavailable storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    expect(readStoredLanguage()).toBe('tr');
    expect(() => storeLanguage('en')).not.toThrow();
  });
});
