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

  it('splits the automotive sector into its OEM/distributor/machinery peer groups and keeps the refiner alone', () => {
    renderWithProviders(<ComparisonPage />);

    const oemHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.peerGroups.AUTOMOTIVE_OEM')} · ${i18n.t('research.metrics.evEbitda')}`,
    });
    const oemGroup = oemHeading.closest('div');
    if (!oemGroup) {
      throw new Error('fixture');
    }
    for (const symbol of ['FROTO', 'TOASO']) {
      expect(
        within(oemGroup).getAllByRole('link', { name: symbol }),
      ).not.toHaveLength(0);
    }
    for (const symbol of ['DOAS', 'TTRAK', 'TUPRS']) {
      expect(
        within(oemGroup).queryAllByRole('link', { name: symbol }),
      ).toHaveLength(0);
    }

    // DOAS (distributor) and TTRAK (farm machinery) each stand alone, not lumped with the OEMs.
    const distributionHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.peerGroups.AUTOMOTIVE_DISTRIBUTION')} · ${i18n.t('research.metrics.evEbitda')}`,
    });
    const distributionGroup = distributionHeading.closest('div');
    if (!distributionGroup) {
      throw new Error('fixture');
    }
    expect(
      within(distributionGroup).getByText(
        i18n.t('companyComparison.valuationGroups.single'),
      ),
    ).toBeInTheDocument();

    const machineryHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.peerGroups.AUTOMOTIVE_MACHINERY')} · ${i18n.t('research.metrics.evEbitda')}`,
    });
    const machineryGroup = machineryHeading.closest('div');
    if (!machineryGroup) {
      throw new Error('fixture');
    }
    expect(
      within(machineryGroup).getByText(
        i18n.t('companyComparison.valuationGroups.single'),
      ),
    ).toBeInTheDocument();

    const refiningHeading = screen.getByRole('heading', {
      name: `${i18n.t('researchAnalysis.peerGroups.REFINING')} · ${i18n.t('research.metrics.evEbitda')}`,
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
    expect(panels[0]?.closest('details')?.hasAttribute('open')).toBe(false);

    await userEvent.selectOptions(toggle, 'DETAILED');

    const detailedPanels = screen.getAllByText(
      i18n.t('researchUx.moreMetrics'),
    );
    expect(detailedPanels[0]?.closest('details')?.hasAttribute('open')).toBe(
      true,
    );
  });
});
