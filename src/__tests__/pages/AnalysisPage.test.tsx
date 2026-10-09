import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnalysisPage } from '@/pages/Analysis/AnalysisPage';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { UNAVAILABLE_HOLDING } from '@/__tests__/utils/fixtures';
import * as service from '@/services/holdings';

describe('AnalysisPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('loads allocation and performance, filters losers and links to details', async () => {
    renderWithProviders(<AnalysisPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Varlık performansı' });
    expect(
      screen.getByRole('heading', { name: 'Varlık türüne göre kâr / zarar' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Bitcoin' })).toHaveAttribute(
      'href',
      '/yatirimlar/btc',
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Performans filtresi' }),
      'LOSERS',
    );
    expect(screen.getByRole('link', { name: 'Ethereum' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Bitcoin' }),
    ).not.toBeInTheDocument();
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Sıralama ölçütü' }),
      'PERCENT',
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Performans filtresi' }),
      'GAINERS',
    );
    expect(screen.getByRole('link', { name: 'Bitcoin' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Ethereum' }),
    ).not.toBeInTheDocument();
    const graph = screen.getByRole('figure');
    expect(within(graph).getByRole('table')).toBeInTheDocument();
  });

  it('offers the first transaction when there are no holdings', async () => {
    vi.spyOn(service, 'fetchHoldings').mockResolvedValue({
      holdings: [],
      pricesUpdatedAt: '2026-09-21T11:05:00.000Z',
    });
    renderWithProviders(<AnalysisPage />);
    expect(
      await screen.findByText('Analiz için henüz yatırım yok'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      '/islemler?yeni=1',
    );
  });

  it('retries failed requests', async () => {
    vi.spyOn(service, 'fetchHoldings').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<AnalysisPage />);
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));
    expect(
      await screen.findByRole('heading', { name: 'Varlık performansı' }),
    ).toBeInTheDocument();
  });

  it('does not draw a misleading allocation when all prices are unavailable', async () => {
    vi.spyOn(service, 'fetchHoldings').mockResolvedValue({
      holdings: [UNAVAILABLE_HOLDING],
      pricesUpdatedAt: '2026-09-21T11:05:00.000Z',
    });
    renderWithProviders(<AnalysisPage />);
    expect(await screen.findByText('Bu grupta varlık yok')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Varlık türüne göre kâr / zarar' }),
    ).not.toBeInTheDocument();
  });
});
