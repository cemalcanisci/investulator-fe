import { describe, expect, it } from 'vitest';
import { formatPercent, formatQuantity } from '@/lib/formatNumber';

describe('formatQuantity', () => {
  it('uses the locale separators and keeps the decimals of the input', () => {
    expect(formatQuantity('0.0500', 'tr')).toBe('0,0500');
    expect(formatQuantity('0.0500', 'en')).toBe('0.0500');
  });

  it('formats whole quantities without decimals', () => {
    expect(formatQuantity('1500', 'en')).toBe('1,500');
    expect(formatQuantity('10', 'tr')).toBe('10');
  });
});

describe('formatPercent', () => {
  it('formats percent units with one decimal', () => {
    expect(formatPercent(6.5, 'en')).toBe('6.5%');
    expect(formatPercent('13.4', 'en')).toBe('13.4%');
  });

  it('signs profit and loss when asked', () => {
    expect(formatPercent('6.5', 'en', { signed: true })).toBe('+6.5%');
    expect(formatPercent('-0.4', 'en', { signed: true })).toBe('-0.4%');
  });
});
