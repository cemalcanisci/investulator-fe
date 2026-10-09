import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CurrencyNote } from '@/components/CurrencyNote/CurrencyNote';
import { CurrencySwitcher } from '@/components/CurrencySwitcher/CurrencySwitcher';
import { i18n } from '@/i18n';
import * as fxService from '@/services/fx';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

function renderSwitcher(): void {
  renderWithProviders(
    <>
      <CurrencySwitcher />
      <CurrencyNote />
    </>,
  );
}

function group(): HTMLElement {
  return screen.getByRole('radiogroup', { name: i18n.t('currency.label') });
}

function radio(name: string): HTMLElement {
  return within(group()).getByRole('radio', { name });
}

// antd turns pointer events off on the radio input itself; users click its label.
function label(name: string): HTMLElement {
  return within(group()).getByText(name);
}

describe('CurrencySwitcher', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('offers dollars and liras, dollars first', async () => {
    renderSwitcher();
    await waitFor(() => {
      expect(radio('TRY')).toBeEnabled();
    });

    expect(within(group()).getAllByRole('radio')).toHaveLength(2);
    expect(radio('USD')).toBeChecked();
  });

  it('switches to liras and explains the conversion', async () => {
    renderSwitcher();
    expect(screen.queryByText(/güncel kurla/)).not.toBeInTheDocument();
    await waitFor(() => {
      expect(radio('TRY')).toBeEnabled();
    });

    await userEvent.click(label('TRY'));

    expect(radio('TRY')).toBeChecked();
    expect(screen.getByText(/1 \$ = ₺41,25/)).toBeInTheDocument();

    await userEvent.click(label('USD'));

    expect(screen.queryByText(/güncel kurla/)).not.toBeInTheDocument();
  });

  it('disables liras and says why while there is no exchange rate', async () => {
    const fetchRate = vi
      .spyOn(fxService, 'fetchUsdTryRate')
      .mockRejectedValue(new Error('offline'));
    renderSwitcher();

    await waitFor(() => {
      expect(fetchRate).toHaveBeenCalled();
    });

    expect(radio('TRY')).toBeDisabled();
    expect(
      screen.getByTitle(i18n.t('currency.rateUnavailable')),
    ).toBeInTheDocument();
  });
});
