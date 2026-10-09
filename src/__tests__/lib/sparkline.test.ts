import { describe, expect, it } from 'vitest';
import { sparklinePoints } from '@/lib/sparkline';

describe('sparklinePoints', () => {
  it('returns nothing for an empty series', () => {
    expect(sparklinePoints([], 96, 32)).toBe('');
  });

  it('maps the lowest value to the bottom and the highest to the top', () => {
    expect(sparklinePoints(['0', '5', '10'], 100, 20)).toBe(
      '0.0,20.0 50.0,10.0 100.0,0.0',
    );
  });

  it('draws a flat series as a centered line', () => {
    expect(sparklinePoints(['7', '7', '7'], 100, 20)).toBe(
      '0.0,10.0 50.0,10.0 100.0,10.0',
    );
  });

  it('handles a single value', () => {
    expect(sparklinePoints(['3'], 100, 20)).toBe('0.0,10.0');
  });
});
