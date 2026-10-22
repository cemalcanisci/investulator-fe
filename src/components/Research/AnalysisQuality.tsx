import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { evaluateCalculation, factIssues } from '@/lib/analysisValidation';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { evaluateValuation, VALUATION_METHODS } from '@/lib/valuation';
import { analysisQuality } from '@/lib/analysisQuality';
import { analysisPriorities } from '@/lib/analysisPriorities';

export function AnalysisQuality({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element | null {
  const { t } = useTranslation();
  const analysis = getAnalysis(report);
  if (!analysis) {
    return null;
  }
  const results = analysis.calculations.map((c) =>
    evaluateCalculation(analysis, c),
  );
  const profile = selectAnalysisProfile(analysis.context);
  const quality = analysisQuality(analysis);
  return (
    <section
      className="space-y-4 rounded-xl border border-line bg-surface p-5"
      aria-label={t('analysis.title')}
    >
      <h2 className="text-lg font-semibold">{t('analysis.title')}</h2>
      <p className="rounded-lg bg-warn-soft p-3 text-sm leading-7">
        {t('analysis.reviewNotice')}
      </p>
      <p className="text-sm">
        {t('analysis.counts', {
          passed: results.filter((r) => r.status === 'PASS').length,
          total: results.length,
        })}
      </p>
      <p className="text-xs text-fg-2">
        {t('analysis.profile')}: {t(`analysis.profiles.${profile.id}`)} ·{' '}
        {analysis.version}
      </p>
      <p className="text-sm leading-7">
        {t('analysis.qualitySeparation', {
          sources: t(`analysis.sourceState.${quality.sources}`),
        })}
      </p>
      <p className="text-sm leading-7">
        {t('analysis.priorities')}:{' '}
        {analysisPriorities(analysis.context)
          .map((s) => t(`analysis.sections.${s}`))
          .join(' → ')}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {analysis.sections?.map((section) => (
          <article
            key={section.id}
            className="rounded-lg border border-line p-3 text-sm leading-7"
          >
            <h3 className="font-semibold">
              {t(`${section.contentKey}.title`)} ·{' '}
              {t(`analysis.completion.${section.status}`)}
            </h3>
            <p>{t(`${section.contentKey}.text`)}</p>
            {report.sources
              .filter((s) => section.sourceIds.includes(s.id))
              .map((s) => (
                <a
                  key={s.id}
                  className="mr-3 break-words text-primary underline"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.title}
                </a>
              ))}
          </article>
        ))}
      </div>
      <details className="text-sm">
        <summary className="text-primary">{t('analysis.auditTrail')}</summary>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {analysis.facts.map((f) => (
            <article
              key={f.id}
              className="min-w-0 rounded-lg border border-line p-3 text-xs leading-6"
            >
              <h3 className="font-semibold">
                {t(`research.metrics.${f.id}`, { defaultValue: f.id })}
              </h3>
              <p>
                {factIssues(
                  f,
                  report.sources.map((s) => s.id),
                ).length
                  ? t('analysis.blocked')
                  : t('analysis.verified')}
              </p>
              <p className="break-words">
                {f.value} {f.unit} · {f.basis.currency} · {t('analysis.scale')}:{' '}
                {f.basis.scale}
              </p>
              <p>
                {f.basis.start} → {f.basis.end} · {f.basis.periodKind}
              </p>
              <p>
                {t(`analysis.scope.${f.basis.scope}`)} ·{' '}
                {t(`analysis.attribution.${f.basis.attribution}`)} ·{' '}
                {f.basis.accounting} {f.basis.purchasingPowerDate}
              </p>
              <p className="break-words">
                {f.locator} · {f.checkedAt}
              </p>
              {f.evidence && (
                <p className="break-words">
                  {t('analysis.provenance')}: {f.evidence.originId} ·{' '}
                  {f.evidence.collectionId} · {f.evidence.method}
                  <br />
                  {f.evidence.excerpt}
                </p>
              )}
              {report.sources
                .filter((s) => s.id === f.sourceId)
                .map((s) => (
                  <a
                    key={s.id}
                    className="break-words text-primary underline"
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.title}
                  </a>
                ))}
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

export function ProfileValuation({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element | null {
  const { t } = useTranslation();
  const analysis = getAnalysis(report);
  if (!analysis) {
    return null;
  }
  const profile = selectAnalysisProfile(analysis.context);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {VALUATION_METHODS.filter((m) => profile.methods.includes(m.id)).map(
        (method) => {
          const result = evaluateValuation(analysis, method);
          return (
            <article
              key={method.id}
              className="min-w-0 rounded-xl border border-line bg-surface p-5"
            >
              <h3 className="font-semibold">
                {t(`analysis.methods.${method.id}`)}
              </h3>
              <p className="mt-2 text-sm text-warn">
                {result.status === 'BLOCKED'
                  ? t('research.notAssessed')
                  : result.value}
              </p>
              <p className="mt-2 break-words text-xs">{method.formula}</p>
              <ul className="mt-3 list-inside list-disc text-sm leading-7">
                {result.issues.map((issue) => (
                  <li key={issue}>
                    {issue.startsWith('MISSING:')
                      ? t('analysis.missingInput', {
                          input: t(`analysis.inputs.${issue.slice(8)}`),
                        })
                      : t(`analysis.issues.${issue}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-fg-2">
                {t(`analysis.limits.${method.id}`)}
              </p>
            </article>
          );
        },
      )}
    </div>
  );
}
