import { MetricEducation } from '@/components/Research/MetricEducation';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { formatQuantity } from '@/lib/formatNumber';
import { divideDecimals } from '@/lib/decimal';

import {
  ratioPresentation,
  presentationFormulaValue,
} from '@/lib/ratioPresentation';
import { RatioContext } from '@/components/Research/RatioContext';
import {
  factTechnicalIssues,
  factSourceIssues,
} from '@/lib/analysisValidation';

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
  const legacyInputs = calculation
    ? [...new Set(calculation.inputs)].flatMap((input) =>
        report.facts.filter((entry) => entry.id === input),
      )
    : fact
      ? [fact]
      : [];
  const result = ratioPresentation(getAnalysis(report), id);
  const inputs = result.inputs.length ? result.inputs : legacyInputs;
  const value = result.value;
  const unit = result.unit ?? calculation?.unit ?? fact?.unit;
  if (value === undefined || !unit) {
    return (
      <article className="min-w-0 rounded-xl border border-line bg-surface p-4">
        <h3 className="text-sm text-fg-2">
          {t(`research.metrics.${id}`, { defaultValue: id })}
        </h3>
        <p className="mt-2 font-medium text-warn">
          {t('researchUx.trust.missing')}
        </p>
        <MetricEducation report={report} id={id} />
        <RatioContext report={report} id={id} />
        <details className="mt-2 text-sm text-fg-2">
          <summary>{t('researchUx.missingReason')}</summary>
          <ul>
            {result.issues.map((issue) => (
              <li key={issue}>
                {t(`ratios.issues.${issue}`, {
                  defaultValue: t(`analysis.issues.${issue}`, {
                    defaultValue: issue,
                  }),
                })}
              </li>
            ))}
          </ul>
        </details>
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
          {inputs
            .filter(
              (entry, index) =>
                inputs.findIndex((f) => f.id === entry.id) === index,
            )
            .map((input) => (
              <p key={input.id} className="mt-2 break-words">
                {t(`research.metrics.${input.id}`)}: {input.value} {input.unit}{' '}
                · {input.period} · {input.sourceId}
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
      <p className="mt-2 text-xs font-medium">
        {t(`ratios.status.${result.status}`)}
      </p>
      <p className="mt-2 text-xs text-fg-2">{t('ratios.reviewSeparate')}</p>
      {result.issues.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-fg-2">
          {result.issues.map((issue) => (
            <li key={issue}>
              {t(`ratios.issues.${issue}`, {
                defaultValue: t(`analysis.issues.${issue}`, {
                  defaultValue: issue,
                }),
              })}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-xs text-fg-2">
        {[...new Set(inputs.map((entry) => entry.period))].join(' · ')}
      </p>
      <MetricEducation report={report} id={id} />
      <RatioContext report={report} id={id} />
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
        {(calculation || id === 'peTtm') && (
          <p className="mt-3 break-words rounded-lg bg-surface-2 p-3 font-mono leading-relaxed">
            {t(`research.formulas.${id}`)}
          </p>
        )}
        <p className="mt-2">{presentationFormulaValue(result)}</p>
        <p className="mt-2">
          {t('ratios.technicalInputs')}:{' '}
          {t(
            result.inputs.every((f) => factTechnicalIssues(f).length === 0)
              ? 'ratios.checked'
              : 'ratios.pending',
          )}
        </p>
        <p>
          {t('ratios.primarySources')}:{' '}
          {t(
            result.inputs.every(
              (f) =>
                factSourceIssues(
                  f,
                  report.sources.map((s) => s.id),
                ).length === 0,
            )
              ? 'ratios.checked'
              : 'ratios.pending',
          )}
        </p>
        <details className="mt-2">
          <summary>{t('ratios.bases')}</summary>
          <pre className="mt-2 whitespace-pre-wrap break-all">
            {JSON.stringify(
              result.inputs
                .filter(
                  (entry, index) =>
                    result.inputs.findIndex((f) => f.id === entry.id) === index,
                )
                .map((f) => ({
                  id: f.id,
                  basis: f.basis,
                  locator: f.locator,
                  verification: f.verification,
                })),
              null,
              2,
            )}
          </pre>
        </details>
        <dl className="mt-3 space-y-2">
          {inputs
            .filter(
              (entry, index) =>
                inputs.findIndex((f) => f.id === entry.id) === index,
            )
            .map((entry) => (
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
