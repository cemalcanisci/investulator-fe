import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { StrategiesPage } from '@/pages/Strategies/StrategiesPage';
import { createStrategyService, strategyService } from '@/services/strategies';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';

async function table(): Promise<HTMLElement> {
  return screen.findByRole('table', { name: i18n.t('strategies.listTitle') });
}

describe('StrategiesPage', () => {
  it('clears a selected group on its second click and keeps other filters', async () => {
    renderWithProviders(<StrategiesPage />);
    await table();
    const group = screen.getByRole('button', { name: /BIST Temettü 10/ });
    await userEvent.click(group);
    expect(group).toHaveAttribute('aria-pressed', 'true');
    expect(within(await table()).getAllByRole('row')).toHaveLength(11);
    await userEvent.click(group);
    expect(group).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.getByRole('combobox', { name: i18n.t('strategies.chooseGroup') }),
    ).toHaveValue('ALL');
    expect(within(await table()).getAllByRole('row')).toHaveLength(26);
    await userEvent.type(
      screen.getByRole('textbox', { name: i18n.t('strategies.search') }),
      'TUPRS',
    );
    await userEvent.click(group);
    await userEvent.click(group);
    expect(within(await table()).getAllByRole('row')).toHaveLength(2);
    expect(
      within(await table()).getByRole('link', { name: 'TUPRS' }),
    ).toHaveAttribute('href', '/takip/watch-bist-tuprs');
  });
  beforeEach(() => {
    const service = createStrategyService();
    vi.spyOn(strategyService, 'fetch').mockImplementation(service.fetch);
    vi.spyOn(strategyService, 'execute').mockImplementation(service.execute);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows 25 candidates, loading, honest data gaps and disabled analysis actions', async () => {
    renderWithProviders(<StrategiesPage />);
    expect(screen.getByRole('status')).toHaveTextContent(
      i18n.t('common.loading'),
    );
    const list = await table();
    expect(within(list).getAllByRole('row')).toHaveLength(26);
    expect(screen.getByText(i18n.t('strategies.demoHint'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('strategies.refreshAll') }),
    ).toBeDisabled();
    expect(
      within(list)
        .getAllByRole('button', { name: i18n.t('strategies.refreshAsset') })
        .every((button) => button.hasAttribute('disabled')),
    ).toBe(true);
  });

  it('filters by group, type and search; clears no-results state', async () => {
    renderWithProviders(<StrategiesPage />);
    const list = await table();
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: i18n.t('strategies.chooseGroup') }),
      'bist-dividend',
    );
    expect(within(list).getAllByRole('row')).toHaveLength(11);
    await userEvent.type(
      screen.getByRole('textbox', { name: i18n.t('strategies.search') }),
      'TUPRS',
    );
    expect(within(list).getAllByRole('row')).toHaveLength(2);
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: i18n.t('strategies.chooseType') }),
      'CRYPTO',
    );
    expect(
      screen.getByText(i18n.t('strategies.noResults')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.clearFilters') }),
    );
    expect(within(await table()).getAllByRole('row')).toHaveLength(26);
  });

  it('creates and edits a group with optional targets then deletes it with confirmation', async () => {
    renderWithProviders(<StrategiesPage />);
    await table();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.newGroup') }),
    );
    let modal = await screen.findByRole('dialog');
    await userEvent.type(
      within(modal).getByLabelText(i18n.t('strategies.form.name')),
      'BIST Büyüme',
    );
    await userEvent.type(
      within(modal).getByLabelText(i18n.t('strategies.form.weight')),
      '25,50',
    );
    await userEvent.type(
      within(modal).getByLabelText(i18n.t('strategies.form.count')),
      '12',
    );
    await userEvent.click(
      within(modal).getByRole('button', { name: i18n.t('common.save') }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /BIST Büyüme 0/ }),
    );
    expect(
      screen.getByText(i18n.t('strategies.emptyList')),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.editGroup') }),
    );
    modal = await screen.findByRole('dialog');
    const name = within(modal).getByLabelText(i18n.t('strategies.form.name'));
    await userEvent.clear(name);
    await userEvent.type(name, 'Growth');
    await userEvent.click(
      within(modal).getByRole('button', { name: i18n.t('common.save') }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(screen.getByRole('heading', { name: 'Growth' })).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.deleteGroup') }),
    );
    modal = await screen.findByRole('dialog');
    await userEvent.click(
      within(modal).getByRole('button', { name: i18n.t('common.remove') }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Growth' }),
      ).not.toBeInTheDocument(),
    );
    expect(within(await table()).getAllByRole('row')).toHaveLength(26);
  });

  it('adds the same asset to another group and removes only that membership', async () => {
    renderWithProviders(<StrategiesPage />);
    await table();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.addAsset') }),
    );
    const modal = await screen.findByRole('dialog');
    await userEvent.selectOptions(
      within(modal).getByRole('combobox'),
      'crypto-watch',
    );
    await userEvent.type(within(modal).getByRole('textbox'), 'TUPRS');
    await userEvent.click(
      within(modal).getByRole('button', {
        name: i18n.t('strategies.addAssetLabel', { symbol: 'TUPRS' }),
      }),
    );
    expect(
      await within(modal).findByRole('button', {
        name: i18n.t('strategies.alreadyAddedLabel', { symbol: 'TUPRS' }),
      }),
    ).toBeDisabled();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    const list = await table();
    expect(within(list).getAllByRole('row')).toHaveLength(26);
    await userEvent.click(
      within(list).getByRole('button', {
        name: i18n.t('strategies.removeLabel', {
          symbol: 'TUPRS',
          group: 'Kripto Takip',
        }),
      }),
    );
    const confirm = await screen.findByRole('dialog');
    await userEvent.click(
      within(confirm).getByRole('button', { name: i18n.t('common.remove') }),
    );
    await waitFor(() =>
      expect(
        within(list).queryByRole('button', {
          name: i18n.t('strategies.removeLabel', {
            symbol: 'TUPRS',
            group: 'Kripto Takip',
          }),
        }),
      ).not.toBeInTheDocument(),
    );
    expect(within(list).getByText('TUPRS')).toBeInTheDocument();
  });

  it('keeps invalid forms open and allows cancelling without changes', async () => {
    renderWithProviders(<StrategiesPage />);
    await table();
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('strategies.newGroup') }),
    );
    const modal = await screen.findByRole('dialog');
    await userEvent.type(
      within(modal).getByLabelText(i18n.t('strategies.form.name')),
      'BIST Temettü',
    );
    await userEvent.click(
      within(modal).getByRole('button', { name: i18n.t('common.save') }),
    );
    expect(await within(modal).findByRole('alert')).toHaveTextContent(
      i18n.t('strategies.errors.duplicateGroup'),
    );
    await userEvent.click(
      within(modal).getByRole('button', { name: i18n.t('common.cancel') }),
    );
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('offers retry on load failure and a usable empty state', async () => {
    vi.mocked(strategyService.fetch).mockRejectedValueOnce(
      new Error('offline'),
    );
    vi.mocked(strategyService.fetch).mockResolvedValueOnce({
      groups: [],
      assets: [],
      memberships: [],
    });
    renderWithProviders(<StrategiesPage />);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      i18n.t('common.loadError'),
    );
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );
    expect(
      await screen.findByText(i18n.t('strategies.emptyGroups')),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: i18n.t('strategies.addAsset') }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: i18n.t('strategies.newGroup') }),
    ).toBeEnabled();
  });

  it('renders English UI and exposes the mobile list', async () => {
    await i18n.changeLanguage('en');
    renderWithProviders(<StrategiesPage />);
    await table();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Strategies and Watchlist',
      }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'My watchlist' })).getAllByRole(
        'listitem',
      ),
    ).toHaveLength(25);
  });
});
