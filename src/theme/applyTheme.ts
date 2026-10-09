import {
  COLOR_SCHEME,
  DEFAULT_THEME,
  getThemeTokens,
  isThemeName,
  type ThemeName,
} from '@/theme/themes';

const STORAGE_KEY = 'inv-theme';

export function readStoredTheme(): ThemeName {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isThemeName(stored) ? stored : DEFAULT_THEME;
  } catch {
    // Storage can be unavailable (private mode, blocked site data); use the default theme.
    return DEFAULT_THEME;
  }
}

export function storeTheme(theme: ThemeName): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Remembering the choice is a convenience only.
  }
}

/** Writes every token of the theme as a CSS variable on `<html>`, which Tailwind utilities read. */
export function applyTheme(theme: ThemeName): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = COLOR_SCHEME[theme];
  for (const [name, value] of Object.entries(getThemeTokens(theme))) {
    root.style.setProperty(`--${name}`, value);
  }
}
