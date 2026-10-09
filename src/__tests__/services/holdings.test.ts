import { describe, expect, it } from 'vitest';
import { subtractDecimals } from '@/lib/decimal';
import { fetchDashboardSummary } from '@/services/dashboard';
import { fetchHoldings } from '@/services/holdings';
import { HOLDINGS, PRICES_UPDATED_AT } from '@/services/mockPortfolio';

describe('mock portfolio', () => {
  it('has unique ids and lists the largest position first', () => {
    expect(new Set(HOLDINGS.map((holding) => holding.id)).size).toBe(
      HOLDINGS.length,
    );
    const values = HOLDINGS.map((holding) => Number(holding.value));

    expect(values).toEqual([...values].sort((a, b) => b - a));
  });

  it('derives profit or loss from value and cost for every holding', () => {
    const mismatches = HOLDINGS.filter(
      (holding) =>
        holding.pnl !== subtractDecimals(holding.value ?? '0', holding.cost),
    ).map((holding) => holding.assetName);

    expect(mismatches).toEqual([]);
  });

  it('holds gold as separate products counted in grams or pieces', () => {
    const gold = HOLDINGS.filter((holding) => holding.assetType === 'GOLD');

    expect(
      gold.map((holding) => `${holding.assetName}:${holding.unit}`).sort(),
    ).toEqual([
      'Ata altını (tam):PIECE',
      'Gram altın:GRAM',
      'Çeyrek altın:PIECE',
    ]);
  });

  it('shows one old price so the stale state is visible', () => {
    const stale = HOLDINGS.filter((holding) => holding.priceStatus === 'STALE');

    expect(stale.map((holding) => holding.symbol)).toEqual(['THYAO']);
    expect(stale[0].priceUpdatedAt).not.toBe(PRICES_UPDATED_AT);
  });
});

describe('fetchHoldings', () => {
  it('returns the holdings and when their prices were updated', async () => {
    const response = await fetchHoldings();

    expect(response.holdings).toBe(HOLDINGS);
    expect(response.pricesUpdatedAt).toBe(PRICES_UPDATED_AT);
  });

  it('agrees with the dashboard on the totals', async () => {
    const [{ kpis }, { holdings }] = await Promise.all([
      fetchDashboardSummary(),
      fetchHoldings(),
    ]);
    const value = holdings.reduce(
      (sum, holding) => sum + Math.round(Number(holding.value) * 100),
      0,
    );

    expect(value).toBe(Math.round(Number(kpis.totalValue) * 100));
    expect(kpis.unrealizedPnl).toBe('9838.42');
    expect(kpis.totalCost).toBe('114742.00');
  });
});
