import type { JSX } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { ResearchMetric } from '@/components/Research/ResearchMetric';
import { ResearchComparison } from '@/components/Research/ResearchComparison';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { metricDefinition } from '@/domain/metricEducation';
import { selectAnalysisProfile } from '@/lib/analysisProfiles';
import { ResearchDisclosurePanel } from '@/components/Research/ResearchDisclosurePanel';

export function FinancialHistory({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t } = useTranslation();
  const [selection, setSelection] = useState('revenue');
  const analysis = getAnalysis(report);
  const rows = analysis?.financialHistory;
  if (!rows?.length || !analysis) {
    return <p role="status">{t('researchUx.comparison.empty')}</p>;
  }
  const profile = selectAnalysisProfile(analysis.context);
  const allowed = new Set([
    'profit',
    'equity',
    ...profile.financials.map((id) => metricDefinition(id)?.key),
  ]);
  if (profile.financials.includes('cashProxy')) {
    allowed.add('cfo');
    allowed.add('capex');
  }
  const choices = [
    ...new Set(
      rows.flatMap((row) =>
        row.factIds.flatMap((id) => {
          const fact = analysis.facts.find((f) => f.id === id),
            key = metricDefinition(id, fact?.metricKey)?.key;
          return key && allowed.has(key) ? [key] : [];
        }),
      ),
    ),
  ];
  const selected = choices.includes(selection) ? selection : choices[0];
  const candidates = rows.flatMap((row) =>
    row.factIds.flatMap((id) => {
      const fact = analysis.facts.find((f) => f.id === id);
      return metricDefinition(id, fact?.metricKey)?.key === selected
        ? [{ label: row.year, report: analysis, factId: id }]
        : [];
    }),
  );
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t('analysis.historyTitle')}</h3>
      <p className="rounded-lg bg-warn-soft p-4 text-sm leading-7">
        {t('researchUx.comparison.basisNotice')}
      </p>
      <NativeSelect
        label={t('researchUx.comparison.metric')}
        value={selected ?? ''}
        options={choices.map((key) => ({
          value: key,
          label: t(`metricEducation.${key}.name`),
        }))}
        onChange={setSelection}
      />
      <ResearchComparison candidates={candidates} mode="HISTORY" />
      <ResearchDisclosurePanel title={t('researchUx.historyDetails')}>
        {rows.map((row) => (
          <details
            key={row.year}
            className="rounded-xl border border-line bg-surface p-4"
          >
            <summary className="font-semibold text-primary">{row.year}</summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[...row.factIds, ...row.calculationIds].map((id) => (
                <ResearchMetric key={id} report={report} id={id} />
              ))}
            </div>
          </details>
        ))}
      </ResearchDisclosurePanel>
    </div>
  );
}
