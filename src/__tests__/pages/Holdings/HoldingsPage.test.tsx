import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { HoldingsPage } from '@/pages/Holdings/HoldingsPage';
import * as holdingsService from '@/services/holdings';
import { HOLDINGS, PRICES_UPDATED_AT } from '@/services/mockPortfolio';
import { UNAVAILABLE_HOLDING } from '@/__tests__/utils/fixtures';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

async function findTable(): Promise<HTMLElement> {
  return screen.findByRole('table', { name: i18n.t('holdings.table.caption') });
}

describe('HoldingsPage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a loading skeleton first, then the totals and the table', async () => {
    renderWithProviders(<HoldingsPage />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    const table = await findTable();

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(within(table).getAllByRole('row')).toHaveLength(16);
    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t('holdings.title') }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Son fiyat güncellemesi/)).toBeInTheDocument();
    expect(screen.getAllByText('$124.580,42').length).toBeGreaterThan(0);
  });

  it('filters by asset type and updates the total row', async () => {
    renderWithProviders(<HoldingsPage />);
    const table = await findTable();

    await userEvent.click(screen.getByRole('button', { name: /Altın/ }));

    expect(within(table).getAllByRole('row')).toHaveLength(5);
    expect(within(table).getByText('Gram altın')).toBeInTheDocument();
    expect(within(table).getByText('Çeyrek altın')).toBeInTheDocument();
    expect(within(table).getByText('Ata altını (tam)')).toBeInTheDocument();
    expect(within(table).queryByText('Bitcoin')).not.toBeInTheDocument();
    expect(within(table).getByText('$24.120,77')).toBeInTheDocument();
  });

  it('searches by name or symbol', async () => {
    renderWithProviders(<HoldingsPage />);
    const table = await findTable();

    await userEvent.type(
      screen.getByRole('textbox', { name: i18n.t('holdings.search.label') }),
      'nvd',
    );

    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByText('NVIDIA')).toBeInTheDocument();
  });

  it('says so when nothing matches and clears the filters on demand', async () => {
    renderWithProviders(<HoldingsPage />);
    await findTable();

    await userEvent.type(
      screen.getByRole('textbox', { name: i18n.t('holdings.search.label') }),
      'zzzz',
    );

    expect(
      screen.getByText(i18n.t('holdings.noResults.title')),
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('holdings.noResults.clear') }),
    );

    expect((await findTable()).querySelectorAll('tbody tr')).toHaveLength(14);
    expect(screen.getByRole('button', { name: /Tümü/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('sorts the list', async () => {
    renderWithProviders(<HoldingsPage />);
    const table = await findTable();
    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Bitcoin');

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Sırala/ }),
      'NAME',
    );

    expect(within(table).getAllByRole('row')[1]).toHaveTextContent('Apple');
  });

  it('keeps holdings without a price out of the totals and says so', async () => {
    vi.spyOn(holdingsService, 'fetchHoldings').mockResolvedValueOnce({
      holdings: [...HOLDINGS, UNAVAILABLE_HOLDING],
      pricesUpdatedAt: PRICES_UPDATED_AT,
    });
    renderWithProviders(<HoldingsPage />);
    await findTable();

    expect(
      screen.getByText('1 yatırımın fiyatı alınamadı; toplamlara dahil değil.'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(i18n.t('holdings.price.UNAVAILABLE')).length,
    ).toBeGreaterThan(0);
  });

  it('offers to add or import investments when there are none yet', async () => {
    vi.spyOn(holdingsService, 'fetchHoldings').mockResolvedValueOnce({
      holdings: [],
      pricesUpdatedAt: PRICES_UPDATED_AT,
    });
    renderWithProviders(
      <Routes>
        <Route path="/" element={<HoldingsPage />} />
        <Route path="/islemler" element={<p>transactions page</p>} />
        <Route path="/aktar" element={<p>import page</p>} />
      </Routes>,
    );

    expect(
      await screen.findByText(i18n.t('holdings.empty.title')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('holdings.empty.add') }),
    );

    expect(await screen.findByText('transactions page')).toBeInTheDocument();
  });

  it('leads to the import page from the empty state', async () => {
    vi.spyOn(holdingsService, 'fetchHoldings').mockResolvedValueOnce({
      holdings: [],
      pricesUpdatedAt: PRICES_UPDATED_AT,
    });
    renderWithProviders(
      <Routes>
        <Route path="/" element={<HoldingsPage />} />
        <Route path="/aktar" element={<p>import page</p>} />
      </Routes>,
    );

    await userEvent.click(
      await screen.findByRole('button', {
        name: i18n.t('holdings.empty.import'),
      }),
    );

    expect(await screen.findByText('import page')).toBeInTheDocument();
  });

  it('sorts by a column header and reverses on the second click', async () => {
    renderWithProviders(<HoldingsPage />);
    const table = await findTable();
    const firstRow = (): HTMLElement => within(table).getAllByRole('row')[1];
    const header = (name: string): HTMLElement =>
      within(table).getByRole('button', { name });

    await userEvent.click(header(i18n.t('holdings.table.asset')));
    expect(firstRow()).toHaveTextContent('Apple');

    await userEvent.click(header(i18n.t('holdings.table.asset')));
    expect(firstRow()).toHaveTextContent('Türk Hava Yolları');

    await userEvent.click(header(i18n.t('holdings.table.value')));
    expect(firstRow()).toHaveTextContent('Bitcoin');

    await userEvent.click(header(i18n.t('holdings.table.value')));
    expect(firstRow()).toHaveTextContent(HOLDINGS.at(-1)?.assetName ?? '');
  });

  it('shows liras when that currency was chosen, converted at the exchange rate', async () => {
    localStorage.setItem('inv-currency', 'TRY');
    renderWithProviders(<HoldingsPage />);
    const table = await findTable();

    // Bitcoin: $22,000.00 at 41.25 lira per dollar.
    expect(await within(table).findByText('₺907.500,00')).toBeInTheDocument();
    expect(table).not.toHaveTextContent('$');
    expect(screen.getByText(/1 \$ = ₺41,25/)).toBeInTheDocument();
  });

  it('lets the user retry after a failed load', async () => {
    vi.spyOn(holdingsService, 'fetchHoldings').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<HoldingsPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      i18n.t('common.loadError'),
    );
    expect(
      screen.queryByText(/Son fiyat güncellemesi/),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );

    expect(await findTable()).toBeInTheDocument();
  });
});
