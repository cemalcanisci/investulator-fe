import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { AnalysisContext } from '@/domain/analysis';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import {
  evaluateCalculation,
  factTechnicalIssues,
  factSourceIssues,
} from '@/lib/analysisValidation';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import {
  evaluateValuation,
  reportValuationScenarios,
  scenarioUpsidePercent,
  VALUATION_METHODS,
} from '@/lib/valuation';
import { analysisQuality } from '@/lib/analysisQuality';
import { analysisPriorities } from '@/lib/analysisPriorities';

const SCENARIO_CASES = ['BEAR', 'BASE', 'BULL'] as const;

export function AnalysisQuality({
  report,
  context,
}: {
  readonly report: ResearchReport;
  readonly context?: AnalysisContext;
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
      aria-label={t('researchAnalysis.title')}
    >
      <h2 className="text-lg font-semibold">{t('researchAnalysis.title')}</h2>
      <p className="rounded-lg bg-warn-soft p-3 text-sm leading-7">
        {t('researchAnalysis.reviewNotice')}
      </p>
      <p className="text-sm">
        {t('researchAnalysis.counts', {
          passed: results.filter((r) => r.status === 'PASS').length,
          total: results.length,
        })}
      </p>
      <p className="text-xs text-fg-2">
        {t('researchAnalysis.profile')}:{' '}
        {t(`researchAnalysis.profiles.${profile.id}`)} · {analysis.version}
      </p>
      <p className="text-sm leading-7">
        {t('researchAnalysis.qualitySeparation', {
          sources: t(`researchAnalysis.sourceState.${quality.sources}`),
        })}
      </p>
      <p className="text-sm leading-7">
        {t('researchAnalysis.inputStates', {
          technical: analysis.facts.filter(
            (f) => factTechnicalIssues(f).length === 0,
          ).length,
          primary: analysis.facts.filter(
            (f) =>
              factSourceIssues(
                f,
                report.sources.map((s) => s.id),
              ).length === 0,
          ).length,
          total: analysis.facts.length,
        })}
      </p>
      <p className="text-sm leading-7">
        {t('researchAnalysis.priorities')}:{' '}
        {analysisPriorities(context ?? analysis.context)
          .map((s) => t(`researchAnalysis.sections.${s}`))
          .join(' → ')}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {[...(analysis.sections ?? [])]
          .sort((a, b) => {
            const priorities = analysisPriorities(context ?? analysis.context);
            const rank = (id: string): number => {
              const i = priorities.findIndex((p) => p === id);
              return i < 0 ? priorities.length : i;
            };
            return rank(a.id) - rank(b.id);
          })
          .map((section) => (
            <article
              key={section.id}
              className="rounded-lg border border-line p-3 text-sm leading-7"
            >
              <h3 className="font-semibold">
                {t(`${section.contentKey}.title`)} ·{' '}
                {t(`researchAnalysis.completion.${section.status}`)}
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
        <summary className="text-primary">
          {t('researchAnalysis.auditTrail')}
        </summary>
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
                {t('researchAnalysis.factTechnical')}:{' '}
                {t(
                  factTechnicalIssues(f).length
                    ? 'researchAnalysis.blocked'
                    : 'researchAnalysis.technicalValid',
                )}
              </p>
              <p>
                {t('researchAnalysis.factPrimary')}:
                {factSourceIssues(
                  f,
                  report.sources.map((s) => s.id),
                ).length
                  ? t('researchAnalysis.blocked')
                  : t('researchAnalysis.verified')}
              </p>
              <p>
                {t('researchAnalysis.factIndependent')}:{' '}
                {t('researchAnalysis.notReviewed')}
              </p>
              <p className="break-words">
                {f.value} {f.unit} · {f.basis.currency} ·{' '}
                {t('researchAnalysis.scale')}: {f.basis.scale}
              </p>
              <p>
                {f.basis.start} → {f.basis.end} · {f.basis.periodKind}
              </p>
              <p>
                {t(`researchAnalysis.scope.${f.basis.scope}`)} ·{' '}
                {t(`researchAnalysis.attribution.${f.basis.attribution}`)} ·{' '}
                {f.basis.accounting} {f.basis.purchasingPowerDate}
              </p>
              <p className="break-words">
                {f.locator} · {f.checkedAt}
              </p>
              {f.evidence && (
                <p className="break-words">
                  {t('researchAnalysis.provenance')}: {f.evidence.originId} ·{' '}
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
  const price = analysis.facts.find((f) => f.id === 'price')?.value;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {VALUATION_METHODS.filter((m) => profile.methods.includes(m.id)).map(
        (method) => {
          const scenarios = reportValuationScenarios(analysis, method);
          const fallback = scenarios
            ? null
            : evaluateValuation(analysis, method);
          return (
            <article
              key={method.id}
              className="min-w-0 rounded-xl border border-line bg-surface p-5"
            >
              <h3 className="font-semibold">
                {t(`researchAnalysis.methods.${method.id}`)}
              </h3>
              {scenarios ? (
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {SCENARIO_CASES.map((caseId) => {
                    const result = scenarios.find(
                      (s) => s.case === caseId,
                    )?.result;
                    const upside = scenarioUpsidePercent(result?.value, price);
                    return (
                      <div key={caseId} className="rounded-lg bg-surface-2 p-3">
                        <p className="text-xs font-semibold text-fg-2">
                          {t(`research.scenarioNames.${caseId.toLowerCase()}`)}
                        </p>
                        {result?.status === 'PASS' ? (
                          <>
                            <p className="mt-1 text-base font-semibold">
                              {result.value}
                            </p>
                            {upside !== null && (
                              <p className="text-xs text-fg-2">
                                {t('researchAnalysis.scenarioUpside', {
                                  percent: upside,
                                })}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="mt-1 text-sm text-warn">
                            {t('research.notAssessed')}
                          </p>
                        )}
                        <ul className="mt-2 list-inside list-disc text-xs leading-6">
                          {(result?.issues ?? []).map((issue) => (
                            <li key={issue}>
                              {issue.startsWith('MISSING:')
                                ? t('researchAnalysis.missingInput', {
                                    input: t(
                                      `researchAnalysis.inputs.${issue.slice(8)}`,
                                    ),
                                  })
                                : t(`researchAnalysis.issues.${issue}`)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-warn">
                    {fallback?.status === 'BLOCKED'
                      ? t('research.notAssessed')
                      : fallback?.value}
                  </p>
                  <ul className="mt-3 list-inside list-disc text-sm leading-7">
                    {fallback?.issues.map((issue) => (
                      <li key={issue}>
                        {issue.startsWith('MISSING:')
                          ? t('researchAnalysis.missingInput', {
                              input: t(
                                `researchAnalysis.inputs.${issue.slice(8)}`,
                              ),
                            })
                          : t(`researchAnalysis.issues.${issue}`)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p className="mt-3 break-words text-xs">{method.formula}</p>
              <p className="mt-3 text-sm text-fg-2">
                {t(`researchAnalysis.limits.${method.id}`)}
              </p>
            </article>
          );
        },
      )}
    </div>
  );
}
