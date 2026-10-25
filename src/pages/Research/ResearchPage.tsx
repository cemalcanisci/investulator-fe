import { ResearchViewContext } from '@/components/Research/researchView';
import type { ResearchView } from '@/components/Research/researchView';
import { ResearchDisclosurePanel } from '@/components/Research/ResearchDisclosurePanel';
import { ResearchOverview } from '@/components/Research/ResearchOverview';
import { ResearchComparison } from '@/components/Research/ResearchComparison';
import { peerCandidates } from '@/lib/researchComparison';
import { researchBundle } from '@/services/researchBundle';
import { FinancialHistory } from '@/components/Research/FinancialHistory';
import { RiArrowLeftLine, RiFileSearchLine } from '@remixicon/react';
import { useState } from 'react';
import type { JSX, ReactNode } from 'react';
import type { AnalysisContext } from '@/domain/analysis';
import type { ResearchSectionId } from '@/lib/analysisPriorities';
import { researchSectionOrder } from '@/lib/analysisPriorities';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { ResearchDisclosures } from '@/components/Research/ResearchDisclosures';
import { ResearchDebt } from '@/components/Research/ResearchDebt';
import { ResearchLongTerm } from '@/components/Research/ResearchLongTerm';
import { CompanyAssessment } from '@/components/Research/CompanyAssessment';
import { ApproximateBacktest } from '@/components/Research/ApproximateBacktest';
import { getApproximateHistory } from '@/services/approximateHistory';
import {
  ResearchSummary,
  ResearchValuationGuide,
} from '@/components/Research/ResearchSummary';
import { useResearch } from '@/hooks/useResearch';
import { useStrategies } from '@/hooks/useStrategies';
import { getAnalysis } from '@/services/analysis';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import {
  AnalysisQuality,
  ProfileValuation,
} from '@/components/Research/AnalysisQuality';

const STRATEGIES = ['DIVIDEND', 'GROWTH', 'VALUE', 'LONG_TERM'] as const;

function ResearchSection({
  id,
  children,
}: {
  readonly id: string;
  readonly children: ReactNode;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-36 space-y-4"
    >
      <h2 id={`${id}-title`} className="text-lg font-semibold">
        {t(`research.sections.${id}`)}
      </h2>
      <p className="text-sm leading-7 text-fg-2">
        {t(`researchUx.sectionIntro.${id}`)}
      </p>
      {children}
    </section>
  );
}

