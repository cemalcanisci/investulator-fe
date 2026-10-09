import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeSwitcher } from '@/components/ThemeSwitcher/ThemeSwitcher';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

describe('ThemeSwitcher', () => {
  it('offers the three themes with the default one selected', () => {
    renderWithProviders(<ThemeSwitcher />);

    expect(screen.getByRole('radio', { name: 'Varsayılan' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Açık' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Koyu' })).not.toBeChecked();
  });

  it('switches the theme when an option is chosen', async () => {
    renderWithProviders(<ThemeSwitcher />);

    await userEvent.click(screen.getByText('Koyu'));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('radio', { name: 'Koyu' })).toBeChecked();
  });
});
