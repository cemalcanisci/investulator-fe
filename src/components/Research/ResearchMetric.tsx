import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { metricResult, getAnalysis } from '@/services/analysis';
import { formatQuantity } from '@/lib/formatNumber';
import { divideDecimals } from '@/lib/decimal';

interface ResearchMetricProps {
  readonly report: ResearchReport;
  readonly id: string;
  readonly explain?: boolean;
}

export function ResearchMetric({
  report,
  id,
  explain = false,
}: ResearchMetricProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const fact = report.facts.find((entry) => entry.id === id);
  const calculation = report.calculations.find((entry) => entry.id === id);
  const inputs = calculation
    ? [...new Set(calculation.inputs)].flatMap((input) =>
        report.facts.filter((entry) => entry.id === input),
      )
    : fact
      ? [fact]
      : [];
  const result = metricResult(report, id);
  const value = result.value;
  const unit = calculation?.unit ?? fact?.unit;
  if (!value || !unit) {
    return (
      <article className="min-w-0 rounded-xl border border-line bg-surface p-4">
        <h3 className="text-sm text-fg-2">
          {t(`research.metrics.${id}`, { defaultValue: id })}
        </h3>
        <p className="mt-2 font-medium text-warn">{t('analysis.blocked')}</p>
        <ul className="mt-2 text-sm text-fg-2">
          {result.issues.map((issue) => (
            <li key={issue}>{t(`analysis.issues.${issue}`)}</li>
          ))}
        </ul>
        {explain && (
          <p className="mt-3 text-sm leading-7">
            {t(`${report.contentKey}.education.${id}`)}
          </p>
        )}
        <details className="mt-3 text-xs">
          <summary className="text-primary">
            {t('research.calculationDetails')}
          </summary>
          {calculation && (
            <p className="mt-2">{t(`research.formulas.${id}`)}</p>
          )}
          {inputs.map((input) => (
            <p key={input.id} className="mt-2 break-words">
              {t(`research.metrics.${input.id}`)}: {input.value} {input.unit} ·{' '}
              {input.period} · {input.sourceId}
            </p>
          ))}
          <p className="mt-2">{t('analysis.unverifiedInputs')}</p>
          {i18n.exists(`${report.contentKey}.education.${id}`) && (
            <p className="mt-2">{t(`${report.contentKey}.education.${id}`)}</p>
          )}
          {report.sources
            .filter((s) => inputs.some((input) => input.sourceId === s.id))
            .map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-words text-primary underline"
              >
                {s.title}
              </a>
            ))}
        </details>
      </article>
    );
  }
  const display =
    unit === 'TRY' ? divideDecimals(value, '1000000000', 2) : value;
  const sourceIds = [...new Set(inputs.map((entry) => entry.sourceId))];
  return (
    <article className="min-w-0 rounded-xl border border-line bg-surface p-4">
      <h3 className="text-sm text-fg-2">{t(`research.metrics.${id}`)}</h3>
      <p className="mt-2 break-words text-2xl font-semibold tabular-nums">
        {formatQuantity(display, i18n.language)}{' '}
        <span className="text-sm font-normal text-fg-2">
          {t(`research.units.${unit === 'TRY' ? 'BILLION_TRY' : unit}`)}
        </span>
      </p>
      <p className="mt-2 text-xs text-fg-2">
        {[...new Set(inputs.map((entry) => entry.period))].join(' · ')}
      </p>
      {explain && (
        <p className="mt-3 rounded-lg bg-info-soft p-3 text-sm leading-7">
          {t(`${report.contentKey}.education.${id}`)}
        </p>
      )}
      <details className="mt-3 border-t border-line pt-3 text-xs">
        <summary className="cursor-pointer font-medium text-primary">
          {t('research.calculationDetails')}
        </summary>
        <p className="mt-2">
          {t(
            `analysis.earnings.${getAnalysis(report)?.contracts.find((c) => c.id === id)?.earningsBasis ?? 'REPORTED'}`,
          )}
        </p>
        {calculation && (
          <p className="mt-3 break-words rounded-lg bg-surface-2 p-3 font-mono leading-relaxed">
            {t(`research.formulas.${id}`)}
          </p>
        )}
        <dl className="mt-3 space-y-2">
          {inputs.map((entry) => (
            <div key={entry.id} className="break-words">
              <dt className="text-fg-2">
                {t(`research.metrics.${entry.id}`)} · {entry.period}
              </dt>
              <dd className="mt-1 tabular-nums">
                {formatQuantity(entry.value, i18n.language)}{' '}
                {t(`research.units.${entry.unit}`)}
              </dd>
            </div>
          ))}
        </dl>
        {calculation && (
          <p className="mt-3 break-words font-medium">
            {t('research.result')}: {formatQuantity(value, i18n.language)}{' '}
            {t(`research.units.${unit}`)}
          </p>
        )}
        {i18n.exists(`${report.contentKey}.education.${id}`) && (
          <p className="mt-3 leading-relaxed text-fg-2">
            {t(`${report.contentKey}.education.${id}`)}
          </p>
        )}
      </details>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {sourceIds.map((sourceId) => {
          const source = report.sources.find((entry) => entry.id === sourceId);
          if (!source) {
            return null;
          }
          return (
            <a
              key={sourceId}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="break-words text-primary underline underline-offset-2"
            >
              {source.title} ↗
            </a>
          );
        })}
      </div>
    </article>
  );
}
