import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { DividendHistory } from '@/domain/dividendHistory';
import { backtestDividends } from '@/lib/dividendBacktest';
import { formatQuantity } from '@/lib/formatNumber';

export function DividendBacktest({
  history,
}: {
  readonly history?: DividendHistory;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const format = (value: string): string =>
    formatQuantity(value, i18n.language);
  return (
    <section
      id="dividend-backtest"
      aria-labelledby="backtest-title"
      className="scroll-mt-36 space-y-5 rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <div>
        <p className="mb-2 text-sm font-medium text-primary">
          {t('backtest.eyebrow')}
        </p>
        <h3 id="backtest-title" className="text-xl font-semibold">
          {t('backtest.title')}
        </h3>
        <p className="mt-3 text-sm leading-7 text-fg-2">
          {t('backtest.description')}
        </p>
      </div>
      <p className="rounded-lg bg-info-soft p-4 text-sm leading-7">
        {t('backtest.notice')}
      </p>
      {history && (
        <p className="text-sm text-fg-2">
          {t('backtest.dates', {
            date: history.asOf,
            retrieved: history.retrievedAt,
          })}
        </p>
      )}
      <div className="grid gap-4 xl:grid-cols-3">
        {[10, 15, 20].map((years) => {
          const row = history ? backtestDividends(history, years) : undefined;
          return (
            <article
              key={years}
              className="rounded-xl border border-line bg-surface-2 p-5"
            >
              <h4 className="text-lg font-semibold">
                {t('backtest.years', { count: years })}
              </h4>
              {row && (
                <p className="mt-1 text-xs text-fg-2">
                  {row.from} → {row.to}
                </p>
              )}
              {row?.status === 'COMPLETE' ? (
                <>
                  <p className="mt-5 text-xs text-fg-2">
                    {t('backtest.balance')}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums text-primary">
                    ≈ {format(row.balance ?? '0')} USD
                  </p>
                  <dl className="mt-5 space-y-3 text-sm">
                    {(
                      [
                        'invested',
                        'profit',
                        'dividends',
                        'receivable',
                        'gain',
                        'simpleAnnual',
                        'xirr',
                      ] as const
                    ).map((key) => (
                      <div
                        key={key}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2"
                      >
                        <dt className="text-fg-2">{t(`backtest.${key}`)}</dt>
                        <dd className="whitespace-nowrap text-right font-semibold tabular-nums">
                          {row[key] == null
                            ? '—'
                            : `${format(row[key])} ${['gain', 'simpleAnnual', 'xirr'].includes(key) ? '%' : 'USD'}`}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-5 rounded-lg bg-surface p-3 text-sm leading-6">
                    {t('backtest.summary', {
                      invested: format(row.invested),
                      balance: format(row.balance ?? '0'),
                      gain: format(row.gain ?? '0'),
                      simple: format(row.simpleAnnual ?? '0'),
                      years,
                    })}
                  </p>
                  <details className="mt-4 text-sm">
                    <summary className="cursor-pointer text-primary">
                      {t('backtest.trace')}
                    </summary>
                    <div className="mt-3 max-h-72 overflow-auto">
                      <table className="w-full text-xs">
                        <caption className="mb-2 text-left leading-5">
                          {t('backtest.traceNote')}
                        </caption>
                        <thead>
                          <tr>
                            {['date', 'kind', 'usd', 'price', 'fx'].map(
                              (key) => (
                                <th key={key} className="p-2 text-left">
                                  {t(`backtest.columns.${key}`)}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {row.entries.map((entry, index) => (
                            <tr
                              key={`${entry.date}-${index}`}
                              className="border-t border-line"
                            >
                              <td className="whitespace-nowrap p-2">
                                {entry.date}
                              </td>
                              <td className="p-2">
                                {t(`backtest.kinds.${entry.kind}`)}
                              </td>
                              <td className="p-2 tabular-nums">
                                {format(entry.usd)}
                              </td>
                              <td className="p-2 tabular-nums">
                                {format(entry.price)}
                              </td>
                              <td className="p-2 tabular-nums">
                                {format(entry.fx)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                </>
              ) : (
                <div className="mt-4 text-sm leading-7">
                  <p>{t(`backtest.status.${row?.status ?? 'MISSING_DATA'}`)}</p>
                  <ul>
                    {row?.issues?.map((issue) => (
                      <li key={issue}>
                        {t(`analysis.historyIssues.${issue}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>
      <div className="rounded-lg border border-line p-4 text-sm leading-7">
        <h4 className="font-semibold">{t('backtest.explanationTitle')}</h4>
        <p className="mt-2">{t('backtest.explanation')}</p>
        <p className="mt-2">{t('backtest.xirrExplanation')}</p>
      </div>
      <details className="rounded-lg border border-line p-4 text-sm leading-7">
        <summary className="cursor-pointer font-semibold text-primary">
          {t('backtest.methodTitle')}
        </summary>
        <p className="mt-3">{t('backtest.method')}</p>
        <p className="mt-3">{t('backtest.formulas')}</p>
        <p className="mt-3">{t('backtest.limits')}</p>
        {history?.review === 'PARTIAL' && (
          <p className="mt-3">{t('backtest.review')}</p>
        )}
        {history && (
          <ul className="mt-3 space-y-2">
            {history.sources.map((source) => (
              <li key={source.id}>
                <a
                  className="break-words text-primary underline"
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </details>
    </section>
  );
}
