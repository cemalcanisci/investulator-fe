import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { i18n } from '@/i18n';
import { TransactionsPage } from '@/pages/Transactions/TransactionsPage';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import * as service from '@/services/transactions';

const t = i18n.t.bind(i18n);

describe('TransactionsPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('loads, paginates, sorts and filters the ledger', async () => {
    renderWithProviders(<TransactionsPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    const table = await screen.findByRole('table');
    expect(table.querySelectorAll('tbody tr')).toHaveLength(25);
    await userEvent.click(screen.getByRole('button', { name: /Daha fazla/ }));
    expect(table.querySelectorAll('tbody tr')).toHaveLength(33);
    const date = within(table).getByRole('button', {
      name: t('transactions.table.date'),
    });
    await userEvent.click(date);
    expect(table.querySelector('tbody tr')).toHaveTextContent('NVIDIA');
    await userEvent.click(date);
    expect(table.querySelector('tbody tr')).toHaveTextContent('Çeyrek altın');
    await userEvent.selectOptions(
      screen.getByRole('combobox', {
        name: t('transactions.filter.assetType'),
      }),
      'CRYPTO',
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: t('transactions.filter.platform') }),
      'Binance',
    );
    await userEvent.click(screen.getByRole('button', { name: /^Satış/ }));
    expect(table.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(table).toHaveTextContent('Bitcoin');
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: t('transactions.filter.period') }),
      'CUSTOM',
    );
    fireEvent.change(screen.getByLabelText(t('transactions.filter.from')), {
      target: { value: '2026-09-18' },
    });
    expect(
      screen.getByText(t('transactions.noResults.title')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.noResults.clear') }),
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: t('transactions.search.label') }),
      'zzzzz',
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('cancels and restores a row through the actual service', async () => {
    renderWithProviders(<TransactionsPage />);
    const table = await screen.findByRole('table');
    const row = table.querySelector('tbody tr');
    if (!(row instanceof HTMLElement)) {
      throw new Error('Missing row');
    }
    await userEvent.click(
      within(row).getByRole('button', {
        name: t('transactions.actions.cancelFor', { asset: 'Çeyrek altın' }),
      }),
    );
    const dialog = await screen.findByRole('dialog');
    await userEvent.type(
      within(dialog).getByLabelText(t('transactions.cancelDialog.reason')),
      ' Test reason ',
    );
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: t('transactions.cancelDialog.confirm'),
      }),
    );
    expect(
      await screen.findByText(t('transactions.status.cancelled')),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole('switch'));
    await userEvent.click(
      within(table).getByRole('button', {
        name: t('transactions.actions.restoreFor', { asset: 'Çeyrek altın' }),
      }),
    );
    expect(
      await screen.findByText(t('transactions.status.restored')),
    ).toBeInTheDocument();
  });

  it('opens the new form from the URL and closes it', async () => {
    renderWithProviders(<TransactionsPage />, '/islemler?yeni=1');
    const dialog = await screen.findByRole('dialog');
    await userEvent.click(
      within(dialog).getByRole('button', { name: t('transactions.form.save') }),
    );
    expect(
      await within(dialog).findByText(
        t('transactions.form.errors.assetRequired'),
      ),
    ).toBeInTheDocument();
    await userEvent.click(
      within(dialog).getByRole('button', {
        name: t('transactions.form.cancel'),
      }),
    );
  });

  it('offers a first transaction for an empty ledger', async () => {
    vi.spyOn(service, 'fetchTransactions').mockResolvedValue([]);
    renderWithProviders(<TransactionsPage />);
    await userEvent.click(
      await screen.findByRole('button', { name: t('transactions.empty.add') }),
    );
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('retries after a loading error', async () => {
    vi.spyOn(service, 'fetchTransactions').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<TransactionsPage />);
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: t('common.retryButton') }),
    );
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
