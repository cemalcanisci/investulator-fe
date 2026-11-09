import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { ValuationComparisonGroup } from '@/lib/companyMatrix';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { formatQuantity } from '@/lib/formatNumber';
import { researchPath } from '@/app/routePaths';

export function ValuationGroupTable({
  group,
}: {
  readonly group: ValuationComparisonGroup;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const rows = group.entries.map((entry) => ({
    entry,
    result: ratioPresentation(entry.report, group.ratioId),
  }));
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface p-4">
      <h4 className="font-semibold">
        {t(`researchAnalysis.profiles.${group.businessModel}`)} ·{' '}
        {t(`research.metrics.${group.ratioId}`)}
      </h4>
      {group.entries.length < 2 && (
        <p className="mt-1 text-sm text-fg-2">
          {t('companyComparison.valuationGroups.single')}
        </p>
      )}
      <table className="mt-3 hidden w-full table-fixed text-left text-sm md:table">
        <thead>
          <tr>
            {['company', 'value', 'period', 'source'].map((key) => (
              <th key={key} className="p-2">
                {key === 'value' || key === 'source'
                  ? t(`researchUx.comparison.${key}`)
                  : t(`companyComparison.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ entry, result }) => {
            const source = entry.report.presentation.sources.find(
              (candidate) => candidate.id === result.inputs[0]?.sourceId,
            );
            return (
              <tr key={entry.assetId} className="border-t border-line">
                <th scope="row" className="p-2 font-normal">
                  <Link
                    to={researchPath(entry.assetId)}
                    className="text-primary underline underline-offset-2"
                  >
                    {entry.symbol}
                  </Link>
                </th>
                <td className="p-2">
                  {result.value !== undefined
                    ? `${formatQuantity(result.value, i18n.language)} ${t(`research.units.${result.unit ?? 'MULTIPLE'}`)} · ${t(`ratios.status.${result.status}`)}`
                    : t('ratios.status.MISSING_DATA')}
                </td>
                <td className="p-2 text-xs text-fg-2">
                  {result.periodBasis
                    ? t(`ratios.periodBasis.${result.periodBasis}`)
                    : [...new Set(result.inputs.map((f) => f.period))].join(
                        ' · ',
                      )}
                </td>
                <td className="p-2">
                  {source && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {t('researchUx.comparison.source')}
                    </a>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <dl className="mt-3 space-y-3 md:hidden">
        {rows.map(({ entry, result }) => {
          const source = entry.report.presentation.sources.find(
            (candidate) => candidate.id === result.inputs[0]?.sourceId,
          );
          return (
            <div key={entry.assetId} className="border-t border-line pt-3">
              <dt>
                <Link
                  to={researchPath(entry.assetId)}
                  className="text-primary underline underline-offset-2"
                >
                  {entry.symbol}
                </Link>
              </dt>
              <dd className="mt-1">
                {result.value !== undefined
                  ? `${formatQuantity(result.value, i18n.language)} ${t(`research.units.${result.unit ?? 'MULTIPLE'}`)} · ${t(`ratios.status.${result.status}`)}`
                  : t('ratios.status.MISSING_DATA')}
                {source && (
                  <>
                    {' · '}
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      {t('researchUx.comparison.source')}
                    </a>
                  </>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
