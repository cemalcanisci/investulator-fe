import { describe, expect, it } from 'vitest';
import { screen, cleanup } from '@testing-library/react';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { CompanyAssessment } from '@/components/Research/CompanyAssessment';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import snapshots from '@/data/research/analysis-reports.json';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import { i18n } from '@/i18n';

const report = parseAnalysisReports(snapshots)[0].presentation;
describe('educational ratio presentation', () => {
  it.each(['tr', 'en'])(
    'shows values, status and uncertainty in %s',
    async (language) => {
      await i18n.changeLanguage(language);
      renderWithProviders(<ResearchMetric report={report} id="priceBook" />);
      expect(
        screen.getByText(i18n.t('ratios.status.INDICATIVE')),
      ).toBeVisible();
      expect(
        screen.getByText(i18n.t('ratios.issues.purchasingPower')),
      ).toBeVisible();
      expect(document.querySelector('.tabular-nums')?.textContent).toMatch(
        /1[.,]63/,
      );
      cleanup();
      renderWithProviders(<CompanyAssessment report={report} />);
      expect(
        screen.getByText(i18n.t('ratios.classification.UNCERTAIN')),
      ).toBeVisible();
      expect(screen.getByText(i18n.t('ratios.qualitySeparate'))).toBeVisible();
    },
  );
});
