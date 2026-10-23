import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { interpretMetric } from '@/lib/metricInterpretation';
import { formatQuantity } from '@/lib/formatNumber';
import { factSourceIssues } from '@/lib/analysisValidation';

export function ResearchOverview({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t, i18n } = useTranslation(),
    analysis = getAnalysis(report);
  const growth = interpretMetric(analysis, 'profitGrowth');
  const sourceCount =
    analysis?.facts.filter(
      (f) =>
        factSourceIssues(
          f,
          report.sources.map((s) => s.id),
        ).length === 0,
    ).length ?? 0;
  const netDebt = interpretMetric(analysis, 'netFinancialDebt');
  const coverageId = analysis?.calculations.find(
    (c) => c.metricKey === 'coverage',
  )?.id;
  const coverage = interpretMetric(analysis, coverageId ?? '');
  const answers = [
    [
      'business',
      i18n.exists(`${report.contentKey}.company.activity`)
        ? t(`${report.contentKey}.company.activity`)
        : t('researchUx.interpretation.missing'),
    ],
    [
      'health',
      `${t('research.metrics.profitGrowth')}: ${t(`researchUx.interpretation.${growth.key}`, { value: growth.value ? formatQuantity(growth.value, i18n.language) : '', from: growth.periods[1] ?? '', to: growth.periods[0] ?? '' })}`,
    ],
    ['strengths', t(`researchUx.interpretation.${netDebt.key}`)],
    ['risks', t(`researchUx.sector.${growth.sectorKey}`)],
    [
      'dividend',
      coverage.value
        ? t('researchUx.overview.dividendCoverage', {
            value: formatQuantity(coverage.value, i18n.language),
            period: coverage.periods[0],
          })
        : t('researchUx.overview.dividendAnswer'),
    ],
    ['valuation', t('researchUx.overview.valuationAnswer')],
    ['missing', t('researchUx.overview.missingAnswer')],
  ];
  return (
    <div className="space-y-4">
      <p className="rounded-lg bg-info-soft p-4 text-sm leading-7">
        {t(
          sourceCount ? 'researchUx.trust.partial' : 'researchUx.trust.missing',
        )}{' '}
        · {t('researchUx.trust.independent')}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {answers.map(([key, answer]) => (
          <article
            key={key}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <h3 className="font-semibold">{t(`researchUx.overview.${key}`)}</h3>
            <p className="mt-3 text-sm leading-7">{answer}</p>
          </article>
        ))}
      </div>
      <a
        className="inline-block text-sm font-medium text-primary underline"
        href="#dividend-backtest"
      >
        {t('researchUx.simulationLink')}
      </a>
    </div>
  );
}
