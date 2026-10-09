import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useDashboardSummary } from '@/hooks/useDashboardSummary';
import { useHoldings } from '@/hooks/useHoldings';
import { usePortfolioSeries } from '@/hooks/usePortfolioSeries';
import { QueryWrapper } from '@/__tests__/utils/QueryWrapper';

describe('useDashboardSummary', () => {
  it('loads the dashboard summary', async () => {
    const { result } = renderHook(() => useDashboardSummary(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.kpis.totalValue).toBe('124580.42');
  });
});

describe('usePortfolioSeries', () => {
  it('loads the series for the requested range', async () => {
    const { result } = renderHook(() => usePortfolioSeries('1W'), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toHaveLength(7);
  });
});

describe('useHoldings', () => {
  it('loads the holdings and when their prices were updated', async () => {
    const { result } = renderHook(() => useHoldings(), {
      wrapper: QueryWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data?.holdings).toHaveLength(14);
    expect(result.current.data?.pricesUpdatedAt).toBe(
      '2026-09-21T11:05:00.000Z',
    );
  });
});
