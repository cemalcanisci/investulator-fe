import { describe, expect, it } from 'vitest';
import {
  convertFromUsd,
  formatMoney,
  formatUnitMoney,
  formatWholeMoney,
} from '@/lib/formatMoney';

describe('formatMoney', () => {
  it('formats dollars with the locale separators', () => {
    expect(formatMoney(1234.5, 'en', 'USD')).toBe('$1,234.50');
    expect(formatMoney(1234.5, 'tr', 'USD')).toContain('1.234,50');
  });

  it('accepts decimal strings', () => {
    expect(formatMoney('124580.42', 'en', 'USD')).toBe('$124,580.42');
  });

  it('formats liras with the lira sign in both languages', () => {
    expect(formatMoney(1234.5, 'en', 'TRY')).toBe('₺1,234.50');
    expect(formatMoney(1234.5, 'tr', 'TRY')).toBe('₺1.234,50');
  });

  it('shows a plus sign only for positive amounts when signed', () => {
    expect(formatMoney(5, 'en', 'USD')).toBe('$5.00');
    expect(formatMoney(5, 'en', 'USD', { signed: true })).toBe('+$5.00');
    expect(formatMoney(-5, 'en', 'USD', { signed: true })).toBe('-$5.00');
    expect(formatMoney(0, 'en', 'USD', { signed: true })).toBe('$0.00');
    expect(formatMoney(5, 'en', 'TRY', { signed: true })).toBe('+₺5.00');
  });
});

describe('formatWholeMoney', () => {
  it('drops the decimals', () => {
    expect(formatWholeMoney(125000.4, 'en', 'USD')).toBe('$125,000');
    expect(formatWholeMoney(125000, 'tr', 'USD')).toContain('125.000');
    expect(formatWholeMoney(5132000, 'tr', 'TRY')).toBe('₺5.132.000');
  });
});

describe('formatUnitMoney', () => {
  it('shows small nonzero crypto prices', () => {
    expect(formatUnitMoney('0.0000001', 'en', 'USD')).toBe('$0.00000010');
    expect(formatUnitMoney('0', 'en', 'USD')).toBe('$0.00');
  });
  it('uses two decimals by default and as many as asked for currency rates', () => {
    expect(formatUnitMoney('8.27', 'en', 'USD')).toBe('$8.27');
    expect(formatUnitMoney(198.1, 'tr', 'USD')).toContain('198,10');
    expect(formatUnitMoney('1.0750', 'en', 'USD', 4)).toBe('$1.0750');
    expect(formatUnitMoney('41.25', 'tr', 'TRY')).toBe('₺41,25');
  });
});

describe('convertFromUsd', () => {
  it('leaves dollars alone', () => {
    expect(convertFromUsd('100.00', 'USD', '41.2500')).toBe('100.00');
    expect(convertFromUsd(100, 'USD', '41.2500')).toBe(100);
  });

  it('converts decimal strings exactly', () => {
    expect(convertFromUsd('124580.42', 'TRY', '41.2500')).toBe(
      '5138942.325000',
    );
    expect(convertFromUsd('-189.00', 'TRY', '41.2500')).toBe('-7796.250000');
  });

  it('converts numbers for charts', () => {
    expect(convertFromUsd(100, 'TRY', '41.2500')).toBeCloseTo(4125);
  });

  it('cannot convert without a rate', () => {
    expect(convertFromUsd('100.00', 'TRY', null)).toBe('100.00');
  });
});
