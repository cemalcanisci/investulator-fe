import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { interpretMetric } from '@/lib/metricInterpretation';
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
  const answers = [
    [
      'business',
      i18n.exists(`${report.contentKey}.company.activity`)
        ? t(`${report.contentKey}.company.activity`)
        : t('researchUx.interpretation.missing'),
    ],
    ['risks', t(`researchUx.sector.${growth.sectorKey}`)],
  ];
  return (
    <div className="space-y-4">
      {report.narrativeStale && (
        <p role="status" className="rounded-lg bg-warn-soft p-4 text-sm">
          {t('researchTransfer.narrativeStale')}
        </p>
      )}
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
        href="#approximate-backtest"
      >
        {t('researchUx.simulationLink')}
      </a>
    </div>
  );
}
