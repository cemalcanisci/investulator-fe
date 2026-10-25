import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResearchTransfer } from '@/components/Strategies/ResearchTransfer';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';

describe('research transfer menus', () => {
  afterEach(() => vi.restoreAllMocks());
  it.each(['tr', 'en'])(
    'offers only XLSX and explicit export scopes in %s',
    async (language) => {
      await i18n.changeLanguage(language);
      renderWithProviders(<ResearchTransfer />);
      await userEvent.click(
        screen.getByRole('button', { name: i18n.t('researchTransfer.export') }),
      );
      await userEvent.click(
        await screen.findByRole('menuitem', { name: 'Excel (.xlsx)' }),
      );
      const dialog = await screen.findByRole('dialog');
      for (const key of ['template', 'all', 'selected']) {
        expect(
          within(dialog).getByRole('button', {
            name: i18n.t(`researchTransfer.${key}`),
          }),
        ).toBeVisible();
      }
      expect(
        within(dialog).getByText(i18n.t('researchTransfer.persistence')),
      ).toBeVisible();
    },
  );
  it('retains the card removal callback inside the menu', async () => {
    const remove = vi.fn<() => void>();
    renderWithProviders(
      <ResearchTransfer
        assetId="watch-bist-tuprs"
        removeItems={[
          { key: 'remove', label: 'Remove fixture', onClick: remove },
        ]}
      />,
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: `${i18n.t('researchTransfer.actions')} watch-bist-tuprs`,
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Remove fixture' }),
    );
    expect(remove).toHaveBeenCalledOnce();
  });
  it('does not offer an apply action before a validated preview', async () => {
    renderWithProviders(<ResearchTransfer assetId="watch-bist-tuprs" />);
    await userEvent.click(
      screen.getByRole('button', {
        name: `${i18n.t('researchTransfer.actions')} watch-bist-tuprs`,
      }),
    );
    await userEvent.click(
      await screen.findByRole('menuitem', {
        name: i18n.t('researchTransfer.cardImport'),
      }),
    );
    const dialog = await screen.findByRole('dialog');
    expect(
      within(dialog).queryByRole('button', {
        name: i18n.t('researchTransfer.apply'),
      }),
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByText(
        i18n.t('researchTransfer.scope', { assetId: 'watch-bist-tuprs' }),
      ),
    ).toBeVisible();
  });
});
