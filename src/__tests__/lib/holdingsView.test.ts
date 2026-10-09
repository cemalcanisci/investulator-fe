import { describe, expect, it } from 'vitest';
import {
  HOLDINGS_SORTS,
  TYPE_FILTERS,
  ariaSortOf,
  countByType,
  defaultOrder,
  filterHoldings,
  isHoldingsSort,
  nextOrder,
  sortHoldings,
  totalsOf,
} from '@/lib/holdingsView';
import { HOLDINGS } from '@/services/mockPortfolio';
import { UNAVAILABLE_HOLDING } from '@/__tests__/utils/fixtures';

function names(list: readonly { readonly assetName: string }[]): string[] {
  return list.map((holding) => holding.assetName);
}

describe('filterHoldings', () => {
  it('keeps everything without a type or query', () => {
    expect(
      filterHoldings(HOLDINGS, { type: 'ALL', query: '' }, 'tr'),
    ).toHaveLength(14);
  });

  it('filters by asset type', () => {
    expect(
      names(filterHoldings(HOLDINGS, { type: 'GOLD', query: '' }, 'tr')).sort(),
    ).toEqual(['Ata altını (tam)', 'Gram altın', 'Çeyrek altın']);
  });

  it('matches the name or the symbol, ignoring case and surrounding spaces', () => {
    expect(
      names(filterHoldings(HOLDINGS, { type: 'ALL', query: '  nvd ' }, 'tr')),
    ).toEqual(['NVIDIA']);
    expect(
      names(filterHoldings(HOLDINGS, { type: 'ALL', query: 'aapl' }, 'tr')),
    ).toEqual(['Apple']);
  });

  it('respects the Turkish dotted and dotless i', () => {
    expect(
      names(filterHoldings(HOLDINGS, { type: 'ALL', query: 'BİM' }, 'tr')),
    ).toEqual(['BİM']);
  });

  it('combines the type and the query', () => {
    expect(
      filterHoldings(HOLDINGS, { type: 'CRYPTO', query: 'apple' }, 'tr'),
    ).toEqual([]);
    expect(
      names(filterHoldings(HOLDINGS, { type: 'GOLD', query: 'çeyrek' }, 'tr')),
    ).toEqual(['Çeyrek altın']);
  });
});

describe('sortHoldings', () => {
  it('sorts by value, highest first', () => {
    expect(sortHoldings(HOLDINGS, 'VALUE', 'tr')[0].assetName).toBe('Bitcoin');
  });

  it('sorts by profit amount and percentage, highest first', () => {
    expect(sortHoldings(HOLDINGS, 'PNL', 'tr')[0].assetName).toBe('Bitcoin');
    expect(sortHoldings(HOLDINGS, 'PNL_PERCENT', 'tr')[0].assetName).toBe(
      'Solana',
    );
    expect(sortHoldings(HOLDINGS, 'PNL', 'tr').at(-1)?.assetName).toBe(
      'Türk Hava Yolları',
    );
  });

  it('sorts by name with the locale collation', () => {
    expect(sortHoldings(HOLDINGS, 'NAME', 'tr')[0].assetName).toBe('Apple');
  });

  it('puts holdings without a price last and keeps their relative order', () => {
    const list = [
      UNAVAILABLE_HOLDING,
      HOLDINGS[1],
      { ...UNAVAILABLE_HOLDING, id: 'tst2' },
      HOLDINGS[0],
    ];
    const sorted = sortHoldings(list, 'VALUE', 'tr');

    expect(sorted.map((holding) => holding.id)).toEqual([
      HOLDINGS[0].id,
      HOLDINGS[1].id,
      'tst',
      'tst2',
    ]);
  });

  it('reverses the order when asked, with unknown values still last', () => {
    const list = [HOLDINGS[0], UNAVAILABLE_HOLDING, HOLDINGS[1]];

    expect(
      sortHoldings(list, 'VALUE', 'tr', 'asc').map((holding) => holding.id),
    ).toEqual([HOLDINGS[1].id, HOLDINGS[0].id, 'tst']);
    expect(sortHoldings(HOLDINGS, 'NAME', 'tr', 'desc')[0].assetName).toBe(
      'Türk Hava Yolları',
    );
    expect(sortHoldings(HOLDINGS, 'PNL', 'tr', 'asc')[0].assetName).toBe(
      'Türk Hava Yolları',
    );
  });

  it('does not change the list it was given', () => {
    const before = names(HOLDINGS);
    sortHoldings(HOLDINGS, 'NAME', 'tr');

    expect(names(HOLDINGS)).toEqual(before);
  });
});

