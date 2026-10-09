import { describe, expect, it } from 'vitest';
import { ASSET_TYPES } from '@/domain/assetTypes';
import {
  PORTFOLIO_RANGES,
  fetchDashboardSummary,
  fetchPortfolioSeries,
} from '@/services/dashboard';

describe('fetchDashboardSummary', () => {
  it('returns money as decimal strings', async () => {
    const { kpis } = await fetchDashboardSummary();

    expect(kpis.totalValue).toBe('124580.42');
    expect(typeof kpis.unrealizedPnl).toBe('string');
  });

  it('allocates the whole portfolio across known asset types', async () => {
    const { allocation, kpis } = await fetchDashboardSummary();

    expect(allocation.map((slice) => slice.assetType).sort()).toEqual(
      [...ASSET_TYPES].sort(),
    );
    const cents = allocation.reduce(
      (sum, slice) => sum + Math.round(Number(slice.value) * 100),
      0,
    );
    expect(cents).toBe(Math.round(Number(kpis.totalValue) * 100));
    const percent = allocation.reduce(
      (sum, slice) => sum + Number(slice.percent),
      0,
    );
    expect(percent).toBeCloseTo(100, 5);
  });

  it('lists gold as separate products, not just spot gold', async () => {
    const { recentTransactions, gainers } = await fetchDashboardSummary();
    const goldNames = [...recentTransactions, ...gainers]
      .filter((item) => item.assetType === 'GOLD')
      .map((item) => item.assetName);

    expect(goldNames).toContain('Çeyrek altın');
    expect(goldNames).toContain('Gram altın');
  });
});

describe('dashboard movers', () => {
  it('lists the biggest gains and losses of the portfolio, three at most', async () => {
    const { gainers, losers } = await fetchDashboardSummary();

    expect(gainers.map((mover) => mover.symbol)).toEqual([
      'BTC',
      'NVDA',
      'XAU-G',
    ]);
    expect(losers.map((mover) => mover.symbol)).toEqual([
      'THYAO',
      'ETH',
      'EUR',
    ]);
    expect(gainers.every((mover) => Number(mover.pnl) > 0)).toBe(true);
    expect(losers.every((mover) => Number(mover.pnl) < 0)).toBe(true);
  });

  it('derives the unrealized profit from the holdings', async () => {
    const { kpis } = await fetchDashboardSummary();

    expect(kpis.totalCost).toBe('114742.00');
    expect(kpis.unrealizedPnl).toBe('9838.42');
    expect(kpis.unrealizedPnlPercent).toBe('8.6');
  });
});

describe('fetchPortfolioSeries', () => {
  it.each(PORTFOLIO_RANGES)("ends at today's totals for %s", async (range) => {
    const [summary, series] = await Promise.all([
      fetchDashboardSummary(),
      fetchPortfolioSeries(range),
    ]);
    const last = series.at(-1);

    expect(last?.date).toBe('2026-09-21');
    expect(last?.value).toBe(summary.kpis.totalValue);
    expect(last?.cost).toBe(summary.kpis.totalCost);
  });

  it('returns dates in ascending order', async () => {
    const series = await fetchPortfolioSeries('1M');
    const dates = series.map((point) => point.date);

    expect(dates).toEqual([...dates].sort());
    expect(series).toHaveLength(30);
  });

  it('is deterministic', async () => {
    expect(await fetchPortfolioSeries('3M')).toEqual(
      await fetchPortfolioSeries('3M'),
    );
  });
});
