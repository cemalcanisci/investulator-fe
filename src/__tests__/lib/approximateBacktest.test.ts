import { describe, expect, it } from 'vitest';
import type { ApproximateHistory } from '@/domain/approximateHistory';
import { approximateBacktest } from '@/lib/approximateBacktest';
import { getApproximateHistory } from '@/services/approximateHistory';
import { getDividendHistory } from '@/services/dividendHistory';
import { backtestDividends } from '@/lib/dividendBacktest';

function fixture(): ApproximateHistory {
  const coverage = {
    from: '2000-01-01',
    to: '2020-12-31',
    state: 'REVIEWED' as const,
    sourceIds: ['source'],
    method: 'Synthetic fixture',
  };
  return {
    assetId: 'fictional',
    asOf: '2020-12-31',
    currency: 'TRY',
    listedFrom: '2000-01-01',
    priceBasis: 'SPLIT_ONLY',
    shareBasisDate: '2020-12-31',
    sources: [
      {
        id: 'source',
        url: 'https://example.com',
        title: 'Synthetic',
        origin: 'Fixture',
        retrievedAt: '2021-01-01',
      },
    ],
    coverage: {
      prices: coverage,
      fx: coverage,
      actions: coverage,
      dividends: coverage,
    },
    monthly: Array.from({ length: 240 }, (_, i) => {
      const date = new Date(
        Date.UTC(2001 + Math.floor(i / 12), (i % 12) + 1, 0),
      )
        .toISOString()
        .slice(0, 10);
      return {
        date,
        close: '10',
        fx: '2',
        fxDate: date,
        priceSourceId: 'source',
        fxSourceId: 'source',
      };
    }),
    actions: [],
    dividends: [],
    expectedDividendIds: [],
    expectedActionIds: [],
  };
}
const options = { mode: 'MONTHLY' as const, amountUsd: '1000' };
describe('approximate historical investment', () => {
  it('keeps payments after the final monthly close in cash rather than receivables', () => {
    const h = fixture();
    const dividend = {
      id: 'late',
      exDate: '2020-12-20',
      payDate: '2020-12-31',
      rawGrossPerShare: '1',
      sourceId: 'source',
    };
    const result = approximateBacktest(
      {
        ...h,
        monthly: h.monthly.map((q, i) =>
          i === 239 ? { ...q, date: '2020-12-30', fxDate: '2020-12-30' } : q,
        ),
        dividends: [dividend],
        expectedDividendIds: ['late'],
      },
      10,
      { mode: 'LUMP_SUM', amountUsd: '1000' },
    );
    expect(result.reinvest?.local.cash).toBe('200.00');
    expect(result.reinvest?.local.receivable).toBe('0.00');
  });
  it.each([10, 15, 20])(
    'uses real monthly coverage independently of strict audit for %i years',
    (years) => {
      const result = approximateBacktest(fixture(), years, options);
      expect(result.status).toBe('APPROXIMATE');
      expect(result.reinvest?.usd.invested).toBe(`${years * 12000}.00`);
      expect(result.reinvest?.usd.profit).toBe('0.00');
      expect(result.reinvest?.usd.xirr).toBe('0.00');
      expect(result.reinvest?.local.invested).toBe(`${years * 24000}.00`);
    },
  );
  it('keeps lump sum, cash and reinvestment distinct and pays only after entitlement', () => {
    const h = fixture();
    const dividend = {
      id: 'd',
      exDate: '2011-02-10',
      payDate: '2011-03-02',
      rawGrossPerShare: '1',
      sourceId: 'source',
    };
    const result = approximateBacktest(
      { ...h, dividends: [dividend], expectedDividendIds: ['d'] },
      10,
      { mode: 'LUMP_SUM', amountUsd: '1000' },
    );
    expect(result.cash?.usd.invested).toBe('1000.00');
    expect(result.cash?.local.cash).toBe('200.00');
    expect(result.cash?.usd.balance).toBe('1100.00');
    expect(result.reinvest?.local.cash).toBe('0.00');
    expect(
      result.reinvest?.entries.find((e) => e.kind === 'REINVESTMENT')?.date,
    ).toBe('2011-03-31');
  });
  it('normalizes old dividends once on a split-only price basis', () => {
    const h = fixture();
    const action = {
      id: 'split',
      date: '2012-01-01',
      factor: '2',
      type: 'SPLIT' as const,
      sourceId: 'source',
    };
    const dividend = {
      id: 'd',
      exDate: '2011-02-10',
      payDate: '2011-02-12',
      rawGrossPerShare: '2',
      sourceId: 'source',
    };
    const result = approximateBacktest(
      {
        ...h,
        actions: [action],
        expectedActionIds: ['split'],
        dividends: [dividend],
        expectedDividendIds: ['d'],
      },
      10,
      { mode: 'LUMP_SUM', amountUsd: '1000' },
    );
    expect(result.cash?.local.cash).toBe('200.00');
    expect(result.cash?.local.equity).toBe('2000.00');
  });
  it('retains unpaid entitlement without premature reinvestment and excludes ex-date purchases', () => {
    const h = fixture(),
      dividend = {
        id: 'd',
        exDate: '2020-12-31',
        payDate: '2021-01-04',
        rawGrossPerShare: '1',
        sourceId: 'source',
      };
    const result = approximateBacktest(
      { ...h, dividends: [dividend], expectedDividendIds: ['d'] },
      10,
      options,
    );
    expect(result.reinvest?.local.receivable).toBe('23800.00');
    expect(
      result.reinvest?.entries.some((e) => e.kind === 'REINVESTMENT'),
    ).toBe(false);
  });
  it('keeps price-only results when dividend coverage or records are incomplete', () => {
    const h = fixture();
    for (const changed of [
      { ...h, expectedDividendIds: ['missing'] },
      {
        ...h,
        coverage: {
          ...h.coverage,
          dividends: { ...h.coverage.dividends, state: 'MISSING' as const },
        },
      },
    ]) {
      const result = approximateBacktest(changed, 10, options);
      expect(result.status).toBe('PRICE_ONLY');
      expect(result.priceOnly).toBeDefined();
      expect(result.cash).toBeUndefined();
      expect(result.reinvest).toBeUndefined();
    }
  });
  it('blocks missing months, duplicated months, stale FX, unknown actions and total-return prices', () => {
    const h = fixture();
    const variants: ApproximateHistory[] = [
      { ...h, monthly: h.monthly.slice(0, -1) },
      { ...h, monthly: [...h.monthly, h.monthly[h.monthly.length - 1]] },
      {
        ...h,
        monthly: h.monthly.map((q, i) =>
          i === 239 ? { ...q, fxDate: '2020-12-01' } : q,
        ),
      },
      { ...h, expectedActionIds: ['missing'] },
      {
        ...h,
        coverage: {
          ...h.coverage,
          actions: { ...h.coverage.actions, state: 'CONFLICT' },
        },
      },
      { ...h, priceBasis: 'TOTAL_RETURN' },
    ];
    for (const variant of variants) {
      const result = approximateBacktest(variant, 10, options);
      expect(result.status).toBe('MISSING_DATA');
      expect(result.priceOnly).toBeUndefined();
    }
  });
  it('rejects invalid input, insufficient history and unknown assets without mutating snapshots', () => {
    const h = fixture(),
      before = JSON.stringify(h);
    expect(
      approximateBacktest(h, 10, { ...options, amountUsd: '0' }).status,
    ).toBe('MISSING_DATA');
    expect(
      approximateBacktest({ ...h, listedFrom: '2012-01-01' }, 10, options)
        .status,
    ).toBe('INSUFFICIENT_HISTORY');
    expect(JSON.stringify(h)).toBe(before);
    expect(getApproximateHistory('unknown')).toBeUndefined();
  });
  it('does not relax the verified engine when approximate coverage is available', () => {
    const h = getApproximateHistory('watch-bist-tuprs'),
      strict = getDividendHistory('watch-bist-tuprs');
    expect(h).toBeDefined();
    expect(strict).toBeDefined();
    if (!h || !strict) {
      throw new Error('Missing snapshots');
    }
    for (const years of [10, 15, 20]) {
      expect(approximateBacktest(h, years, options).status).toBe('APPROXIMATE');
      expect(backtestDividends(strict, years).status).toBe('MISSING_DATA');
    }
  });
});
