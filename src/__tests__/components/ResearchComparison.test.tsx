import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResearchComparison } from '@/components/Research/ResearchComparison';
import { MetricEducation } from '@/components/Research/MetricEducation';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { parseAnalysisReports } from '@/lib/analysisSchema';
import snapshots from '@/data/research/analysis-reports.json';
import { i18n } from '@/i18n';

const report = parseAnalysisReports(snapshots)[0];
describe('educational comparison presentation', () => {
  it.each(['tr', 'en'])(
    'provides a valid empty state without fabricated peers in %s',
    async (lang) => {
      await i18n.changeLanguage(lang);
      renderWithProviders(<ResearchComparison candidates={[]} mode="PEERS" />);
      expect(
        screen.getByText(i18n.t('researchUx.comparison.empty')),
      ).toBeVisible();
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    },
  );
  it('provides a table and chart only for compatible history groups', () => {
    renderWithProviders(
      <ResearchComparison
        candidates={[2021, 2022, 2023].map((year) => ({
          label: String(year),
          report,
          factId: `revenue${year}`,
        }))}
        mode="HISTORY"
      />,
    );
    expect(
      screen.getAllByRole('img', {
        name: i18n.t('researchUx.comparison.chartLabel'),
      }),
    ).toHaveLength(1);
    expect(
      screen.getByText(i18n.t('researchUx.comparison.separated')),
    ).toBeVisible();
    expect(screen.getAllByText('2021').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2023').length).toBeGreaterThan(0);
  });
  it('provides a neutral fallback for an unknown metric', () => {
    renderWithProviders(
      <MetricEducation report={report.presentation} id="absent" />,
    );
    expect(
      screen.getByText(i18n.t('metricEducation.unknown.definition')),
    ).toBeVisible();
    expect(
      screen.getByText(i18n.t('researchUx.interpretation.missing')),
    ).toBeVisible();
  });
});
