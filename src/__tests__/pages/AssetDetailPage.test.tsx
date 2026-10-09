import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from '@/App';
import { assetDetailPath, ROUTE_PATHS } from '@/app/routePaths';
import { AssetDetailPage } from '@/pages/AssetDetail/AssetDetailPage';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import * as holdingsService from '@/services/holdings';
import * as transactionsService from '@/services/transactions';
import { HOLDINGS } from '@/services/mockPortfolio';

function renderDetail(id = 'btc'): void {
  renderWithProviders(
    <Routes>
      <Route path={ROUTE_PATHS.assetDetail} element={<AssetDetailPage />} />
    </Routes>,
    assetDetailPath(id),
  );
}

describe('AssetDetailPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the selected position and only its history, and reverses chronology', async () => {
    renderDetail();
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Bitcoin' }),
    ).toBeInTheDocument();
    const list = await screen.findByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    const dates = [...list.querySelectorAll('time')].map(
      (item) => item.dateTime,
    );
    expect(dates).toEqual([...dates].sort().reverse());
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'İşlem sırası' }),
      'asc',
    );
    expect(
      [...list.querySelectorAll('time')].map((item) => item.dateTime),
    ).toEqual([...dates].sort());
    expect(screen.getByText('Gerçekleşmemiş kâr / zarar')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'İşlemleri yönet' }),
    ).toHaveAttribute('href', '/islemler?varlik=btc');
    expect(screen.queryByText('Ethereum')).not.toBeInTheDocument();
  });

  it('can reveal cancelled transactions without treating them as active', async () => {
    renderDetail('eth');
    await screen.findByRole('heading', { name: 'Ethereum' });
    expect(screen.queryByText('İptal edildi')).not.toBeInTheDocument();
    const before = (await screen.findByRole('list')).querySelectorAll(
      'li',
    ).length;
    await userEvent.click(screen.getByRole('switch'));
    expect(screen.getByRole('list').querySelectorAll('li')).toHaveLength(
      before + 1,
    );
    expect(screen.getByText('İptal edildi')).toBeInTheDocument();
  });

  it('offers a way back for an unknown asset', async () => {
    renderDetail('missing');
    expect(await screen.findByText('Varlık bulunamadı')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Yatırımlarıma dön' }),
    ).toHaveAttribute('href', ROUTE_PATHS.holdings);
  });

  it('retries position loading after an error', async () => {
    vi.spyOn(holdingsService, 'fetchHoldings').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderDetail();
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: /Tekrar/ }));
    expect(
      await screen.findByRole('heading', { name: 'Bitcoin' }),
    ).toBeInTheDocument();
  });

  it('keeps the position visible when history fails and retries history', async () => {
    vi.spyOn(transactionsService, 'fetchTransactions').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderDetail();
    expect(
      await screen.findByRole('heading', { name: 'Bitcoin' }),
    ).toBeInTheDocument();
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: /Tekrar/ }));
    expect(await screen.findByRole('list')).toBeInTheDocument();
  });

  it('shows unavailable values honestly and handles an empty history', async () => {
    const first = HOLDINGS[0];
    if (first === undefined) {
      throw new Error('Missing fixture');
    }
    vi.spyOn(holdingsService, 'fetchHoldings').mockResolvedValue({
      holdings: [
        {
          ...first,
          id: 'btc',
          priceStatus: 'UNAVAILABLE',
          currentPricePerUnit: null,
          value: null,
          pnl: null,
          pnlPercent: null,
          priceUpdatedAt: null,
        },
      ],
      pricesUpdatedAt: '',
    });
    vi.spyOn(transactionsService, 'fetchTransactions').mockResolvedValue([]);
    renderDetail();
    expect(
      await screen.findByText('Gösterilecek işlem yok'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Güncel fiyat alınamadığı için/),
    ).toBeInTheDocument();
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(3);
  });

  it('navigates from holdings to a detail and its exact transaction scope', async () => {
    renderWithProviders(<App />, ROUTE_PATHS.holdings);
    const links = await screen.findAllByRole('link', { name: 'Bitcoin' });
    const link = links[0];
    if (link === undefined) {
      throw new Error('Missing link');
    }
    await userEvent.click(link);
    await userEvent.click(
      await screen.findByRole('link', { name: 'İşlemleri yönet' }),
    );
    const table = await screen.findByRole('table');
    expect(table.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(screen.getByText('Varlık: Bitcoin')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: 'Tüm işlemleri göster' }),
    );
    expect(table.querySelectorAll('tbody tr')).toHaveLength(25);
  });

  it('formats FX positions and their history', async () => {
    renderDetail('eur');
    expect(
      await screen.findByRole('heading', { name: 'Euro' }),
    ).toBeInTheDocument();
    expect(await screen.findByRole('list')).toBeInTheDocument();
  });
});
