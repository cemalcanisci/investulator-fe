import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { companyAssessment, overviewRatioIds } from '@/lib/companyAssessment';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { ResearchDisclosurePanel } from '@/components/Research/ResearchDisclosurePanel';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { formatQuantity } from '@/lib/formatNumber';
import { divideDecimals } from '@/lib/decimal';

export function CompanyAssessment({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const analysis = getAnalysis(report);
  const assessment = companyAssessment(analysis);
  const ratios = overviewRatioIds(analysis);
  return (
    <section aria-label={t('ratios.title')} className="space-y-4">
      <div className="rounded-xl border border-line bg-primary-soft p-5">
        <h3 className="text-lg font-semibold">{t('ratios.title')}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm">{t('ratios.financialOutlookTitle')}</h4>
            <p className="mt-1 text-xl font-semibold">
              {t(`ratios.financialOutlook.${assessment.financialOutlook}`)}
            </p>
          </div>
          <div>
            <h4 className="text-sm">{t('ratios.priceOutlookTitle')}</h4>
            <p className="mt-1 text-xl font-semibold">
              {t(`ratios.priceOutlook.${assessment.priceOutlook}`)}
            </p>
          </div>
        </div>
        <p className="mt-2 text-sm leading-7">{t('ratios.qualitySeparate')}</p>
        {assessment.classification === 'UNCERTAIN' && (
          <p className="mt-2 text-sm leading-7">
            {t('ratios.findings.uncertain')}
          </p>
        )}
        <ul className="mt-3 space-y-3 text-sm leading-7">
          {assessment.findings.map((finding) => (
            <li key={finding.key}>
              <p>{t(`ratios.findings.${finding.key}`)}</p>
              <p className="text-xs">
                {finding.metricIds
                  .flatMap((id) => {
                    const metric = ratioPresentation(analysis, id);
                    return metric.status === 'VERIFIED' &&
                      metric.value !== undefined
                      ? [
                          `${t(`research.metrics.${id}`, { defaultValue: id })}: ${formatQuantity(metric.unit === 'TRY' ? divideDecimals(metric.value, '1000000000', 2) : metric.value, i18n.language)} ${t(`research.units.${metric.unit === 'TRY' ? 'BILLION_TRY' : (metric.unit ?? 'MULTIPLE')}`)} (${[...new Set(metric.inputs.map((f) => f.period))].join(' / ')})`,
                        ]
                      : [];
                  })
                  .join(' · ')}
              </p>
              <p className="text-xs text-fg-2">
                {t('ratios.basedOn')}:{' '}
                {finding.metricIds
                  .map((id) =>
                    t(`research.metrics.${id}`, { defaultValue: id }),
                  )
                  .join(' · ')}
              </p>
            </li>
          ))}
        </ul>
        <ResearchDisclosurePanel title={t('ratios.gaps')}>
          <ul className="space-y-2 text-sm">
            {assessment.missing.map((id) => (
              <li key={id}>
                {t(`ratios.missing.${id}`, {
                  defaultValue: t(`research.metrics.${id}`, {
                    defaultValue: id,
                  }),
                })}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">{t('ratios.noDoubleCount')}</p>
        </ResearchDisclosurePanel>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ratios.slice(0, 3).map((id) => (
          <ResearchMetric key={id} report={report} id={id} />
        ))}
      </div>
      <ResearchDisclosurePanel title={t('ratios.more')}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {ratios.slice(3).map((id) => (
            <ResearchMetric key={id} report={report} id={id} />
          ))}
        </div>
      </ResearchDisclosurePanel>
    </section>
  );
}
