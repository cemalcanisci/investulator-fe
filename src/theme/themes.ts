import { THEME_TOKENS } from '@/theme/tokens';

export const THEME_NAMES = ['default', 'light', 'dark'] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

export type TokenName = keyof (typeof THEME_TOKENS)['default'];

export const DEFAULT_THEME: ThemeName = 'default';

export const COLOR_SCHEME: Readonly<Record<ThemeName, 'light' | 'dark'>> = {
  default: 'light',
  light: 'light',
  dark: 'dark',
};

export function isThemeName(value: unknown): value is ThemeName {
  return THEME_NAMES.some((name) => name === value);
}

export function getThemeTokens(
  name: ThemeName,
): Readonly<Record<TokenName, string>> {
  return THEME_TOKENS[name];
}
