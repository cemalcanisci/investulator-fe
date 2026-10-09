import { describe, expect, it } from 'vitest';
import type { Holding } from '@/domain/holding';
import { UNAVAILABLE_HOLDING } from '@/__tests__/utils/fixtures';
import { performanceByType, rankedHoldings } from '@/lib/analysisView';

const positions: Holding[] = [
  {
    ...UNAVAILABLE_HOLDING,
    id: 'a',
    assetType: 'CRYPTO',
    cost: '100',
    value: '140',
    pnl: '40',
    pnlPercent: '40',
  },
  {
    ...UNAVAILABLE_HOLDING,
    id: 'b',
    assetType: 'CRYPTO',
    cost: '200',
    value: '150',
    pnl: '-50',
    pnlPercent: '-25',
  },
  {
    ...UNAVAILABLE_HOLDING,
    id: 'c',
    assetType: 'GOLD',
    cost: '10',
    value: '20',
    pnl: '10',
    pnlPercent: '100',
  },
  {
    ...UNAVAILABLE_HOLDING,
    id: 'd',
    assetType: 'FX',
    cost: '0',
    value: '0',
    pnl: '0',
    pnlPercent: '0',
  },
  UNAVAILABLE_HOLDING,
];

describe('analysis views', () => {
  it('aggregates exact values and costs while excluding unpriced holdings', () => {
    expect(performanceByType(positions)).toEqual([
      {
        assetType: 'CRYPTO',
        value: '290',
        cost: '300',
        pnl: '-10',
        pnlPercent: '-3.3',
        percent: '93.5',
      },
      {
        assetType: 'GOLD',
        value: '20',
        cost: '10',
        pnl: '10',
        pnlPercent: '100.0',
        percent: '6.5',
      },
      {
        assetType: 'FX',
        value: '0',
        cost: '0',
        pnl: '0',
        pnlPercent: '0.0',
        percent: '0.0',
      },
    ]);
    expect(performanceByType([])).toEqual([]);
    expect(performanceByType([UNAVAILABLE_HOLDING])).toEqual([]);
  });

  it('ranks by amount or return percentage without mutating the input', () => {
    expect(
      rankedHoldings(positions, 'AMOUNT', 'ALL').map((item) => item.id),
    ).toEqual(['a', 'c', 'd', 'b']);
    expect(
      rankedHoldings(positions, 'PERCENT', 'GAINERS').map((item) => item.id),
    ).toEqual(['c', 'a']);
    expect(
      rankedHoldings(positions, 'AMOUNT', 'LOSERS').map((item) => item.id),
    ).toEqual(['b']);
    expect(positions.map((item) => item.id)).toEqual([
      'a',
      'b',
      'c',
      'd',
      'tst',
    ]);
  });

  it('orders losses worst first and resolves equal values deterministically', () => {
    const first = positions[0];
    if (first === undefined) {
      throw new Error('Missing fixture');
    }
    const losses = [
      { ...first, id: 'z', pnl: '-1', pnlPercent: null },
      { ...first, id: 'y', pnl: '-20' },
      { ...first, id: 'x', pnl: '-20' },
    ];
    expect(
      rankedHoldings(losses, 'AMOUNT', 'LOSERS').map((item) => item.id),
    ).toEqual(['x', 'y', 'z']);
    expect(rankedHoldings(losses, 'PERCENT', 'ALL').at(-1)?.id).toBe('z');
  });
});
