import { describe, expect, it } from 'vitest';
import {
  addDecimals,
  divideDecimals,
  getSign,
  multiplyDecimals,
  percentageOf,
  roundDecimal,
  subtractDecimals,
  toDisplayNumber,
  trimDecimals,
} from '@/lib/decimal';

describe('getSign', () => {
  it('detects positive and negative decimals', () => {
    expect(getSign('1140.20')).toBe('positive');
    expect(getSign('-189.00')).toBe('negative');
  });

  it('treats any zero, including a negative zero, as zero', () => {
    expect(getSign('0')).toBe('zero');
    expect(getSign('0.00')).toBe('zero');
    expect(getSign('-0.00')).toBe('zero');
    expect(getSign('')).toBe('zero');
  });

  it('does not lose the sign of very small amounts', () => {
    expect(getSign('-0.000000000000000001')).toBe('negative');
  });
});

describe('toDisplayNumber', () => {
  it('converts a decimal string for display purposes', () => {
    expect(toDisplayNumber('124580.42')).toBe(124580.42);
  });
});

describe('addDecimals', () => {
  it('adds exactly, without binary floating point errors', () => {
    expect(addDecimals(['0.1', '0.2'])).toBe('0.3');
    expect(addDecimals(['1140.20', '-189.00'])).toBe('951.20');
  });

  it('aligns different numbers of decimals', () => {
    expect(addDecimals(['5', '0.25'])).toBe('5.25');
    expect(addDecimals(['0.000000000000000001', '1'])).toBe(
      '1.000000000000000001',
    );
  });

  it('handles negative results and cancelling amounts', () => {
    expect(addDecimals(['-0.5', '0.2'])).toBe('-0.3');
    expect(addDecimals(['-5', '5'])).toBe('0');
  });

  it('adds nothing to zero', () => {
    expect(addDecimals([])).toBe('0');
  });

  it('accepts values with a leading plus and a missing whole part', () => {
    expect(addDecimals(['+1.5', '.5'])).toBe('2.0');
  });
});

describe('subtractDecimals', () => {
  it('subtracts exactly', () => {
    expect(subtractDecimals('100.00', '30.50')).toBe('69.50');
    expect(subtractDecimals('1', '2.5')).toBe('-1.5');
  });
});

describe('percentageOf', () => {
  it('returns one decimal', () => {
    expect(percentageOf('50', '200')).toBe('25.0');
    expect(percentageOf('9838.42', '114742.00')).toBe('8.6');
  });

  it('is zero for a zero whole', () => {
    expect(percentageOf('5', '0')).toBe('0.0');
  });
});

describe('multiplyDecimals', () => {
  it('multiplies exactly and keeps the decimals of both inputs', () => {
    expect(multiplyDecimals('124580.42', '41.2500')).toBe('5138942.325000');
    expect(multiplyDecimals('0.1', '0.2')).toBe('0.02');
  });

  it('keeps the sign and handles whole numbers and zero', () => {
    expect(multiplyDecimals('-189.00', '41.25')).toBe('-7796.2500');
    expect(multiplyDecimals('-3', '-2')).toBe('6');
    expect(multiplyDecimals('0.00', '41.25')).toBe('0.0000');
  });
});

describe('roundDecimal', () => {
  it('rounds half away from zero to a fixed number of decimals', () => {
    expect(roundDecimal('2.345', 2)).toBe('2.35');
    expect(roundDecimal('2.344', 2)).toBe('2.34');
    expect(roundDecimal('-2.345', 2)).toBe('-2.35');
    expect(roundDecimal('5138942.325000', 2)).toBe('5138942.33');
  });

  it('pads values that have fewer decimals', () => {
    expect(roundDecimal('7', 2)).toBe('7.00');
    expect(roundDecimal('7.1', 3)).toBe('7.100');
  });

  it('can round to whole numbers', () => {
    expect(roundDecimal('9.5', 0)).toBe('10');
    expect(roundDecimal('0.4', 0)).toBe('0');
  });
});

describe('divideDecimals', () => {
  it('divides to a fixed number of decimals, rounding half away from zero', () => {
    expect(divideDecimals('100', '3', 4)).toBe('33.3333');
    expect(divideDecimals('2', '3', 2)).toBe('0.67');
    expect(divideDecimals('7000', '0.5', 2)).toBe('14000.00');
    expect(divideDecimals('4882.00', '2', 2)).toBe('2441.00');
  });

  it('keeps the sign', () => {
    expect(divideDecimals('-10', '4', 2)).toBe('-2.50');
    expect(divideDecimals('10', '-4', 2)).toBe('-2.50');
    expect(divideDecimals('-10', '-4', 2)).toBe('2.50');
    expect(divideDecimals('0', '-4', 2)).toBe('0.00');
  });

  it('refuses to divide by zero', () => {
    expect(() => divideDecimals('1', '0.00', 2)).toThrow(RangeError);
  });
});

describe('trimDecimals', () => {
  it('drops trailing zeros down to the minimum number of decimals', () => {
    expect(trimDecimals('0.05000000')).toBe('0.05');
    expect(trimDecimals('41200.0000', 2)).toBe('41200.00');
    expect(trimDecimals('12.50', 2)).toBe('12.50');
    expect(trimDecimals('12.5000', 1)).toBe('12.5');
  });

  it('drops the point when nothing is left of the fraction', () => {
    expect(trimDecimals('200.000')).toBe('200');
    expect(trimDecimals('200')).toBe('200');
  });
});
