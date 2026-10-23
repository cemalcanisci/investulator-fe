import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ComparisonCandidate } from '@/lib/researchComparison';
import { researchComparison } from '@/lib/researchComparison';
import { toDisplayNumber } from '@/lib/decimal';
import { formatQuantity } from '@/lib/formatNumber';

export function ResearchComparison({
  candidates,
  mode,
}: {
  readonly candidates: readonly ComparisonCandidate[];
  readonly mode: 'HISTORY' | 'PEERS';
}): JSX.Element {
  const { t, i18n } = useTranslation(),
    result = researchComparison(candidates, mode);
  const comparable = result.groups.filter((g) => g.points.length >= 2);
  return (
    <div className="space-y-4">
      <p className="text-sm leading-7">
        {t(
          `researchUx.comparison.${mode === 'PEERS' && candidates.length ? 'peerConditions' : mode}`,
        )}
      </p>
      {!comparable.length && (
        <p className="rounded-lg bg-info-soft p-4 text-sm" role="status">
          {t('researchUx.comparison.empty')}
        </p>
      )}
      {(result.groups.length > 1 || result.rejected > 0) && (
        <p className="text-sm leading-7">
          {t('researchUx.comparison.separated')}
        </p>
      )}
      {result.groups.map((group) => {
        const basis = group.points[0]?.fact.basis;
        return (
          <div
            key={group.basis}
            className="min-w-0 rounded-xl border border-line bg-surface p-4"
          >
            <p className="mb-3 text-sm">
              {basis?.currency} · {basis?.accounting} ·{' '}
              {basis?.purchasingPowerDate ?? t('researchUx.comparison.nominal')}{' '}
              · {t(`analysis.scope.${basis?.scope}`)}
            </p>
            {group.points.length >= 2 ? (
              <figure>
                <figcaption className="mb-3 text-sm">
                  {t('researchUx.comparison.chartHint')}
                </figcaption>
                <div
                  className="h-52"
                  role="img"
                  aria-label={t('researchUx.comparison.chartLabel')}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      accessibilityLayer
                      data={group.points.map((p) => ({
                        label: p.label,
                        value: toDisplayNumber(p.fact.value),
                      }))}
                    >
                      <CartesianGrid stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="label" stroke="var(--text-2)" />
                      <YAxis
                        width={65}
                        tickFormatter={(value) =>
                          new Intl.NumberFormat(i18n.language, {
                            notation: 'compact',
                          }).format(value)
                        }
                        stroke="var(--text-2)"
                      />
                      <Bar
                        dataKey="value"
                        fill="var(--chart-1)"
                        isAnimationActive={false}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </figure>
            ) : (
              <p className="text-sm text-fg-2">
                {t('researchUx.comparison.single')}
              </p>
            )}
            <table className="hidden w-full table-fixed text-left text-sm md:table">
              <caption className="py-3 text-left">
                {t('researchUx.comparison.table')}
              </caption>
              <thead>
                <tr>
                  {['period', 'value', 'source'].map((key) => (
                    <th key={key} className="p-2">
                      {t(`researchUx.comparison.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {group.points.map((p) => (
                  <tr key={p.label} className="border-t border-line">
                    <th scope="row" className="break-words p-2 font-normal">
                      {p.label}
                    </th>
                    <td className="break-words p-2">
                      {formatQuantity(p.fact.value, i18n.language)}{' '}
                      {p.fact.unit}
                    </td>
                    <td className="p-2">
                      <a
                        className="text-primary underline"
                        href={p.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t('researchUx.comparison.source')}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-3 space-y-3 md:hidden">
              {group.points.map((p) => (
                <div key={p.label} className="border-t border-line pt-3">
                  <dt>{p.label}</dt>
                  <dd className="break-words">
                    {formatQuantity(p.fact.value, i18n.language)} {p.fact.unit}{' '}
                    ·{' '}
                    <a
                      className="text-primary underline"
                      href={p.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t('researchUx.comparison.source')}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
    </div>
  );
}
