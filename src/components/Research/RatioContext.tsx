import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { relatedMetricIds } from '@/lib/companyAssessment';
import { formatQuantity } from '@/lib/formatNumber';
import { divideDecimals } from '@/lib/decimal';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';

export function RatioContext({
  report,
  id,
}: {
  readonly report: ResearchReport;
  readonly id: string;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const analysis = getAnalysis(report),
    result = ratioPresentation(analysis, id);
  const profile = analysis
    ? selectAnalysisProfile(analysis.context)
    : undefined;
  const related = relatedMetricIds(id, analysis).filter(
    (key) =>
      key !== 'netFinancialDebt' || profile?.methods.includes('EV_EBITDA'),
  );
  return (
    <div className="mt-3 space-y-2 text-sm leading-6">
      <p>
        {t(
          id === 'peTtm' && result.periodBasis
            ? `ratios.periodContext.${result.periodBasis}`
            : `ratios.context.${id}`,
          {
            defaultValue: t('ratios.context.general'),
          },
        )}
      </p>
      {result.value !== undefined && (
        <p>
          {t('ratios.observation', {
            value: formatQuantity(
              result.unit === 'TRY'
                ? divideDecimals(result.value, '1000000000', 2)
                : result.value,
              i18n.language,
            ),
            unit: t(
              `research.units.${result.unit === 'TRY' ? 'BILLION_TRY' : (result.unit ?? 'MULTIPLE')}`,
            ),
          })}
        </p>
      )}
      <details>
        <summary className="text-primary">{t('ratios.relationships')}</summary>
        <ul className="mt-2 space-y-2">
          {related.map((key) => {
            const other = ratioPresentation(analysis, key);
            return (
              <li key={key}>
                {t(`research.metrics.${key}`, { defaultValue: key })}:{' '}
                {other.value === undefined
                  ? t('researchUx.trust.missing')
                  : `${formatQuantity(other.value, i18n.language)} ${t(`research.units.${other.unit ?? 'MULTIPLE'}`)} · ${t(`ratios.status.${other.status}`)}`}
              </li>
            );
          })}
        </ul>
        <p className="mt-2">{t('ratios.comparisonMissing')}</p>
      </details>
    </div>
  );
}
