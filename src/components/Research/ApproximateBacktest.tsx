import { useState } from 'react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ApproximateHistory } from '@/domain/approximateHistory';
import { approximateBacktest } from '@/lib/approximateBacktest';
import type {
  ApproximateOptions,
  ApproximatePerformance,
  ApproximateResult,
} from '@/lib/approximateBacktest';
import { formatQuantity } from '@/lib/formatNumber';
import {
  compareDecimals,
  divideDecimals,
  multiplyDecimals,
  subtractDecimals,
} from '@/lib/decimal';
import { ResearchDisclosurePanel } from './ResearchDisclosurePanel';

function ResultCard({
  result,
  unit,
  currency,
}: {
  readonly result: ApproximateResult;
  readonly unit: 'usd' | 'local';
  readonly currency: string;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const format = (value: string): string =>
    formatQuantity(value, i18n.language);
  const policies = ['reinvest', 'cash', 'priceOnly'] as const;
  const available = policies
    .map((key) => result[key]?.[unit])
    .filter((p): p is ApproximatePerformance => !!p);
  const max = available.reduce(
    (value, p) => (compareDecimals(p.balance, value) > 0 ? p.balance : value),
    '0',
  );
  return (
    <article className="min-w-0 space-y-4 rounded-xl border border-line bg-surface-2 p-4">
      <h4 className="text-lg font-semibold">
        {t('approximate.period', { years: result.years })}
      </h4>
      <p className="text-xs text-fg-2">
        {result.from} → {result.to}
      </p>
      <p className="text-sm font-medium">
        {t(`approximate.status.${result.status}`)}
      </p>
      {result.issues.map((issue) => (
        <p key={issue} className="text-sm leading-6">
          {t(`approximate.issues.${issue}`)}
        </p>
      ))}
      {policies.map((policy) => {
        const p = result[policy]?.[unit];
        if (!p) {
          return null;
        }
        const width =
          compareDecimals(max, '0') > 0
            ? divideDecimals(multiplyDecimals(p.balance, '100'), max, 2)
            : '0';
        return (
          <div
            key={policy}
            className="space-y-2 rounded-lg border border-line bg-surface p-3"
          >
            <h5 className="text-sm font-medium">
              {t(`approximate.policies.${policy}`)}
            </h5>
            <p className="break-words text-xl font-semibold tabular-nums">
              ≈ {format(p.balance)} {currency}
            </p>
            <div aria-hidden="true" className="h-2 rounded bg-surface-2">
              <div
                className="h-2 rounded bg-primary"
                style={{ width: `${width}%` }}
              />
            </div>
            <dl className="space-y-2 text-sm">
              {(
                [
                  'invested',
                  'equity',
                  'cash',
                  'receivable',
                  'profit',
                  'gain',
                  'xirr',
                ] as const
              ).map((key) => (
                <div
                  key={key}
                  className="flex flex-wrap justify-between gap-x-2"
                >
                  <dt className="text-fg-2">
                    {t(`approximate.fields.${key}`)}
                  </dt>
                  <dd className="tabular-nums">
                    {p[key] === null
                      ? '—'
                      : `${format(p[key])} ${key === 'gain' || key === 'xirr' ? '%' : currency}`}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        );
      })}
      {result.cash && result.reinvest && (
        <p className="rounded-lg bg-info-soft p-3 text-sm leading-6">
          {t('approximate.difference', {
            value: format(
              subtractDecimals(
                result.reinvest[unit].balance,
                result.cash[unit].balance,
              ),
            ),
            currency,
          })}
        </p>
      )}
    </article>
  );
}

export function ApproximateBacktest({
  history,
}: {
  readonly history?: ApproximateHistory;
}): JSX.Element {
  const { t } = useTranslation();
  const [mode, setMode] = useState<ApproximateOptions['mode']>('MONTHLY');
  const [amount, setAmount] = useState('1000');
  const [unit, setUnit] = useState<'usd' | 'local'>('usd');
  const results = history
    ? [10, 15, 20].map((years) =>
        approximateBacktest(history, years, { mode, amountUsd: amount }),
      )
    : [];
  return (
    <section
      id="approximate-backtest"
      aria-labelledby="approximate-title"
      className="scroll-mt-36 space-y-5 rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <h3 id="approximate-title" className="text-xl font-semibold">
        {t('approximate.title')}
      </h3>
      <p className="text-sm leading-7">
        {t('approximate.question', {
          amount,
          mode: t(`approximate.modes.${mode}`),
        })}
      </p>
      <p className="rounded-lg bg-warn-soft p-4 text-sm leading-7">
        {t('approximate.notice')}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-2 text-sm">
          <span className="block">{t('approximate.mode')}</span>
          <select
            className="w-full rounded-lg border border-line bg-surface p-3"
            value={mode}
            onChange={(e) =>
              setMode(e.target.value === 'LUMP_SUM' ? 'LUMP_SUM' : 'MONTHLY')
            }
          >
            {(['MONTHLY', 'LUMP_SUM'] as const).map((value) => (
              <option key={value} value={value}>
                {t(`approximate.modes.${value}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="block">{t('approximate.amount')}</span>
          <input
            className="w-full rounded-lg border border-line bg-surface p-3"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="block">{t('approximate.unit')}</span>
          <select
            className="w-full rounded-lg border border-line bg-surface p-3"
            value={unit}
            onChange={(e) =>
              setUnit(e.target.value === 'local' ? 'local' : 'usd')
            }
          >
            <option value="usd">USD</option>
            <option value="local">
              {history?.currency ?? t('approximate.local')}
            </option>
          </select>
        </label>
      </div>
      {!history ? (
        <p>{t('approximate.issues.COVERAGE')}</p>
      ) : (
        <>
          <p className="text-sm text-fg-2">
            {t('approximate.cutoff', { date: history.asOf })}
          </p>
          <div className="grid items-start gap-4 xl:grid-cols-3">
            {results.map((result) => (
              <ResultCard
                key={result.years}
                result={result}
                unit={unit}
                currency={unit === 'usd' ? 'USD' : history.currency}
              />
            ))}
          </div>
          <p className="text-sm leading-7">{t('approximate.cashNote')}</p>
          <ResearchDisclosurePanel title={t('approximate.details')}>
            <p className="text-sm leading-7">{t('approximate.method')}</p>
            <p className="text-sm leading-7">{t('approximate.formulas')}</p>
            <p className="text-sm leading-7">
              {t('approximate.quality', {
                months: history.monthly.length,
                dividends: history.dividends.length,
              })}
            </p>
            <ul className="space-y-3 text-sm">
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
                  <p>
                    {source.retrievedAt} · {source.origin}
                  </p>
                </li>
              ))}
            </ul>
            <details>
              <summary className="text-sm text-primary">
                {t('approximate.trace')}
              </summary>
              <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-surface-2 p-3 text-xs">
                {JSON.stringify(
                  {
                    coverage: history.coverage,
                    actions: history.actions,
                    dividends: history.dividends,
                    results,
                  },
                  null,
                  2,
                )}
              </pre>
            </details>
          </ResearchDisclosurePanel>
        </>
      )}
      <a className="text-sm text-primary underline" href="#dividend-backtest">
        {t('approximate.verifiedLink')}
      </a>
    </section>
  );
}
