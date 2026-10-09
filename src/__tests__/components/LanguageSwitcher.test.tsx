import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { i18n } from '@/i18n';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

describe('LanguageSwitcher', () => {
  it('shows both languages with Turkish selected by default', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByRole('radio', { name: 'Türkçe' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'English' })).not.toBeChecked();
  });

  it('switches the application language', async () => {
    renderWithProviders(<LanguageSwitcher />);

    await userEvent.click(screen.getByText('English'));

    await waitFor(() => {
      expect(i18n.language).toBe('en');
    });
    expect(screen.getByRole('radio', { name: 'English' })).toBeChecked();
  });
});
