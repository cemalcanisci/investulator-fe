import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { metricDefinition } from '@/domain/metricEducation';
import { getAnalysis } from '@/services/analysis';
import { interpretMetric } from '@/lib/metricInterpretation';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { formatQuantity } from '@/lib/formatNumber';

export function MetricEducation({
  report,
  id,
}: {
  readonly report: ResearchReport;
  readonly id: string;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const analysis = getAnalysis(report);
  const fact = analysis?.facts.find((f) => f.id === id),
    calculation = analysis?.calculations.find((c) => c.id === id);
  const definition = metricDefinition(
    id,
    calculation?.metricKey ?? fact?.metricKey,
  );
  const interpretation = interpretMetric(analysis, id);
  const presentation = ratioPresentation(analysis, id);
  const key = definition?.key ?? 'unknown';
  return (
    <div className="mt-3 space-y-3 text-sm leading-6">
      <p>{t(`metricEducation.${key}.definition`)}</p>
      <p className="rounded-lg bg-info-soft p-3">
        {t(
          `researchUx.interpretation.${presentation.value !== undefined && interpretation.key === 'missing' ? 'context' : interpretation.key}`,
          {
            value: interpretation.value
              ? formatQuantity(interpretation.value, i18n.language)
              : '',
            from: interpretation.periods[1] ?? '',
            to: interpretation.periods[0] ?? '',
          },
        )}
      </p>
      <details>
        <summary className="text-primary">
          {t('researchUx.learnMetric')}
        </summary>
        <dl className="mt-3 space-y-3">
          {['purpose', 'reading', 'caution', 'comparison', 'formula'].map(
            (field) => (
              <div key={field}>
                <dt className="font-medium">
                  {t(`researchUx.educationFields.${field}`)}
                </dt>
                <dd>{t(`metricEducation.${key}.${field}`)}</dd>
              </div>
            ),
          )}
        </dl>
        <p className="mt-3">
          {t(`researchUx.sector.${interpretation.sectorKey}`)}
        </p>
      </details>
    </div>
  );
}
