import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ChartTooltip } from '@/components/Dashboard/ChartTooltip';
import { DashboardKpis } from '@/components/Dashboard/DashboardKpis';
import { DashboardSkeleton } from '@/components/Dashboard/DashboardSkeleton';
import { MoversCard } from '@/components/Dashboard/MoversCard';
import { PriceStatus } from '@/components/Dashboard/PriceStatus';
import { RecentTransactions } from '@/components/Dashboard/RecentTransactions';
import { i18n } from '@/i18n';
import { fetchDashboardSummary } from '@/services/dashboard';
import { createTestQueryClient } from '@/__tests__/utils/renderWithProviders';

describe('DashboardKpis', () => {
  it('shows the four headline numbers in dollars', async () => {
    const { kpis } = await fetchDashboardSummary();
    const { container } = render(<DashboardKpis kpis={kpis} />);

    for (const key of ['totalValue', 'totalCost', 'unrealized', 'realized']) {
      expect(
        screen.getByText(i18n.t(`dashboard.kpi.${key}`)),
      ).toBeInTheDocument();
    }
    expect(container).toHaveTextContent('$124.580,42');
    expect(container).toHaveTextContent('$114.742,00');
    expect(container).toHaveTextContent('$9.838,42');
    expect(container).toHaveTextContent('412,90');
  });

  it('draws a falling sparkline when the day change is negative', async () => {
    const { kpis } = await fetchDashboardSummary();
    const { container } = render(
      <DashboardKpis
        kpis={{ ...kpis, dayChange: '-10.00', realizedPnl: '5.00' }}
      />,
    );

    const strokes = [...container.querySelectorAll('polyline')].map((line) =>
      line.getAttribute('stroke'),
    );
    expect(strokes).toEqual(['var(--neg)', 'var(--pos)']);
  });
});

describe('MoversCard', () => {
  it('lists each asset with its type and profit or loss', async () => {
    const { gainers } = await fetchDashboardSummary();
    render(<MoversCard title="Kazandıranlar" movers={gainers} />);

    expect(
      screen.getByRole('heading', { name: 'Kazandıranlar' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText(i18n.t('assetTypes.GOLD'))).toBeInTheDocument();
  });
});

describe('RecentTransactions', () => {
  it('renders a table and a card list with quantities in the right units', async () => {
    const { recentTransactions } = await fetchDashboardSummary();
    render(
      <MemoryRouter>
        <RecentTransactions transactions={recentTransactions} />
      </MemoryRouter>,
    );

    expect(screen.getAllByText('Çeyrek altın')).toHaveLength(2);
    expect(screen.getAllByText(/2 adet/)).toHaveLength(2);
    expect(screen.getAllByText(/10 gr/)).toHaveLength(2);
    expect(screen.getAllByText(/0,0500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/—/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('link', { name: i18n.t('dashboard.recent.viewAll') }),
    ).toHaveAttribute('href', '/islemler');
  });
});

describe('ChartTooltip', () => {
  const labels = { value: 'Değer', cost: 'Maliyet' };

  it('renders nothing while inactive or without data', () => {
    const { container, rerender } = render(
      <ChartTooltip seriesLabels={labels} active={false} payload={[]} />,
    );
    expect(container).toBeEmptyDOMElement();

    rerender(<ChartTooltip seriesLabels={labels} active />);
    expect(container).toBeEmptyDOMElement();

    rerender(<ChartTooltip seriesLabels={labels} active payload={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows the date and one formatted row per series', () => {
    render(
      <ChartTooltip
        seriesLabels={labels}
        active
        label="2026-09-19"
        payload={[
          { dataKey: 'value', value: 124580.42, color: 'red' },
          { dataKey: 'cost', value: '109870', color: 'gray' },
        ]}
      />,
    );

    expect(screen.getByText('19 Eyl 2026')).toBeInTheDocument();
    expect(screen.getByText('Değer')).toBeInTheDocument();
    expect(screen.getByText('$124.580,42')).toBeInTheDocument();
    expect(screen.getByText('$109.870,00')).toBeInTheDocument();
  });
});

describe('PriceStatus', () => {
  it('shows when prices were last updated', () => {
    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <PriceStatus updatedAt="2026-09-21T11:05:00.000Z" />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Son fiyat güncellemesi/)).toBeInTheDocument();
  });

  it('refreshes every dashboard query on demand', async () => {
    const client = createTestQueryClient();
    const spy = vi.spyOn(client, 'invalidateQueries');
    render(
      <QueryClientProvider client={client}>
        <PriceStatus updatedAt="2026-09-21T11:05:00.000Z" />
      </QueryClientProvider>,
    );

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('dashboard.refresh') }),
    );

    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['holdings'] });
  });

  it('shows a loading state while dashboard data is being fetched', async () => {
    const client = createTestQueryClient();
    void client.prefetchQuery({
      queryKey: ['dashboard', 'slow'],
      queryFn: () => new Promise(() => undefined),
    });
    render(
      <QueryClientProvider client={client}>
        <PriceStatus updatedAt="2026-09-21T11:05:00.000Z" />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: i18n.t('dashboard.refresh') }),
      ).toHaveClass('ant-btn-loading');
    });
  });
});

describe('DashboardSkeleton', () => {
  it('announces that content is loading', () => {
    render(<DashboardSkeleton />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });
});
