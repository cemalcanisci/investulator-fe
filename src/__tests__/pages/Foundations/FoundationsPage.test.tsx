import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { i18n } from '@/i18n';
import { FoundationsPage } from '@/pages/Foundations/FoundationsPage';
import { getThemeTokens } from '@/theme/themes';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

describe('FoundationsPage', () => {
  it('shows the title, the color groups and the type specimen', () => {
    renderWithProviders(<FoundationsPage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: i18n.t('foundations.title'),
      }),
    ).toBeInTheDocument();
    for (const group of [
      'surface',
      'text',
      'nav',
      'brand',
      'semantic',
      'chart',
    ]) {
      expect(
        screen.getByRole('heading', {
          name: i18n.t(`foundations.colorGroups.${group}`),
        }),
      ).toBeInTheDocument();
    }
    expect(
      screen.getByRole('heading', { name: i18n.t('foundations.typography') }),
    ).toBeInTheDocument();
  });

  it('lists every token with its value for the active theme', () => {
    renderWithProviders(<FoundationsPage />);

    const card = screen.getByText('--primary').parentElement;
    if (card === null) {
      throw new Error('token card not found');
    }
    expect(
      within(card).getByText(getThemeTokens('default').primary),
    ).toBeInTheDocument();
  });

  it('updates the token values when the theme changes', async () => {
    renderWithProviders(<FoundationsPage />);

    await userEvent.click(screen.getByText(i18n.t('theme.dark')));

    expect(
      screen.getAllByText(getThemeTokens('dark').primary).length,
    ).toBeGreaterThan(0);
    expect(
      screen.queryByText(getThemeTokens('default').primary),
    ).not.toBeInTheDocument();
  });

  it('formats the sample amounts for the active language', async () => {
    renderWithProviders(<FoundationsPage />);
    expect(screen.getByText('$124.580,42')).toBeInTheDocument();

    await userEvent.click(screen.getByText('English'));

    expect(await screen.findByText('$124,580.42')).toBeInTheDocument();
  });
});
