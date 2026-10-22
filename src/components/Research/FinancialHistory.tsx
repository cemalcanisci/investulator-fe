import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { getAnalysis } from '@/services/analysis';
import { ResearchMetric } from '@/components/Research/ResearchMetric';

export function FinancialHistory({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element | null {
  const { t } = useTranslation();
  const rows = getAnalysis(report)?.financialHistory;
  if (!rows?.length) {
    return null;
  }
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t('analysis.historyTitle')}</h3>
      <p className="rounded-lg bg-warn-soft p-4 text-sm leading-7">
        {t('analysis.historyBasis')}
      </p>
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
    </div>
  );
}
