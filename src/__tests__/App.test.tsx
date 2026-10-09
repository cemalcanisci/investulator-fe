import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from '@/App';
import { i18n } from '@/i18n';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

describe('App', () => {
  it('renders the dashboard at the root path', async () => {
    renderWithProviders(<App />, '/');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: i18n.t('dashboard.title'),
      }),
    ).toBeInTheDocument();
  });

  it.each([
    ['/yatirimlar', 'nav.holdings'],
    ['/islemler', 'nav.transactions'],
    ['/analiz', 'nav.analysis'],
    ['/aktar', 'nav.importExport'],
  ])('renders a placeholder page at %s', (path, titleKey) => {
    renderWithProviders(<App />, path);

    expect(
      screen.getByRole('heading', { level: 1, name: i18n.t(titleKey) }),
    ).toBeInTheDocument();
  });

  it('renders the design foundations page at /temel', () => {
    renderWithProviders(<App />, '/temel');

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: i18n.t('foundations.title'),
      }),
    ).toBeInTheDocument();
  });

  it('renders the not-found page inside the frame for an unknown path', () => {
    renderWithProviders(<App />, '/does-not-exist');

    expect(
      screen.getByRole('heading', { name: i18n.t('notFound.title') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: i18n.t('nav.label') }),
    ).toBeInTheDocument();
  });
});
