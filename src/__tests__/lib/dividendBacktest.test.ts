import { describe, expect, it } from 'vitest';
import type { DividendHistory } from '@/domain/dividendHistory';
import { backtestDividends } from '@/lib/dividendBacktest';
import { addDecimals } from '@/lib/decimal';

function fixture(): DividendHistory {
  return {
    assetId: 'fictional-equity',
    asOf: '2025-12-31',
    retrievedAt: '2026-01-01',
    currency: 'USD',
    listedFrom: '2000-01-01',
    verifiedFrom: '2000-01-01',
    priceBasis: 'SPLIT_ADJUSTED',
    review: 'REVIEWED',
    sources: [],
    unavailableReason: 'MISSING_DATA',
    dividends: [],
    quotes: Array.from({ length: 240 }, (_, index) => ({
      date: new Date(Date.UTC(2006, index + 1, 0)).toISOString().slice(0, 10),
      close: '10',
      fx: '1',
    })),
  };
}

describe('historical dividend backtest', () => {
  it.each([10, 15, 20])(
    'uses exactly %i years of monthly contributions',
    (years) => {
      const result = backtestDividends(fixture(), years);
      expect(result.status).toBe('COMPLETE');
      expect(result.entries).toHaveLength(years * 12);
      expect(result.balance).toBe(`${years * 1000}.00`);
      expect(result.gain).toBe('0.00');
      expect(Number(result.xirr)).toBeCloseTo(0);
      expect(Number(addDecimals(result.entries.map((e) => e.usd)))).toBe(
        years * 1000,
      );
    },
  );

  it('fixes entitlement before ex-date purchases, waits for payment and counts unpaid receivables', () => {
    const result = backtestDividends(
      {
        ...fixture(),
        dividends: [
          {
            id: 'first',
            exDate: '2016-02-29',
            payDate: '2016-03-31',
            grossPerShare: '1',
            sourceId: 'fake',
          },
          {
            id: 'pending',
            exDate: '2025-12-31',
            payDate: '2026-01-02',
            grossPerShare: '1',
            sourceId: 'fake',
          },
        ],
      },
      10,
    );
    const payments = result.entries.filter((e) => e.kind === 'DIVIDEND');
    expect(payments).toHaveLength(1);
    expect(payments[0].date).toBe('2016-03-31');
    expect(Number(payments[0].usd)).toBe(8.333);
    expect(Number(result.receivable)).toBeCloseTo(992.5, 2);
    expect(Number(result.balance)).toBeCloseTo(11000.83, 2);
  });

  it('distinguishes listing history, missing months and conflicting sources', () => {
    const history = fixture();
    expect(
      backtestDividends({ ...history, listedFrom: '2012-01-01' }, 20).status,
    ).toBe('INSUFFICIENT_HISTORY');
    expect(
      backtestDividends({ ...history, listedFrom: '2012-01-01' }, 10).status,
    ).toBe('COMPLETE');
    expect(
      backtestDividends(
        {
          ...history,
          verifiedFrom: '2010-01-01',
          unavailableReason: 'SOURCE_CONFLICT',
        },
        20,
      ).status,
    ).toBe('SOURCE_CONFLICT');
    expect(
      backtestDividends(
        {
          ...history,
          quotes: history.quotes.filter((q) => q.date !== '2018-02-28'),
        },
        10,
      ).status,
    ).toBe('MISSING_DATA');
  });

  it('rejects zero FX, duplicates, absent ex dates, reversed payment dates and invalid cutoffs', () => {
    const history = fixture();
    expect(
      backtestDividends(
        { ...history, quotes: history.quotes.map((q) => ({ ...q, fx: '0' })) },
        10,
      ).status,
    ).toBe('MISSING_DATA');
    expect(
      backtestDividends(
        { ...history, quotes: [...history.quotes, history.quotes[239]] },
        10,
      ).status,
    ).toBe('MISSING_DATA');
    const dividend = {
      id: 'fake',
      exDate: '2025-12-31',
      payDate: '2026-01-02',
      grossPerShare: '1',
      sourceId: 'fake',
    };
    expect(
      backtestDividends({ ...history, dividends: [dividend, dividend] }, 10)
        .status,
    ).toBe('MISSING_DATA');
    expect(
      backtestDividends(
        { ...history, dividends: [{ ...dividend, exDate: '2025-12-15' }] },
        10,
      ).status,
    ).toBe('MISSING_DATA');
    expect(
      backtestDividends(
        { ...history, dividends: [{ ...dividend, payDate: '2025-12-01' }] },
        10,
      ).status,
    ).toBe('MISSING_DATA');
    expect(() =>
      backtestDividends({ ...history, asOf: '2025-12-15' }, 10),
    ).toThrow('Backtest requires a calendar month-end');
    expect(() => backtestDividends(history, 5)).toThrow('Unsupported horizon');
  });

  it('uses dated FX without counting dividends twice', () => {
    const history = fixture();
    const result = backtestDividends(
      {
        ...history,
        quotes: history.quotes.map((q) => ({ ...q, fx: '2' })),
      },
      10,
    );
    expect(result.balance).toBe('10000.00');
    expect(result.dividends).toBe('0.00');
  });
});