describe('order', () => {
  it('starts numbers biggest first and names from A', () => {
    expect(defaultOrder('VALUE')).toEqual({ sort: 'VALUE', direction: 'desc' });
    expect(defaultOrder('PNL_PERCENT').direction).toBe('desc');
    expect(defaultOrder('NAME')).toEqual({ sort: 'NAME', direction: 'asc' });
  });

  it('flips the direction of the column that is already sorted', () => {
    const value = defaultOrder('VALUE');

    expect(nextOrder(value, 'VALUE')).toEqual({
      sort: 'VALUE',
      direction: 'asc',
    });
    expect(nextOrder(nextOrder(value, 'VALUE'), 'VALUE').direction).toBe(
      'desc',
    );
  });

  it('starts another column in its own default direction', () => {
    expect(nextOrder({ sort: 'VALUE', direction: 'asc' }, 'NAME')).toEqual({
      sort: 'NAME',
      direction: 'asc',
    });
    expect(nextOrder({ sort: 'NAME', direction: 'desc' }, 'PNL')).toEqual({
      sort: 'PNL',
      direction: 'desc',
    });
  });

  it('names the aria-sort state of a header', () => {
    expect(
      ariaSortOf({ sort: 'PNL', direction: 'asc' }, ['PNL', 'PNL_PERCENT']),
    ).toBe('ascending');
    expect(
      ariaSortOf({ sort: 'PNL_PERCENT', direction: 'desc' }, [
        'PNL',
        'PNL_PERCENT',
      ]),
    ).toBe('descending');
    expect(ariaSortOf({ sort: 'VALUE', direction: 'desc' }, ['NAME'])).toBe(
      'none',
    );
  });
});

describe('countByType', () => {
  it('counts every type and the total', () => {
    expect(countByType(HOLDINGS)).toEqual({
      ALL: 14,
      CRYPTO: 3,
      US_STOCK: 3,
      GOLD: 3,
      BIST_STOCK: 3,
      FX: 2,
    });
  });
});

describe('totalsOf', () => {
  it('sums value, cost and profit exactly', () => {
    expect(totalsOf(HOLDINGS)).toEqual({
      value: '124580.42',
      cost: '114742.00',
      pnl: '9838.42',
      pnlPercent: '8.6',
      unpricedCount: 0,
    });
  });

  it('leaves holdings without a price out of every total and reports them', () => {
    const totals = totalsOf([...HOLDINGS, UNAVAILABLE_HOLDING]);

    expect(totals.value).toBe('124580.42');
    expect(totals.cost).toBe('114742.00');
    expect(totals.unpricedCount).toBe(1);
  });

  it('is zero for an empty list', () => {
    expect(totalsOf([])).toEqual({
      value: '0',
      cost: '0',
      pnl: '0',
      pnlPercent: '0.0',
      unpricedCount: 0,
    });
  });
});

describe('filters and sorts', () => {
  it('lists "all" first, then every asset type', () => {
    expect(TYPE_FILTERS).toEqual([
      'ALL',
      'CRYPTO',
      'BIST_STOCK',
      'US_STOCK',
      'GOLD',
      'FX',
    ]);
  });

  it('recognizes sort names only', () => {
    expect(HOLDINGS_SORTS.every(isHoldingsSort)).toBe(true);
    expect(isHoldingsSort('RANDOM')).toBe(false);
  });
});
