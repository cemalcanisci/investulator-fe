import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppShell } from '@/components/AppShell/AppShell';
import { i18n } from '@/i18n';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';

function renderShell(route = '/'): void {
  renderWithProviders(
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<p>dashboard page</p>} />
        <Route path="/islemler" element={<p>transactions page</p>} />
        <Route path="/temel" element={<p>foundations page</p>} />
      </Route>
    </Routes>,
    route,
  );
}

describe('AppShell', () => {
  it('renders the page inside the frame with the main and mobile navigation', () => {
    renderShell();

    expect(screen.getByText('dashboard page')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: i18n.t('nav.label') }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: i18n.t('nav.mobileLabel') }),
    ).toBeInTheDocument();
  });

  it('links to every section of the app from the sidebar', () => {
    renderShell();
    const sidebar = screen.getByRole('navigation', {
      name: i18n.t('nav.label'),
    });

    for (const key of [
      'dashboard',
      'holdings',
      'transactions',
      'analysis',
      'importExport',
    ]) {
      expect(
        within(sidebar).getByRole('link', { name: i18n.t(`nav.${key}`) }),
      ).toBeInTheDocument();
    }
  });

  it('marks the current page in the navigation', () => {
    renderShell('/islemler');
    const sidebar = screen.getByRole('navigation', {
      name: i18n.t('nav.label'),
    });

    expect(
      within(sidebar).getByRole('link', { name: i18n.t('nav.transactions') }),
    ).toHaveAttribute('aria-current', 'page');
    expect(
      within(sidebar).getByRole('link', { name: i18n.t('nav.dashboard') }),
    ).not.toHaveAttribute('aria-current');
  });

  it('opens the menu drawer and navigates from it', async () => {
    renderShell();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('nav.openMenu') }),
    );
    const navs = await screen.findAllByRole('navigation', {
      name: i18n.t('nav.label'),
    });
    expect(navs).toHaveLength(2);

    await userEvent.click(
      within(navs[1]).getByRole('link', { name: i18n.t('nav.transactions') }),
    );

    expect(await screen.findByText('transactions page')).toBeInTheDocument();
  });

  it('opens the same drawer from the "more" tab on small screens', async () => {
    renderShell();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('nav.more') }),
    );

    expect(
      await screen.findAllByRole('navigation', { name: i18n.t('nav.label') }),
    ).toHaveLength(2);
  });

  it('goes to the transactions page from the add-investment button', async () => {
    renderShell();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('nav.addInvestment') }),
    );

    expect(await screen.findByText('transactions page')).toBeInTheDocument();
  });

  it('has an add-investment shortcut in the mobile tab bar', () => {
    renderShell();
    const tabs = screen.getByRole('navigation', {
      name: i18n.t('nav.mobileLabel'),
    });

    expect(
      within(tabs).getByRole('link', { name: i18n.t('nav.addInvestment') }),
    ).toHaveAttribute('href', '/islemler?yeni=1');
  });

  it('changes theme and language from the appearance menu', async () => {
    renderShell();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('appearance.title') }),
    );
    await userEvent.click(await screen.findByText(i18n.t('theme.dark')));
    expect(document.documentElement.dataset.theme).toBe('dark');

    await userEvent.click(screen.getByText('English'));
    await waitFor(() => {
      expect(i18n.language).toBe('en');
    });
  });

  it('switches the currency from the header', async () => {
    renderShell();
    const group = screen.getByRole('radiogroup', {
      name: i18n.t('currency.label'),
    });
    await waitFor(() => {
      expect(within(group).getByRole('radio', { name: 'TRY' })).toBeEnabled();
    });

    await userEvent.click(within(group).getByText('TRY'));

    expect(within(group).getByRole('radio', { name: 'TRY' })).toBeChecked();
    expect(localStorage.getItem('inv-currency')).toBe('TRY');
  });

  it('links to the design foundations from the appearance menu', async () => {
    renderShell();

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('appearance.title') }),
    );

    expect(
      await screen.findByRole('link', {
        name: i18n.t('appearance.foundations'),
      }),
    ).toHaveAttribute('href', '/temel');
  });
});
