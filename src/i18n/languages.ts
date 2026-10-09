export const LANGUAGES = ['tr', 'en'] as const;

export type SupportedLanguage = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'tr';

const STORAGE_KEY = 'inv-lang';

export function isSupportedLanguage(
  value: unknown,
): value is SupportedLanguage {
  return LANGUAGES.some((language) => language === value);
}

export function readStoredLanguage(): SupportedLanguage {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    // Storage can be unavailable (private mode, blocked site data); use the default language.
    return DEFAULT_LANGUAGE;
  }
}

export function storeLanguage(language: SupportedLanguage): void {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Remembering the choice is a convenience only.
  }
}
