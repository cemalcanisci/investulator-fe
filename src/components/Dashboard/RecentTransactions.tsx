import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Quantity } from '@/components/Quantity/Quantity';
import { Card } from '@/components/Card/Card';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/formatDate';
import { formatMoney } from '@/lib/formatMoney';
import type { RecentTransaction } from '@/services/dashboard';

export interface RecentTransactionsProps {
  readonly transactions: readonly RecentTransaction[];
}

const NO_AMOUNT = '—';

export function RecentTransactions({
  transactions,
}: RecentTransactionsProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();

  // What was actually paid, in the currency it was paid in: a recorded fact, not a converted value.
  function amountOf(transaction: RecentTransaction): string {
    return transaction.totalAmount === null
      ? NO_AMOUNT
      : formatMoney(transaction.totalAmount, language, transaction.currency);
  }

  return (
    <Card className="p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          {t('dashboard.recent.title')}
        </h2>
        <Link className="text-sm text-primary" to={ROUTE_PATHS.transactions}>
          {t('dashboard.recent.viewAll')}
        </Link>
      </div>

      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-line text-start text-xs text-fg-2">
            <th className="py-2 pe-3 text-start font-medium">
              {t('dashboard.recent.date')}
            </th>
            <th className="py-2 pe-3 text-start font-medium">
              {t('dashboard.recent.type')}
            </th>
            <th className="py-2 pe-3 text-start font-medium">
              {t('dashboard.recent.asset')}
            </th>
            <th className="py-2 pe-3 text-end font-medium">
              {t('dashboard.recent.quantity')}
            </th>
            <th className="py-2 text-end font-medium">
              {t('dashboard.recent.amount')}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-line last:border-0"
            >
              <td className="py-3 pe-3 text-fg-2">
                {formatDate(transaction.executedAt, language)}
              </td>
              <td className="py-3 pe-3">
                {t(`transactionTypes.${transaction.type}`)}
              </td>
              <td className="py-3 pe-3">
                <span className="font-medium">{transaction.assetName}</span>
                <span className="ms-2 text-xs text-fg-2">
                  {transaction.symbol}
                </span>
              </td>
              <td className="py-3 pe-3 text-end tabular-nums">
                <Quantity
                  quantity={transaction.quantity}
                  unit={transaction.unit}
                />
              </td>
              <td className="py-3 text-end font-medium tabular-nums">
                {amountOf(transaction)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="divide-y divide-line md:hidden">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="flex flex-col gap-1.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{transaction.assetName}</span>
              <span className="font-medium tabular-nums">
                {amountOf(transaction)}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-2">
              <span>
                {t(`transactionTypes.${transaction.type}`)} ·{' '}
                <Quantity
                  quantity={transaction.quantity}
                  unit={transaction.unit}
                />
              </span>
              <span className="inline-flex items-center gap-2">
                <AssetTypeBadge assetType={transaction.assetType} />
                {formatDate(transaction.executedAt, language)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
