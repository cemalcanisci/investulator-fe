import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ResearchLongTerm } from '@/components/Research/ResearchLongTerm';
import { tuprsReportV3 } from '@/data/research/tuprs-2026-10-11-v3';
import { tuprsReportV2 } from '@/data/research/tuprs-2026-10-11-v2';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';

describe('ResearchLongTerm', () => {
  it('does not invent long-term analysis for an older report', () => {
    const { container } = renderWithProviders(
      <ResearchLongTerm report={tuprsReportV2} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
  it.each(['tr', 'en'])(
    'shows conditional conclusions, opportunities and evidence gaps in %s',
    async (lng) => {
      await i18n.changeLanguage(lng);
      renderWithProviders(<ResearchLongTerm report={tuprsReportV3} />);
      expect(
        screen.getByText(i18n.t('researchTuprsV3.longTerm.verdict')),
      ).toBeVisible();
      for (const key of ['saf', 'electricity', 'hydrogen']) {
        expect(
          screen.getByText(
            i18n.t(`researchTuprsV3.longTerm.opportunities.${key}.risk`),
          ),
        ).toBeVisible();
      }
      await userEvent.click(
        screen.getByText(i18n.t('research.longTerm.monitor')),
      );
      expect(
        screen.getByText(i18n.t('researchTuprsV3.longTerm.monitor.missing')),
      ).toBeVisible();
      expect(
        screen.getByRole('link', { name: 'Tüpraş · Stratejik dönüşüm ↗' }),
      ).toHaveAttribute(
        'href',
        'https://www.tupras.com.tr/tr/stratejik-donusum',
      );
      expect(tuprsReportV3.longTerm?.status).toBe('CONDITIONAL');
      expect(tuprsReportV3.valuationStatus).toBe('NOT_ASSESSED');
    },
  );
});
