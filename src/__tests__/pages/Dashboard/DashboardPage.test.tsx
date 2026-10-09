import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import * as dashboardService from '@/services/dashboard';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

describe('DashboardPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading skeleton first, then the dashboard', async () => {
    renderWithProviders(<DashboardPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      await screen.findByText(i18n.t('dashboard.kpi.totalValue')),
    ).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows every dashboard section', async () => {
    renderWithProviders(<DashboardPage />);
    await screen.findByText(i18n.t('dashboard.kpi.totalValue'));

    for (const heading of [
      i18n.t('dashboard.portfolioChart.title'),
      i18n.t('dashboard.allocation.title'),
      i18n.t('dashboard.movers.gainers'),
      i18n.t('dashboard.movers.losers'),
      i18n.t('dashboard.recent.title'),
    ]) {
      expect(
        screen.getByRole('heading', { name: heading }),
      ).toBeInTheDocument();
    }
    expect(screen.getByText(/Son fiyat güncellemesi/)).toBeInTheDocument();
  });

  it('shows every amount and the chart axis in liras when that currency was chosen', async () => {
    localStorage.setItem('inv-currency', 'TRY');
    const { container } = renderWithProviders(<DashboardPage />);

    // Total cost: $114,742.00 at 41.25 lira per dollar.
    await waitFor(() => {
      expect(container).toHaveTextContent('₺4.733.107,50');
    });
    await waitFor(() => {
      // Round tick values in liras (₺4.500.000), not converted dollar ticks.
      expect(container.querySelector('figure')).toHaveTextContent(
        /₺\d\.\d{2}0\.000/,
      );
    });
    // Recorded transactions are facts and keep the currency they were paid in: a dollar sale and a
    // lira purchase, whatever the display currency is.
    expect(container).toHaveTextContent('$2.150,00');
    expect(container).toHaveTextContent('₺20.140,00');
  });

  it('lets the user retry after a failed load', async () => {
    vi.spyOn(dashboardService, 'fetchDashboardSummary').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<DashboardPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      i18n.t('common.loadError'),
    );
    expect(
      screen.queryByText(/Son fiyat güncellemesi/),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );

    expect(
      await screen.findByText(i18n.t('dashboard.kpi.totalValue')),
    ).toBeInTheDocument();
  });
});
