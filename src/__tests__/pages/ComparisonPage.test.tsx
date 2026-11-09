import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ComparisonPage } from '@/pages/Comparison/ComparisonPage';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';

describe('ComparisonPage', () => {
  it('lists all ten covered companies with a link to their full research', () => {
    renderWithProviders(<ComparisonPage />);

    for (const symbol of [
      'TUPRS',
      'DOAS',
      'FROTO',
      'TOASO',
      'TTRAK',
      'ISMEN',
      'YGGYO',
      'AKSA',
      'AKMGY',
      'PAGYO',
    ]) {
      expect(
        screen.getByRole('heading', { level: 3, name: symbol }),
      ).toBeInTheDocument();
    }
    const tuprsDetailLinks = screen.getAllByRole('link', {
      name: i18n.t('companyComparison.card.detailLink'),
    });
    expect(
      tuprsDetailLinks.some(
        (link) => link.getAttribute('href') === '/takip/watch-bist-tuprs',
      ),
    ).toBe(true);
  });

  it('states up front that no single score or price target is produced', () => {
    renderWithProviders(<ComparisonPage />);

    expect(
      screen.getByText(i18n.t('companyComparison.intro.noSingleScore')),
    ).toBeInTheDocument();
    expect(
      screen.getByText(i18n.t('companyComparison.intro.valuationCaution')),
    ).toBeInTheDocument();
  });

  it('groups the automotive peers for valuation but keeps the refiner alone', () => {
    renderWithProviders(<ComparisonPage />);

    const automotiveHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.profiles.AUTOMOTIVE')} · ${i18n.t('research.metrics.evEbitda')}`,
    });
    const automotiveGroup = automotiveHeading.closest('div');
    if (!automotiveGroup) {
      throw new Error('fixture');
    }
    for (const symbol of ['DOAS', 'FROTO', 'TOASO', 'TTRAK']) {
      expect(
        within(automotiveGroup).getAllByRole('link', { name: symbol }),
      ).not.toHaveLength(0);
    }
    expect(
      within(automotiveGroup).queryAllByRole('link', { name: 'TUPRS' }),
    ).toHaveLength(0);

    const refiningHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.profiles.REFINING')} · ${i18n.t('research.metrics.evEbitda')}`,
    });
    const refiningGroup = refiningHeading.closest('div');
    if (!refiningGroup) {
      throw new Error('fixture');
    }
    expect(
      within(refiningGroup).getByText(
        i18n.t('companyComparison.valuationGroups.single'),
      ),
    ).toBeInTheDocument();
  });

  it('separates the three fully blocked REITs from the seven NEEDS_REVIEW companies in the closing summary', () => {
    renderWithProviders(<ComparisonPage />);

    const blockedHeading = screen.getByRole('heading', {
      name: i18n.t('companyComparison.closing.blockedHeading'),
    });
    const blockedSection = blockedHeading.parentElement;
    if (!blockedSection) {
      throw new Error('fixture');
    }
    for (const symbol of ['TTRAK', 'AKMGY', 'YGGYO']) {
      expect(
        within(blockedSection).getByRole('link', { name: symbol }),
      ).toBeInTheDocument();
    }

    const needsReviewHeading = screen.getByRole('heading', {
      name: i18n.t('companyComparison.closing.needsReviewHeading'),
    });
    const needsReviewSection = needsReviewHeading.parentElement;
    if (!needsReviewSection) {
      throw new Error('fixture');
    }
    expect(
      within(needsReviewSection).getByRole('link', { name: 'TUPRS' }),
    ).toBeInTheDocument();
  });

  it('expands the per-company metric detail only in the detailed view', async () => {
    renderWithProviders(<ComparisonPage />);

    const toggle = screen.getByRole('combobox', {
      name: i18n.t('researchUx.view'),
    });
    expect(toggle).toHaveValue('EASY');
    const panels = screen.getAllByText(i18n.t('researchUx.moreMetrics'));
    expect(
      panels[0]?.closest('details')?.hasAttribute('open'),
    ).toBe(false);

    await userEvent.selectOptions(toggle, 'DETAILED');

    const detailedPanels = screen.getAllByText(
      i18n.t('researchUx.moreMetrics'),
    );
    expect(detailedPanels[0]?.closest('details')?.hasAttribute('open')).toBe(
      true,
    );
  });
});
