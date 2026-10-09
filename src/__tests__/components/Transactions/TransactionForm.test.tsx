import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TransactionForm } from '@/components/Transactions/TransactionForm';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';
import * as service from '@/services/transactions';
import * as fx from '@/services/fx';

const t = i18n.t.bind(i18n);

function field(key: string): HTMLElement {
  return screen.getByLabelText(t(`transactions.form.${key}`));
}

async function selectAsset(name: string): Promise<void> {
  const input = screen.getByRole('combobox', {
    name: t('transactions.form.asset'),
  });
  await userEvent.click(input);
  await userEvent.type(input, name);
  await userEvent.click(
    await screen.findByText(name, {
      selector: '.ant-select-item-option-content',
    }),
  );
}

describe('TransactionForm', () => {
  it('fetches a real cash rate when changing a cashless record into a purchase', async () => {
    const original = service.readLedger().find((item) => item.type === 'BONUS');
    if (original === undefined) {
      throw new Error('Missing fixture');
    }
    vi.spyOn(fx, 'fetchRateToUsd').mockResolvedValue('0.025');
    renderWithProviders(
      <TransactionForm
        editing={{ ...original, currency: 'TRY', fxRateToUsd: '1' }}
        transactions={service.readLedger()}
        onClose={vi.fn<() => void>()}
        onSaved={vi.fn<() => void>()}
      />,
    );
    await userEvent.click(screen.getByText(t('transactionTypes.BUY')));
    expect(
      await screen.findByText(
        t('transactions.form.fx.rate', { currency: 'TRY', rate: '0.025' }),
      ),
    ).toBeInTheDocument();
  });
  it('clears old trade amounts and saves a lira bonus without a rate', async () => {
    const saved = vi.fn<() => void>();
    vi.spyOn(fx, 'fetchRateToUsd').mockRejectedValue(new Error('offline'));
    renderWithProviders(
      <TransactionForm
        editing={null}
        transactions={service.readLedger()}
        onClose={vi.fn<() => void>()}
        onSaved={saved}
      />,
    );
    await selectAsset('Gram altın (XAU-G)');
    fireEvent.change(field('quantity'), { target: { value: '100' } });
    fireEvent.change(field('totalAmount'), { target: { value: '10000' } });
    await userEvent.click(screen.getByText(t('transactionTypes.DIVIDEND')));
    expect(field('dividendAmount')).toHaveValue('');
    await userEvent.click(screen.getByText(t('transactionTypes.BONUS')));
    expect(field('bonusQuantity')).toHaveValue('');
    expect(
      screen.queryByLabelText(t('transactions.form.currency')),
    ).not.toBeInTheDocument();
    fireEvent.change(field('bonusQuantity'), { target: { value: '2' } });
    fireEvent.change(field('time'), { target: { value: '09:15' } });
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.save') }),
    );
    await waitFor(() => expect(saved).toHaveBeenCalledWith('created'));
    expect(service.readLedger().at(-1)).toMatchObject({
      type: 'BONUS',
      quantity: '2',
      totalAmount: null,
      executedTime: '09:15',
    });
  });
  afterEach(() => vi.restoreAllMocks());

  it('creates a purchase using two entered amounts and a manual exchange rate', async () => {
    const saved = vi.fn<() => void>();
    renderWithProviders(
      <TransactionForm
        editing={null}
        transactions={service.readLedger()}
        onClose={vi.fn<() => void>()}
        onSaved={saved}
      />,
    );
    await selectAsset('Gram altın (XAU-G)');
    fireEvent.change(field('quantity'), { target: { value: '2' } });
    fireEvent.change(field('totalAmount'), { target: { value: '6000' } });
    expect(field('unitPrice')).toHaveValue('3000.00');
    await userEvent.click(
      await screen.findByRole('button', {
        name: t('transactions.form.fx.edit'),
      }),
    );
    fireEvent.change(
      screen.getByLabelText(
        t('transactions.form.fx.input', { currency: 'TRY' }),
      ),
      { target: { value: '0.025' } },
    );
    fireEvent.change(field('fee'), { target: { value: '10' } });
    fireEvent.change(field('platform'), { target: { value: 'Test platform' } });
    fireEvent.change(field('note'), { target: { value: 'Test purchase' } });
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.save') }),
    );
    await waitFor(() => expect(saved).toHaveBeenCalledWith('created'));
    expect(service.readLedger().at(-1)).toMatchObject({
      assetId: 'xau-g',
      quantity: '2',
      totalAmount: '6000',
      fxRateToUsd: '0.025',
      fxRateSource: 'MANUAL',
      note: 'Test purchase',
      platform: 'Test platform',
    });
  });

  it('preserves an existing rate snapshot on edit and saves through the update hook', async () => {
    const original = service
      .readLedger()
      .find((item) => item.currency === 'TRY' && item.type === 'BUY');
    if (original === undefined) {
      throw new Error('Missing fixture');
    }
    const saved = vi.fn<() => void>();
    const editing = { ...original, fxRateToUsd: '0.03123' };
    renderWithProviders(
      <TransactionForm
        editing={editing}
        transactions={service.readLedger()}
        onClose={vi.fn<() => void>()}
        onSaved={saved}
      />,
    );
    expect(
      await screen.findByText(
        t('transactions.form.fx.rate', { currency: 'TRY', rate: '0.03123' }),
      ),
    ).toBeInTheDocument();
    fireEvent.change(field('note'), { target: { value: 'Updated' } });
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.save') }),
    );
    await waitFor(() => expect(saved).toHaveBeenCalledWith('updated'));
    expect(
      service.readLedger().find((item) => item.id === editing.id),
    ).toMatchObject({ fxRateToUsd: '0.03123', note: 'Updated' });
  });

  it('requires a manual rate when automatic lookup is unavailable and can return to auto', async () => {
    vi.spyOn(fx, 'fetchRateToUsd').mockRejectedValue(new Error('offline'));
    renderWithProviders(
      <TransactionForm
        editing={null}
        transactions={[]}
        onClose={vi.fn<() => void>()}
        onSaved={vi.fn<() => void>()}
      />,
    );
    await selectAsset('Gram altın (XAU-G)');
    expect(
      await screen.findByText(t('transactions.form.fx.unavailable')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.save') }),
    );
    expect(
      screen.getByText(t('transactions.form.errors.rateRequired')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.fx.edit') }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.fx.back') }),
    );
    expect(
      screen.getByText(t('transactions.form.fx.unavailable')),
    ).toBeInTheDocument();
  });

  it('switches corporate action fields and warns about overselling', async () => {
    renderWithProviders(
      <TransactionForm
        editing={null}
        transactions={[]}
        onClose={vi.fn<() => void>()}
        onSaved={vi.fn<() => void>()}
      />,
    );
    await selectAsset('Bitcoin (BTC)');
    await userEvent.click(screen.getByText(t('transactionTypes.SELL')));
    fireEvent.change(field('quantity'), { target: { value: '1' } });
    fireEvent.change(field('totalAmount'), { target: { value: '10' } });
    expect(
      screen.getByText(
        t('transactions.form.errors.insufficientQuantity', { available: '0' }),
      ),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByText(t('transactionTypes.BONUS')));
    fireEvent.change(field('bonusQuantity'), { target: { value: '5' } });
    expect(
      screen.queryByLabelText(t('transactions.form.unitPrice')),
    ).not.toBeInTheDocument();
    await userEvent.click(screen.getByText(t('transactionTypes.SPLIT')));
    fireEvent.change(field('splitRatio'), { target: { value: '2' } });
    await userEvent.click(screen.getByText(t('transactionTypes.DIVIDEND')));
    fireEvent.change(field('dividendAmount'), { target: { value: '20' } });
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: t('transactions.form.currency') }),
      'TRY',
    );
    expect(
      await screen.findByRole('button', {
        name: t('transactions.form.fx.edit'),
      }),
    ).toBeInTheDocument();
  });

  it('reports a server rejection without reporting success', async () => {
    const original = service.readLedger().find((item) => item.type === 'BUY');
    if (original === undefined) {
      throw new Error('Missing fixture');
    }
    vi.spyOn(service, 'updateTransaction').mockRejectedValue(
      new Error('offline'),
    );
    const saved = vi.fn<() => void>();
    renderWithProviders(
      <TransactionForm
        editing={original}
        transactions={service.readLedger()}
        onClose={vi.fn<() => void>()}
        onSaved={saved}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', { name: t('transactions.form.save') }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      t('transactions.form.saveError'),
    );
    expect(saved).not.toHaveBeenCalled();
  });
});
