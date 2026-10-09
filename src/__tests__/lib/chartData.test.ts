import { describe, expect, it } from 'vitest';
import { toChartPoints } from '@/lib/chartData';

describe('toChartPoints', () => {
  it('converts decimal strings to numbers for plotting', () => {
    expect(
      toChartPoints([
        { date: '2026-09-21', value: '124580.42', cost: '109870.00' },
      ]),
    ).toEqual([{ date: '2026-09-21', value: 124580.42, cost: 109870 }]);
  });

  it('returns an empty list for no points', () => {
    expect(toChartPoints([])).toEqual([]);
  });
});
