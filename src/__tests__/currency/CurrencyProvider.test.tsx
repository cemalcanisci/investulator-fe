import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { JSX } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CurrencyProvider } from '@/currency/CurrencyProvider';
import { useCurrency } from '@/hooks/useCurrency';
import { useMoney } from '@/hooks/useMoney';
import * as fxService from '@/services/fx';
import { createTestQueryClient } from '@/__tests__/utils/renderWithProviders';

function Probe(): JSX.Element {
  const { currency, setCurrency, usdTryRate } = useCurrency();
  const money = useMoney();

  return (
    <div>
      <p data-testid="currency">{currency}</p>
      <p data-testid="rate">{usdTryRate?.rate ?? 'none'}</p>
      <p data-testid="amount">{money.format('100.00')}</p>
      <button type="button" onClick={() => setCurrency('TRY')}>
        try
      </button>
      <button type="button" onClick={() => setCurrency('USD')}>
        usd
      </button>
    </div>
  );
}

function renderProbe(): void {
  render(
    <QueryClientProvider client={createTestQueryClient()}>
      <CurrencyProvider>
        <Probe />
      </CurrencyProvider>
    </QueryClientProvider>,
  );
}

async function waitForRate(): Promise<void> {
  await waitFor(() => {
    expect(screen.getByTestId('rate')).toHaveTextContent('41.2500');
  });
}

describe('CurrencyProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts in dollars', async () => {
    renderProbe();
    await waitForRate();

    expect(screen.getByTestId('currency')).toHaveTextContent('USD');
    expect(screen.getByTestId('amount')).toHaveTextContent('$100,00');
  });

  it('switches to liras with the exchange rate and remembers the choice', async () => {
    renderProbe();
    await waitForRate();

    await userEvent.click(screen.getByRole('button', { name: 'try' }));

    expect(screen.getByTestId('currency')).toHaveTextContent('TRY');
    expect(screen.getByTestId('amount')).toHaveTextContent('₺4.125,00');
    expect(localStorage.getItem('inv-currency')).toBe('TRY');

    await userEvent.click(screen.getByRole('button', { name: 'usd' }));

    expect(screen.getByTestId('amount')).toHaveTextContent('$100,00');
    expect(localStorage.getItem('inv-currency')).toBe('USD');
  });

  it('restores the stored currency', async () => {
    localStorage.setItem('inv-currency', 'TRY');
    renderProbe();

    await waitFor(() => {
      expect(screen.getByTestId('currency')).toHaveTextContent('TRY');
    });
  });

  it('ignores a stored value it does not know', async () => {
    localStorage.setItem('inv-currency', 'EUR');
    renderProbe();
    await waitForRate();

    expect(screen.getByTestId('currency')).toHaveTextContent('USD');
  });

  it('keeps showing dollars while there is no exchange rate, even if liras were chosen', async () => {
    const fetchRate = vi
      .spyOn(fxService, 'fetchUsdTryRate')
      .mockRejectedValue(new Error('offline'));
    localStorage.setItem('inv-currency', 'TRY');
    renderProbe();

    await waitFor(() => {
      expect(fetchRate).toHaveBeenCalled();
    });

    expect(screen.getByTestId('currency')).toHaveTextContent('USD');
    expect(screen.getByTestId('rate')).toHaveTextContent('none');
    expect(screen.getByTestId('amount')).toHaveTextContent('$100,00');
  });

  it('does not break when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderProbe();
    await waitForRate();

    await userEvent.click(screen.getByRole('button', { name: 'try' }));

    expect(screen.getByTestId('currency')).toHaveTextContent('TRY');
  });
});

describe('without a provider', () => {
  it('shows dollars', () => {
    render(<Probe />);

    expect(screen.getByTestId('currency')).toHaveTextContent('USD');
    expect(screen.getByTestId('amount')).toHaveTextContent('$100,00');
  });
});