export function ResearchPage(): JSX.Element {
  const { assetId = '' } = useParams();
  const [view, setView] = useState<ResearchView>('EASY');
  const [strategy, setStrategy] = useState<
    AnalysisContext['strategies'][number] | 'REPORT'
  >('REPORT');
  const { t } = useTranslation();
  const query = useResearch(assetId);
  const strategies = useStrategies();
  const report = query.data?.[0];
  const asset = strategies.query.data?.assets.find(
    (entry) => entry.id === assetId,
  );
  const groups =
    strategies.query.data?.groups.filter((group) =>
      strategies.query.data?.memberships.some(
        (membership) =>
          membership.assetId === assetId && membership.groupId === group.id,
      ),
    ) ?? [];
  const back = (
    <Link
      to={ROUTE_PATHS.strategies}
      className="inline-flex items-center gap-2 text-sm text-primary"
    >
      <RiArrowLeftLine className="size-4" aria-hidden="true" />
      {t('research.back')}
    </Link>
  );

  if (query.isPending || strategies.query.isPending) {
    return (
      <div className="space-y-4">
        {back}
        <p role="status">{t('common.loading')}</p>
      </div>
    );
  }
  if (query.isError || strategies.query.isError) {
    return (
      <div className="space-y-4">
        {back}
        <ErrorState
          onRetry={() => {
            void query.refetch();
            void strategies.query.refetch();
          }}
        />
      </div>
    );
  }
  if (!report) {
    return (
      <div className="space-y-5">
        {back}
        <h1 className="text-2xl font-semibold">
          {asset?.symbol ?? t('research.unknownAsset')}
        </h1>
        <EmptyState
          icon={RiFileSearchLine}
          title={t('research.noReport')}
          description={t(
            asset?.assetType === 'CRYPTO'
              ? 'research.noCryptoReportHint'
              : 'research.noReportHint',
          )}
        />
      </div>
    );
  }
  const currentReport = report;
  const analysis = getAnalysis(report);
  const profile = selectAnalysisProfile(
    analysis?.context ?? {
      assetType: 'EQUITY',
      businessModel: report.sector,
      strategies: [],
    },
  );
  const presentationContext: AnalysisContext = {
    ...(analysis?.context ?? {
      assetType: 'EQUITY',
      businessModel: report.sector,
      strategies: [],
    }),
    strategies:
      strategy === 'REPORT' ? (analysis?.context.strategies ?? []) : [strategy],
  };
  const orderedSections = researchSectionOrder(presentationContext);
  function note(key: string): JSX.Element {
    return (
      <p className="text-sm leading-7 text-fg-2">
        {t(`${currentReport.contentKey}.${key}`, {
          defaultValue: t('researchUx.interpretation.missing'),
        })}
      </p>
    );
  }
  function metrics(ids: readonly string[]): JSX.Element {
    return (
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(view === 'EASY' ? ids.slice(0, 3) : ids).map((id) => (
          <ResearchMetric key={id} report={currentReport} id={id} />
        ))}
        {view === 'EASY' && ids.length > 3 && (
          <ResearchDisclosurePanel title={t('researchUx.moreMetrics')}>
            {ids.slice(3).map((id) => (
              <ResearchMetric key={id} report={currentReport} id={id} />
            ))}
          </ResearchDisclosurePanel>
        )}
      </div>
    );
  }
  const sectionContent: Record<ResearchSectionId, ReactNode> = {
    overview: (
      <ResearchSection key="overview" id="overview">
        <ResearchOverview report={report} />
        <CompanyAssessment report={report} />
        {metrics(profile.headline)}
        <ResearchDisclosurePanel title={t('researchUx.companyDetails')}>
          <ResearchSummary report={report} />
          <ResearchLongTerm report={report} />
          <Card className="p-5 sm:p-6">
            <h3 className="mb-3 text-xl font-semibold">
              {t(`${report.contentKey}.headline`)}
            </h3>
            {note('summary')}
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-pos-soft p-4">
                <h4 className="mb-2 font-medium text-pos">
                  {t('research.strengths')}
                </h4>
                {note('strengths')}
              </div>
              <div className="rounded-lg bg-warn-soft p-4">
                <h4 className="mb-2 font-medium text-warn">
                  {t('research.watchPoints')}
                </h4>
                {note('risks')}
              </div>
            </div>
          </Card>
        </ResearchDisclosurePanel>
      </ResearchSection>
    ),
    financials: (
      <ResearchSection key="financials" id="financials">
        {note('accounting')}
        {metrics(
          profile.financials.filter(
            (id) => !['cashProxy', 'financialDebt'].includes(id),
          ),
        )}
        <section
          id="cashflow"
          aria-label={t('researchUx.cashflow')}
          className="scroll-mt-36 space-y-4"
        >
          <h3 className="font-semibold">{t('researchUx.cashflow')}</h3>
          <p className="text-sm leading-7">{t('researchUx.cashflowIntro')}</p>
          {profile.financials.includes('cashProxy') ? (
            metrics(['operatingCash', 'capex', 'cashProxy'])
          ) : (
            <p>{t('researchUx.sectorMetricMissing')}</p>
          )}
          {analysis && profile.methods.includes('EV_EBITDA') && (
            <>
              {metrics([
                'cashAvailable',
                'financialInvestments',
                'netFinancialDebt',
                'workingCapitalCash',
              ])}
              <Card className="p-5 text-sm leading-7">
                {t('analysis.cashBridge')}
              </Card>
            </>
          )}
          <Card className="p-5">{note('cashQuality')}</Card>
        </section>
        <section
          id="debt"
          aria-label={t('research.debtTitle')}
          className="scroll-mt-36 space-y-4"
        >
          <h3 className="font-semibold">{t('research.debtTitle')}</h3>
          <p className="text-sm leading-7">{t('researchUx.debtIntro')}</p>
          {profile.financials.includes('financialDebt') ? (
            <>
              {metrics(['financialDebt'])}
              <ResearchDisclosurePanel title={t('researchUx.debtDetails')}>
                <ResearchDebt report={report} />
              </ResearchDisclosurePanel>
            </>
          ) : (
            <p>{t('researchUx.sectorMetricMissing')}</p>
          )}
        </section>
      </ResearchSection>
    ),
    growth: (
      <ResearchSection key="growth" id="growth">
        {metrics(profile.growth)}
        <section
          id="comparison"
          aria-label={t('researchUx.peers')}
          className="space-y-3 scroll-mt-36"
        >
          <h3 className="font-semibold">{t('researchUx.peers')}</h3>
          <ResearchComparison
            candidates={peerCandidates(
              report ? getAnalysis(report) : undefined,
              researchBundle.reports,
            )}
            mode="PEERS"
          />
        </section>
        <Card className="space-y-3 p-5">
          {note('growth')}
          {note('peers')}
        </Card>
      </ResearchSection>
    ),
    dividend: (
      <ResearchSection key="dividend" id="dividend">
        {asset?.assetType !== 'CRYPTO' && (
          <>
            <ApproximateBacktest
              history={getApproximateHistory(report.assetId)}
            />
          </>
        )}
        {metrics(profile.dividend)}
        <Card className="space-y-3 p-5">
          {note('dividend')}
          {note('sustainability')}
        </Card>
      </ResearchSection>
    ),
    valuation: (
      <ResearchSection key="valuation" id="valuation">
        <ResearchDisclosurePanel title={t('researchUx.valuationMethods')}>
          <ProfileValuation report={report} />
        </ResearchDisclosurePanel>
        <ResearchValuationGuide report={report} />
        <div className="rounded-xl border-2 border-primary bg-primary-soft p-5 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {t('research.valuationResult')}
          </p>
          <h3 className="mt-2 text-2xl font-semibold">
            {t('research.notAssessed')}
          </h3>
          <div className="mt-3">{note('valuation')}</div>
        </div>
        {metrics(['marketCap', 'bookPerShare'])}
        <div className="grid gap-3 lg:grid-cols-3">
          {profile.methods
            .flatMap((method) =>
              method === 'EV_EBITDA' ? ['ev'] : method === 'FCF' ? ['dcf'] : [],
            )
            .map((method) => (
              <Card key={method} className="p-5">
                <h3 className="font-semibold">
                  {t(`research.methods.${method}`)}
                </h3>
                <p className="my-3 break-words rounded-lg bg-surface-2 p-3 font-mono text-xs leading-relaxed">
                  {t(`research.methodFormulas.${method}`)}
                </p>
                {note(`methods.${method}`)}
              </Card>
            ))}
        </div>
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">{t('research.scenarios')}</h3>
          {note('scenarios')}
          <div className="grid gap-3 md:grid-cols-3">
            {['bear', 'base', 'bull'].map((scenario) => (
              <div key={scenario} className="rounded-lg bg-surface-2 p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  {t(`research.scenarioNames.${scenario}`)}
                </h4>
                {note(`scenarioNotes.${scenario}`)}
              </div>
            ))}
          </div>
          <p className="break-words text-xs text-fg-2">
            {t('research.discountFormula')}
          </p>
        </Card>
      </ResearchSection>
    ),
    technical: (
      <ResearchSection key="technical" id="technical">
        {metrics(profile.technical)}
        <Card className="p-5">{note('technical')}</Card>
      </ResearchSection>
    ),
    news: (
      <ResearchSection key="news" id="news">
        <ResearchDisclosures report={report} />
        <Card className="p-5">
          <h3 className="mb-2 font-semibold">{t('research.riskFollowup')}</h3>
          {note('riskFollowup')}
        </Card>
      </ResearchSection>
    ),
    history: (
      <ResearchSection key="history" id="history">
        <FinancialHistory report={report} />
        <ResearchDisclosurePanel title={t('researchUx.reportHistory')}>
          <Card className="space-y-4 p-5">
            <p className="break-words font-medium">{report.id}</p>
            {note('history')}
            <div className="rounded-lg bg-warn-soft p-4">
              <p className="font-medium text-warn">
                {t('research.reviewTitle')}: {report.review.status}
              </p>
              <div className="mt-2">{note(report.review.key)}</div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {report.coverage.map((item) => (
                <div
                  key={item.section}
                  className="rounded-lg border border-line p-3 text-xs"
                >
                  <p>{t(`research.sections.${item.section}`)}</p>
                  <p className="mt-1 text-fg-2">
                    {t(`research.status.${item.status}`)}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </ResearchDisclosurePanel>
      </ResearchSection>
    ),
    sources: (
      <ResearchSection key="sources" id="sources">
        <ResearchDisclosurePanel title={t('researchUx.audit')}>
          <AnalysisQuality report={report} context={presentationContext} />
          <Card className="p-5">
            <dl className="grid gap-4 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-fg-2">{t('research.financialPeriod')}</dt>
                <dd className="mt-1">{report.financialPeriod}</dd>
              </div>
              <div>
                <dt className="text-fg-2">{t('research.priceAt')}</dt>
                <dd className="mt-1">{report.priceAt}</dd>
              </div>
              <div>
                <dt className="text-fg-2">{t('research.retrievedAt')}</dt>
                <dd className="mt-1">
                  {report.retrievedAt} · {report.timezone}
                </dd>
              </div>
              <div>
                <dt className="text-fg-2">{t('research.storage')}</dt>
                <dd className="mt-1">{t('research.fileSnapshot')}</dd>
              </div>
            </dl>
            <ul className="mt-5 divide-y divide-line">
              {report.sources.map((source) => (
                <li key={source.id} className="py-3 text-sm">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="break-words font-medium text-primary underline"
                  >
                    {source.title} ↗
                  </a>
                  <p className="mt-1 break-words text-xs text-fg-2">
                    {source.period} · {source.locator}
                  </p>
                  <p className="mt-1 break-words text-xs text-fg-2">
                    {t('research.publishedAt')}:{' '}
                    {source.publishedAt ?? t('research.dateUnverified')}
                  </p>
                </li>
              ))}
            </ul>
          </Card>
        </ResearchDisclosurePanel>
      </ResearchSection>
    ),
  };
  return (
    <ResearchViewContext.Provider value={view}>
      <div className="min-w-0 space-y-5 sm:space-y-7">
        {back}
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              {t('research.eyebrow')}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {report.symbol}{' '}
              <span className="text-fg-2">
                · {t(`${report.contentKey}.name`)}
              </span>
            </h1>
            <p className="mt-2 break-words text-xs text-fg-2">
              {report.market} · {report.isin} ·{' '}
              {t(`${report.contentKey}.sector`)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {groups.map((group) => (
                <span
                  key={group.id}
                  className="max-w-full break-words rounded-full bg-primary-soft px-3 py-1 text-xs text-primary"
                >
                  {group.name}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-line bg-surface px-4 py-3 text-sm">
            <p className="font-medium">
              {t('research.reportDate')}: {report.asOf}
            </p>
            <p className="mt-1 text-xs text-warn">
              {t('research.partialReport')}
            </p>
          </div>
        </header>
        <details
          open={view === 'DETAILED'}
          className="rounded-xl border border-line bg-info-soft p-4 text-sm leading-relaxed"
        >
          <summary className="font-medium text-info">
            {t('researchUx.snapshotBrief')}
          </summary>
          <p className="mt-1 text-fg-2">{t('research.snapshotHint')}</p>
          <p className="mt-2 text-xs text-fg-2">
            {t('research.originalCurrency')}
          </p>
        </details>
        <div className="flex flex-wrap gap-3">
          <NativeSelect
            label={t('researchUx.view')}
            value={view}
            options={(['EASY', 'DETAILED'] as const).map((value) => ({
              value,
              label: t(`researchUx.views.${value}`),
            }))}
            onChange={(value) => {
              if (value === 'EASY' || value === 'DETAILED') {
                setView(value);
              }
            }}
          />
          <NativeSelect
            label={t('analysis.strategySelector')}
            value={strategy}
            options={[
              { value: 'REPORT', label: t('analysis.strategyOptions.REPORT') },
              ...STRATEGIES.map((value) => ({
                value,
                label: t(`analysis.strategyOptions.${value}`),
              })),
            ]}
            onChange={(value) => {
              if (value === 'REPORT') {
                setStrategy('REPORT');
              } else {
                const chosen = STRATEGIES.find((s) => s === value);
                if (chosen) {
                  setStrategy(chosen);
                }
              }
            }}
          />
        </div>
        <nav
          aria-label={t('research.contents')}
          className="top-14 z-20 -mx-1 flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-2 shadow-card sm:sticky"
        >
          <a
            href="#approximate-backtest"
            className="rounded-lg px-3 py-2 text-xs font-medium text-primary"
          >
            {t('researchUx.simulationLink')}
          </a>
          <details className="px-3 py-2 text-xs sm:hidden">
            <summary className="font-medium">{t('research.contents')}</summary>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {orderedSections.map((section) => (
                <a key={section} className="text-primary" href={`#${section}`}>
                  {t(`research.sections.${section}`)}
                </a>
              ))}
            </div>
          </details>
          <div className="hidden sm:contents">
            {orderedSections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="rounded-lg px-3 py-2 text-xs font-medium text-fg-2 hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                {t(`research.sections.${section}`)}
              </a>
            ))}
          </div>
        </nav>
        {orderedSections.map((id) => sectionContent[id])}
      </div>
    </ResearchViewContext.Provider>
  );
}
