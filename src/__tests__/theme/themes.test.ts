import { describe, expect, it } from 'vitest';
import {
  DEFAULT_THEME,
  THEME_NAMES,
  getThemeTokens,
  isThemeName,
  type TokenName,
} from '@/theme/themes';

interface Rgba {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

function parseColor(value: string): Rgba {
  const hex = /^#([0-9a-f]{6})$/i.exec(value);
  if (hex) {
    const n = Number.parseInt(hex[1], 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const fn = /^rgb\((\d+) (\d+) (\d+)(?: \/ ([\d.]+))?\)$/.exec(value);
  if (fn) {
    return {
      r: Number(fn[1]),
      g: Number(fn[2]),
      b: Number(fn[3]),
      a: fn[4] === undefined ? 1 : Number(fn[4]),
    };
  }
  throw new Error(`Unsupported color: ${value}`);
}

function over(fg: Rgba, bg: Rgba): Rgba {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

function luminance(c: Rgba): number {
  const channel = (v: number): number => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

function contrast(fg: Rgba, bg: Rgba): number {
  const l1 = luminance(fg);
  const l2 = luminance(bg);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// [foreground, background, minimum ratio] — the same pairs the design prototype audits.
const PAIRS: readonly (readonly [TokenName, TokenName, number])[] = [
  ['text', 'surface', 4.5],
  ['text-2', 'surface', 4.5],
  ['text-2', 'bg', 4.5],
  ['text-3', 'surface', 3],
  ['primary', 'surface', 4.5],
  ['on-primary', 'primary', 4.5],
  ['pos', 'surface', 4.5],
  ['neg', 'surface', 4.5],
  ['pos', 'pos-soft', 4.5],
  ['neg', 'neg-soft', 4.5],
  ['warn', 'warn-soft', 4.5],
  ['nav-text', 'nav-bg', 4.5],
  ['nav-text-active', 'nav-bg', 4.5],
  // Chart series marks need 3:1 against the surface (validated with the dataviz palette validator).
  ['chart-1', 'surface', 3],
  ['chart-2', 'surface', 3],
  ['chart-3', 'surface', 3],
  ['chart-4', 'surface', 3],
  ['chart-5', 'surface', 3],
];

describe('themes', () => {
  it('knows the three themes and defaults to the brand one', () => {
    expect(THEME_NAMES).toEqual(['default', 'light', 'dark']);
    expect(DEFAULT_THEME).toBe('default');
  });

  it('recognizes theme names only', () => {
    expect(isThemeName('dark')).toBe(true);
    expect(isThemeName('sepia')).toBe(false);
    expect(isThemeName(null)).toBe(false);
  });

  it('defines the same tokens in every theme', () => {
    const expected = Object.keys(getThemeTokens('default')).sort();
    for (const name of THEME_NAMES) {
      expect(Object.keys(getThemeTokens(name)).sort()).toEqual(expected);
    }
  });

  it.each(THEME_NAMES)('%s theme meets the WCAG contrast targets', (name) => {
    const tokens = getThemeTokens(name);
    const surface = parseColor(tokens.surface);
    for (const [foreground, background, minimum] of PAIRS) {
      const bg = over(parseColor(tokens[background]), surface);
      const fg = over(parseColor(tokens[foreground]), bg);
      expect(
        contrast(fg, bg),
        `${name}: ${foreground} on ${background}`,
      ).toBeGreaterThanOrEqual(minimum);
    }
  });

  it('rejects colors it cannot parse', () => {
    expect(() => parseColor('hsl(0 0% 0%)')).toThrow('Unsupported color');
  });
});
