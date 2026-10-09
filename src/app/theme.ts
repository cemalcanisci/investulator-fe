// Single place where antd's theme is derived from the app's design tokens.
// antd computes shades in JS, so it needs concrete colors rather than CSS variables.
import { theme as antdTheme, type ThemeConfig } from 'antd';
import { getThemeTokens, type ThemeName } from '@/theme/themes';

const FONT_FAMILY =
  "'Inter Variable', ui-sans-serif, system-ui, 'Segoe UI', sans-serif";

export function createAntdTheme(name: ThemeName): ThemeConfig {
  const tokens = getThemeTokens(name);

  return {
    algorithm:
      name === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: tokens.primary,
      colorInfo: tokens.info,
      colorSuccess: tokens.pos,
      colorError: tokens.neg,
      colorWarning: tokens['warn-strong'],
      colorBgLayout: tokens.bg,
      colorBgContainer: tokens.surface,
      colorBgElevated: tokens.surface,
      colorText: tokens.text,
      colorTextSecondary: tokens['text-2'],
      colorTextTertiary: tokens['text-3'],
      colorBorder: tokens['border-strong'],
      colorBorderSecondary: tokens.border,
      borderRadius: 8,
      controlHeight: 40,
      fontFamily: FONT_FAMILY,
    },
  };
}
