import { theme as antdTheme } from 'antd';
import { describe, expect, it } from 'vitest';
import { createAntdTheme } from '@/app/theme';
import { THEME_NAMES, getThemeTokens } from '@/theme/themes';

describe('createAntdTheme', () => {
  it('uses the dark algorithm only for the dark theme', () => {
    expect(createAntdTheme('dark').algorithm).toBe(antdTheme.darkAlgorithm);
    expect(createAntdTheme('light').algorithm).toBe(antdTheme.defaultAlgorithm);
    expect(createAntdTheme('default').algorithm).toBe(
      antdTheme.defaultAlgorithm,
    );
  });

  it.each(THEME_NAMES)('takes its colors from the %s tokens', (name) => {
    const tokens = getThemeTokens(name);
    const { token } = createAntdTheme(name);

    expect(token?.colorPrimary).toBe(tokens.primary);
    expect(token?.colorBgContainer).toBe(tokens.surface);
    expect(token?.colorError).toBe(tokens.neg);
  });
});
