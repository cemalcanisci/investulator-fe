import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AllocationDonut } from '@/components/Dashboard/AllocationDonut';
import { PortfolioChart } from '@/components/Dashboard/PortfolioChart';
import { i18n } from '@/i18n';
import * as dashboardService from '@/services/dashboard';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

// The legend is the only list in the chart card; the same figures also appear in the sr-only table.
async function findLegend(): Promise<HTMLElement> {
  return screen.findByRole('list');
}

describe('AllocationDonut', () => {
  it('lists every asset type with its share and value', async () => {
    const { allocation } = await dashboardService.fetchDashboardSummary();
    renderWithProviders(<AllocationDonut slices={allocation} />);

    expect(
      screen.getByRole('img', { name: i18n.t('dashboard.allocation.aria') }),
    ).toBeInTheDocument();
    const legend = screen.getByRole('list');
    expect(within(legend).getAllByRole('listitem')).toHaveLength(5);
    expect(
      within(legend).getByText(i18n.t('assetTypes.CRYPTO')),
    ).toBeInTheDocument();
    expect(within(legend).getByText('%30,7')).toBeInTheDocument();
    expect(within(legend).getByText('$38.250,10')).toBeInTheDocument();
  });
});

describe('PortfolioChart', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the latest value and cost in the legend once data has loaded', async () => {
    renderWithProviders(<PortfolioChart />);

    const legend = await findLegend();

    expect(within(legend).getByText('$124.580,42')).toBeInTheDocument();
    expect(within(legend).getByText('$114.742,00')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: i18n.t('dashboard.ranges.1M') }),
    ).toBeChecked();
  });

  it('exposes the plotted data as a table for assistive technology', async () => {
    renderWithProviders(<PortfolioChart />);

    await findLegend();

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(31);
  });

  it('loads a new series when the range changes', async () => {
    const spy = vi.spyOn(dashboardService, 'fetchPortfolioSeries');
    renderWithProviders(<PortfolioChart />);
    await findLegend();

    await userEvent.click(screen.getByText(i18n.t('dashboard.ranges.3M')));

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(14);
    });
    expect(spy).toHaveBeenCalledWith('3M');
  });

  it('uses month and year labels for long ranges', async () => {
    renderWithProviders(<PortfolioChart />);
    await findLegend();

    await userEvent.click(screen.getByText(i18n.t('dashboard.ranges.1Y')));

    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(13);
    });
  });

  it('offers a retry when the series cannot be loaded', async () => {
    vi.spyOn(dashboardService, 'fetchPortfolioSeries').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<PortfolioChart />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      i18n.t('common.loadError'),
    );
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );

    expect(
      within(await findLegend()).getByText('$124.580,42'),
    ).toBeInTheDocument();
  });

  it('treats an empty series as a failure instead of drawing an empty chart', async () => {
    vi.spyOn(dashboardService, 'fetchPortfolioSeries').mockResolvedValueOnce(
      [],
    );
    renderWithProviders(<PortfolioChart />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });
});

describe('chart reporting currency', () => {
  it('uses the selected currency in accessible chart and table descriptions', async () => {
    localStorage.setItem('inv-currency', 'TRY');
    renderWithProviders(<PortfolioChart />);
    await waitFor(() =>
      expect(screen.getByRole('figure')).toHaveAttribute(
        'aria-label',
        i18n.t('dashboard.portfolioChart.aria', { currency: 'TRY' }),
      ),
    );
    expect(
      await screen.findByRole('table', {
        name: i18n.t('dashboard.portfolioChart.tableCaption', {
          currency: 'TRY',
        }),
      }),
    ).toBeInTheDocument();
  });
});
