import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { CompanyMatrixEntry } from '@/lib/companyMatrix';
import { riskFlags } from '@/lib/companyMatrix';
import { isMetricModeled, ratioPresentation } from '@/lib/ratioPresentation';
import { formatQuantity } from '@/lib/formatNumber';
import { Card } from '@/components/Card/Card';
import { ResearchDisclosurePanel } from '@/components/Research/ResearchDisclosurePanel';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { researchPath } from '@/app/routePaths';

function QuickRatio({
  entry,
  id,
  insufficientKey,
}: {
  readonly entry: CompanyMatrixEntry;
  readonly id: string;
  readonly insufficientKey: string;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  if (!isMetricModeled(entry.report, id)) {
    return <p className="text-sm text-fg-2">{t(insufficientKey)}</p>;
  }
  const result = ratioPresentation(entry.report, id);
  if (result.value === undefined || result.status === 'MISSING_DATA') {
    return <p className="text-sm text-fg-2">{t(insufficientKey)}</p>;
  }
  return (
    <p className="text-sm">
      <span className="font-semibold tabular-nums">
        {formatQuantity(result.value, i18n.language)}
      </span>{' '}
      {result.unit && t(`research.units.${result.unit}`)} ·{' '}
      {t(`ratios.status.${result.status}`)}
    </p>
  );
}

export function CompanyComparisonCard({
  entry,
}: {
  readonly entry: CompanyMatrixEntry;
}): JSX.Element {
  const { t } = useTranslation();
  const growthId = entry.profile.growth.find((id) =>
    isMetricModeled(entry.report, id),
  );
  const soundnessFindings = entry.assessment.findings.filter((finding) =>
    [
      'debt.positive',
      'debt.negative',
      'cash.positive',
      'cash.negative',
      'profitWithCash',
      'profitWithoutCash',
    ].includes(finding.key),
  );
  const dividendFinding = entry.assessment.findings.find(
    (finding) => finding.key === 'dividendCoverage',
  );
  const financialsPanel = entry.profile.financials.filter((id) =>
    isMetricModeled(entry.report, id),
  );
  const dividendPanel = entry.profile.dividend.filter(
    (id) => id !== 'dividendYield' && isMetricModeled(entry.report, id),
  );
  const growthPanel = entry.profile.growth.filter(
    (id) => id !== growthId && isMetricModeled(entry.report, id),
  );
  return (
    <Card className="flex min-w-0 flex-col gap-4 p-5">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{entry.symbol}</h3>
          <p className="text-xs text-fg-2">
            {t('companyComparison.sector')}:{' '}
            {t(`researchAnalysis.profiles.${entry.profile.id}`)}
          </p>
        </div>
        <Link
          to={researchPath(entry.assetId)}
          className="text-xs text-primary underline underline-offset-2"
        >
          {t('companyComparison.card.detailLink')}
        </Link>
      </header>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-2">
          {t('companyComparison.dimensions.dividend')}
        </h4>
        <QuickRatio
          entry={entry}
          id="dividendYield"
          insufficientKey="companyComparison.card.insufficientDividend"
        />
        {dividendFinding ? (
          <p className="mt-1 text-xs text-fg-2">
            {t(`ratios.findings.${dividendFinding.key}`)}
          </p>
        ) : (
          <p className="mt-1 text-xs text-fg-2">
            {t('companyComparison.card.insufficientDividend')}
          </p>
        )}
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-2">
          {t('companyComparison.dimensions.growth')}
        </h4>
        {growthId ? (
          <QuickRatio
            entry={entry}
            id={growthId}
            insufficientKey="companyComparison.card.insufficientGrowth"
          />
        ) : (
          <p className="text-sm text-fg-2">
            {t('companyComparison.card.insufficientGrowth')}
          </p>
        )}
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-2">
          {t('companyComparison.dimensions.soundness')}
        </h4>
        <p className="text-sm font-medium">
          {t(`ratios.financialOutlook.${entry.assessment.financialOutlook}`)}
        </p>
        {soundnessFindings.slice(0, 1).map((finding) => (
          <p key={finding.key} className="mt-1 text-xs text-fg-2">
            {t(`ratios.findings.${finding.key}`)}
          </p>
        ))}
      </section>

      <section>
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-2">
          {t('companyComparison.dimensions.risk')}
        </h4>
        <ul className="mt-1 space-y-1 text-xs text-fg-2">
          {riskFlags(entry).map((flag) => (
            <li key={flag}>{t(`companyComparison.risk.${flag}`)}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg bg-surface-2 p-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-fg-2">
          {t('companyComparison.dimensions.reliability')}
        </h4>
        <p className="mt-1 text-xs">
          {entry.reliability.reviewStatus} ·{' '}
          {t(
            entry.reliability.reviewIndependent
              ? 'companyComparison.card.reviewIndependent'
              : 'companyComparison.card.reviewInternal',
          )}
        </p>
        <p className="mt-1 text-xs text-fg-2">
          {entry.reliability.conflictFactIds.length > 0
            ? t('companyComparison.card.conflicts', {
                count: entry.reliability.conflictFactIds.length,
              })
            : t('companyComparison.card.noConflicts')}
        </p>
        <p className="mt-1 text-xs text-fg-2">
          {t(
            `companyComparison.card.valuationAvailability.${entry.reliability.valuationAvailability}`,
          )}
        </p>
      </section>

      {(financialsPanel.length > 0 ||
        dividendPanel.length > 0 ||
        growthPanel.length > 0) && (
        <ResearchDisclosurePanel title={t('researchUx.moreMetrics')}>
          {financialsPanel.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {financialsPanel.map((id) => (
                <ResearchMetric
                  key={id}
                  report={entry.report.presentation}
                  id={id}
                />
              ))}
            </div>
          )}
          {dividendPanel.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {dividendPanel.map((id) => (
                <ResearchMetric
                  key={id}
                  report={entry.report.presentation}
                  id={id}
                />
              ))}
            </div>
          )}
          {growthPanel.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {growthPanel.map((id) => (
                <ResearchMetric
                  key={id}
                  report={entry.report.presentation}
                  id={id}
                />
              ))}
            </div>
          )}
        </ResearchDisclosurePanel>
      )}
    </Card>
  );
}
