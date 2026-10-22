import { describe, expect, it } from 'vitest';
import type { DividendHistory } from '@/domain/dividendHistory';
import { backtestDividends } from '@/lib/dividendBacktest';
import { addDecimals } from '@/lib/decimal';

function seal(h: DividendHistory): DividendHistory {
  const quotes = h.quotes.map((q) => ({
    ...q,
    rawClose: q.close,
    fxDate: q.date,
    priceSourceId: 'fake',
    fxSourceId: 'fake',
    shareBasisId: 'basis',
  }));
  const dividends = h.dividends.map((d) => ({
    ...d,
    rawGrossPerShare: d.grossPerShare,
    shareBasisId: 'basis',
  }));
  return {
    ...h,
    quotes,
    dividends,
    sources: [
      {
        id: 'fake',
        title: 'Fictional monthly exchange',
        url: 'https://example.invalid',
      },
    ],
    integrity: {
      evidence: ['first', 'second'].map((id) => ({
        id,
        sourceId: 'fake',
        originId: id,
        collectionId: id,
        reviewerId: id,
        ancestorIds: [],
        documentUrl: `https://example.invalid/synthetic-${id}`,
        locator: 'Synthetic coverage declaration',
        excerpt:
          'Fictional calendar and events; not real-world independence evidence',
        checkedAt: '2026-01-01',
        publishedAt: '2026-01-01',
        method:
          id === 'first'
            ? 'DOCUMENT_RECONCILIATION'
            : 'INDEPENDENT_RECONCILIATION',
        claims: ['CALENDAR', 'LISTING', 'DIVIDENDS', 'ACTIONS', 'PRICES', 'FX'],
        from: '2006-01-01',
        to: h.asOf,
        purchasingPowerDate: null,
      })),
      evidenceClaims: [
        'CALENDAR',
        'LISTING',
        'DIVIDENDS',
        'ACTIONS',
        'PRICES',
        'FX',
      ].map((claim) => ({ claim, evidenceIds: ['first', 'second'] })),
      status: 'VERIFIED',
      from: '2006-01-01',
      to: h.asOf,
      sourceIds: ['fake'],
      shareBasisId: 'basis',
      shareBasisDate: h.asOf,
      calendarSourceId: 'fake',
      listingSourceId: 'fake',
      dividendsSourceId: 'fake',
      actionsSourceId: 'fake',
      sessions: quotes.map((q) => q.date),
      expectedDividends: dividends,
      actions: [],
      fxCarryDays: 0,
    },
  };
}

function fixture(): DividendHistory {
  return seal({
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
  });
}

describe('historical dividend backtest', () => {
  it('rejects self-confirming manifests even when their date and event lists match', () => {
    const history = fixture();
    if (!history.integrity) {
      throw new Error('Missing synthetic manifest');
    }
    const changed = {
      ...history,
      integrity: {
        ...history.integrity,
        evidence: history.integrity.evidence?.map((e) => ({
          ...e,
          originId: 'same-origin',
        })),
      },
    };
    expect(backtestDividends(changed, 10).status).not.toBe('COMPLETE');
    expect(
      backtestDividends(
        { ...history, integrity: { ...history.integrity, evidence: [] } },
        10,
      ).status,
    ).not.toBe('COMPLETE');
  });
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
      seal({
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
      }),
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
    expect(
      backtestDividends({ ...history, asOf: '2025-12-15' }, 10).status,
    ).toBe('MISSING_DATA');
    expect(() => backtestDividends(history, 5)).toThrow('Unsupported horizon');
  });

  it('uses dated FX without counting dividends twice', () => {
    const history = fixture();
    const result = backtestDividends(
      {
        ...history,
        currency: 'TRY',
        quotes: history.quotes.map((q) => ({ ...q, fx: '2' })),
      },
      10,
    );
    expect(result.balance).toBe('10000.00');
    expect(result.dividends).toBe('0.00');
  });
});

describe('history integrity regressions', () => {
  it('rejects removed dividend records despite unchanged monthly quote count', () => {
    const h = seal({
      ...fixture(),
      dividends: [
        {
          id: 'payment',
          exDate: '2016-02-29',
          payDate: '2016-03-31',
          grossPerShare: '1',
          sourceId: 'fake',
        },
      ],
    });
    expect(backtestDividends(h, 10).status).toBe('COMPLETE');
    expect(backtestDividends({ ...h, dividends: [] }, 10).issues).toContain(
      'DIVIDENDS',
    );
  });
  it('rejects shifted month-end prices even when record counts match', () => {
    const h = fixture();
    expect(
      backtestDividends(
        {
          ...h,
          quotes: h.quotes.map((q) =>
            q.date === '2025-08-31' ? { ...q, date: '2025-08-28' } : q,
          ),
        },
        10,
      ).issues,
    ).toContain('SESSIONS');
  });
  it('verifies split/bonus basis and rejects double adjustment or unsupported actions', () => {
    const h = fixture();
    if (!h.integrity) {
      throw new Error('Missing fixture manifest');
    }
    const action = {
      date: '2020-01-01',
      factor: '2',
      type: 'BONUS' as const,
      sourceId: 'fake',
    };
    const split = {
      ...h,
      quotes: h.quotes.map((q) => ({
        ...q,
        rawClose: q.date < action.date ? '20' : '10',
      })),
      integrity: { ...h.integrity, actions: [action] },
    };
    expect(backtestDividends(split, 10).balance).toBe(
      backtestDividends(h, 10).balance,
    );
    expect(
      backtestDividends(
        { ...split, quotes: split.quotes.map((q) => ({ ...q, close: '5' })) },
        10,
      ).issues,
    ).toContain('ACTIONS');
    expect(
      backtestDividends(
        {
          ...split,
          integrity: {
            ...split.integrity,
            actions: [{ ...action, type: 'UNSUPPORTED' }],
          },
        },
        10,
      ).issues,
    ).toContain('ACTIONS');
  });
  it('rejects unreviewed coverage, absent listing and future FX observations', () => {
    const h = fixture();
    expect(
      backtestDividends({ ...h, integrity: undefined }, 10).issues,
    ).toContain('COVERAGE');
    expect(backtestDividends({ ...h, listedFrom: null }, 10).issues).toContain(
      'LISTING',
    );
    expect(
      backtestDividends(
        { ...h, quotes: h.quotes.map((q) => ({ ...q, fxDate: '2030-01-01' })) },
        10,
      ).issues,
    ).toContain('FX');
  });
});
