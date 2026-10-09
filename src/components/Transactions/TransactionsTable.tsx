import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Card } from '@/components/Card/Card';
import { Quantity } from '@/components/Quantity/Quantity';
import { RowActions } from '@/components/Transactions/RowActions';
import { SortButton } from '@/components/SortButton/SortButton';
import { TransactionTypeBadge } from '@/components/Transactions/TransactionTypeBadge';
import type { Transaction } from '@/domain/transaction';
import { useLanguage } from '@/hooks/useLanguage';
import { getSign } from '@/lib/decimal';
import { formatDate } from '@/lib/formatDate';
import { formatMoney, formatUnitMoney } from '@/lib/formatMoney';
import {
  ariaSortOfTransactions,
  type TransactionOrder,
  type TransactionSort,
  type TransactionsSummary,
} from '@/lib/transactionsView';

export interface TransactionsTableProps {
  readonly transactions: readonly Transaction[];
  readonly summary: TransactionsSummary;
  readonly order: TransactionOrder;
  readonly onSort: (sort: TransactionSort) => void;
  readonly onEdit: (transaction: Transaction) => void;
  readonly onCancel: (transaction: Transaction) => void;
  readonly onRestore: (transaction: Transaction) => void;
}

const NO_VALUE = '—';

// See HoldingsTable: separate borders so the cells carry the rounded corners, which keeps the header
// and the total row able to stick to the viewport (no `overflow` on the wrapper).
const HEAD_CELL =
  'sticky top-14 z-10 border-b border-line bg-surface-2 px-3 py-2.5 text-xs font-medium text-fg-2 lg:px-4';
const BODY_CELL = 'border-b border-line px-3 py-3 align-top lg:px-4';
const FOOT_CELL =
  'sticky bottom-0 z-10 border-t border-line bg-surface-2 px-3 py-3 font-medium lg:px-4';

function priceDecimals(transaction: Transaction): number {
  return transaction.assetType === 'FX' ? 4 : 2;
}

function usesQuantity(transaction: Transaction): boolean {
  return (
    transaction.type === 'BUY' ||
    transaction.type === 'SELL' ||
    transaction.type === 'BONUS'
  );
}

/** The words that say a row is cancelled; the strike-through and dimming only support them. */
function VoidedNote({
  transaction,
}: {
  readonly transaction: Transaction;
}): JSX.Element | null {
  const { t } = useTranslation();
  if (transaction.status !== 'VOIDED') {
    return null;
  }
  return (
    <span
      className="mt-1 inline-flex h-[22px] items-center rounded-full bg-neg-soft px-2 text-xs font-medium text-neg no-underline"
      title={
        transaction.voidReason === null
          ? undefined
          : t('transactions.voided.reason', { reason: transaction.voidReason })
      }
    >
      {t('transactions.voided.badge')}
    </span>
  );
}

function QuantityCell({
  transaction,
}: {
  readonly transaction: Transaction;
}): JSX.Element {
  const { t } = useTranslation();
  if (transaction.type === 'SPLIT' && transaction.splitRatio !== null) {
    return (
      <>
        {t('transactions.table.splitRatio', { ratio: transaction.splitRatio })}
      </>
    );
  }
  return usesQuantity(transaction) ? (
    <Quantity quantity={transaction.quantity} unit={transaction.unit} />
  ) : (
    <>{NO_VALUE}</>
  );
}

function useAmounts(transaction: Transaction): {
  readonly unitPrice: string;
  readonly amount: string;
  readonly fee: string | null;
  readonly usd: string;
} {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { currency } = transaction;
  return {
    unitPrice:
      transaction.unitPrice === null
        ? NO_VALUE
        : formatUnitMoney(
            transaction.unitPrice,
            language,
            currency,
            priceDecimals(transaction),
          ),
    amount:
      transaction.totalAmount === null
        ? NO_VALUE
        : formatMoney(transaction.totalAmount, language, currency),
    fee:
      transaction.fee === null
        ? null
        : t('transactions.table.fee', {
            fee: formatMoney(transaction.fee, language, currency),
          }),
    // Bonus shares and splits create no cost, so there is nothing to convert.
    usd:
      getSign(transaction.usdAmount) === 'zero'
        ? NO_VALUE
        : formatMoney(transaction.usdAmount, language, 'USD'),
  };
}

function RateCell({
  transaction,
}: {
  readonly transaction: Transaction;
}): JSX.Element {
  const { t } = useTranslation();
  if (
    transaction.currency === 'USD' ||
    getSign(transaction.usdAmount) === 'zero'
  ) {
    return <>{NO_VALUE}</>;
  }
  return (
    <span
      title={t('transactions.rate.title', {
        currency: transaction.currency,
        rate: transaction.fxRateToUsd,
      })}
    >
      {t(`transactions.rate.${transaction.fxRateSource}`)}
    </span>
  );
}

function Row({
  transaction,
  onEdit,
  onCancel,
  onRestore,
}: Pick<TransactionsTableProps, 'onEdit' | 'onCancel' | 'onRestore'> & {
  readonly transaction: Transaction;
}): JSX.Element {
  const { language } = useLanguage();
  const amounts = useAmounts(transaction);
  const voided = transaction.status === 'VOIDED';
  // Cancelled rows are dimmed and struck through, cell by cell so the badge and buttons stay crisp.
  const dim = voided ? 'text-fg-3 line-through' : '';

  return (
    <tr className="hover:bg-surface-2">
      <td className={`${BODY_CELL} whitespace-nowrap ${dim}`}>
        {formatDate(transaction.executedAt, language)}
        {transaction.executedTime !== undefined && (
          <span className="block text-xs text-fg-2">
            {transaction.executedTime}
          </span>
        )}
      </td>
      <td className={BODY_CELL}>
        <TransactionTypeBadge type={transaction.type} />
      </td>
      <td className={BODY_CELL}>
        <p className={`font-medium ${dim}`}>{transaction.assetName}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-fg-2">
          <span className={dim}>{transaction.symbol}</span>
          <AssetTypeBadge assetType={transaction.assetType} />
          {transaction.platform !== null && (
            <span className={dim}>{transaction.platform}</span>
          )}
        </p>
        <VoidedNote transaction={transaction} />
      </td>
      <td className={`${BODY_CELL} text-end tabular-nums ${dim}`}>
        <QuantityCell transaction={transaction} />
      </td>
      <td
        className={`${BODY_CELL} hidden text-end tabular-nums lg:table-cell ${dim}`}
      >
        {amounts.unitPrice}
      </td>
      <td className={`${BODY_CELL} text-end tabular-nums ${dim}`}>
        <p className="font-medium">{amounts.amount}</p>
        {amounts.fee !== null && (
          <p className="mt-1 text-xs text-fg-2">{amounts.fee}</p>
        )}
      </td>
      <td className={`${BODY_CELL} text-end font-medium tabular-nums ${dim}`}>
        {amounts.usd}
      </td>
      <td
        className={`${BODY_CELL} hidden text-end text-xs text-fg-2 xl:table-cell ${dim}`}
      >
        <RateCell transaction={transaction} />
      </td>
      <td className={`${BODY_CELL} text-end`}>
        <RowActions
          transaction={transaction}
          onEdit={onEdit}
          onCancel={onCancel}
          onRestore={onRestore}
        />
      </td>
    </tr>
  );
}

function Cards({
  transactions,
  onEdit,
  onCancel,
  onRestore,
}: Pick<
  TransactionsTableProps,
  'transactions' | 'onEdit' | 'onCancel' | 'onRestore'
>): JSX.Element {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onEdit={onEdit}
          onCancel={onCancel}
          onRestore={onRestore}
        />
      ))}
    </ul>
  );
}

function TransactionCard({
  transaction,
  onEdit,
  onCancel,
  onRestore,
}: Pick<TransactionsTableProps, 'onEdit' | 'onCancel' | 'onRestore'> & {
  readonly transaction: Transaction;
}): JSX.Element {
  const { language } = useLanguage();
  const amounts = useAmounts(transaction);
  const dim = transaction.status === 'VOIDED' ? 'text-fg-3 line-through' : '';

  return (
    <li>
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`truncate font-medium ${dim}`}>
              {transaction.assetName}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-fg-2">
              <TransactionTypeBadge type={transaction.type} />
              <span className={dim}>
                {formatDate(transaction.executedAt, language)}
                {transaction.executedTime !== undefined &&
                  ` · ${transaction.executedTime}`}
              </span>
            </p>
            <VoidedNote transaction={transaction} />
          </div>
          <div
            className={`flex flex-col items-end gap-0.5 tabular-nums ${dim}`}
          >
            <span className="font-semibold">{amounts.amount}</span>
            {amounts.usd !== NO_VALUE && transaction.currency !== 'USD' && (
              <span className="text-xs text-fg-2">{amounts.usd}</span>
            )}
          </div>
        </div>
        <p className={`text-xs tabular-nums text-fg-2 ${dim}`}>
          <QuantityCell transaction={transaction} />
          {transaction.unitPrice !== null && ` · ${amounts.unitPrice}`}
          {transaction.platform !== null && ` · ${transaction.platform}`}
        </p>
        <div>
          <RowActions
            labelled
            transaction={transaction}
            onEdit={onEdit}
            onCancel={onCancel}
            onRestore={onRestore}
          />
        </div>
      </Card>
    </li>
  );
}

export function TransactionsTable({
  transactions,
  summary,
  order,
  onSort,
  onEdit,
  onCancel,
  onRestore,
}: TransactionsTableProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <>
      <div className="hidden rounded-xl border border-line bg-surface shadow-card md:block">
        <table className="w-full border-separate border-spacing-0">
          <caption className="sr-only">
            {t('transactions.table.caption')}
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={ariaSortOfTransactions(order, 'DATE')}
                className={`${HEAD_CELL} rounded-tl-xl text-start`}
              >
                <SortButton
                  label={t('transactions.table.date')}
                  sort="DATE"
                  order={order}
                  onSort={onSort}
                />
              </th>
              <th scope="col" className={`${HEAD_CELL} text-start`}>
                {t('transactions.table.type')}
              </th>
              <th scope="col" className={`${HEAD_CELL} text-start`}>
                {t('transactions.table.asset')}
              </th>
              <th scope="col" className={`${HEAD_CELL} text-end`}>
                {t('transactions.table.quantity')}
              </th>
              <th
                scope="col"
                className={`${HEAD_CELL} hidden text-end lg:table-cell`}
              >
                {t('transactions.table.unitPrice')}
              </th>
              <th scope="col" className={`${HEAD_CELL} text-end`}>
                {t('transactions.table.amount')}
              </th>
              <th
                scope="col"
                aria-sort={ariaSortOfTransactions(order, 'AMOUNT')}
                className={`${HEAD_CELL} text-end`}
              >
                <SortButton
                  label={t('transactions.table.usd')}
                  sort="AMOUNT"
                  order={order}
                  onSort={onSort}
                />
              </th>
              <th
                scope="col"
                className={`${HEAD_CELL} hidden text-end xl:table-cell`}
              >
                {t('transactions.table.rate')}
              </th>
              <th scope="col" className={`${HEAD_CELL} rounded-tr-xl text-end`}>
                <span className="sr-only">
                  {t('transactions.table.actions')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {transactions.map((transaction) => (
              <Row
                key={transaction.id}
                transaction={transaction}
                onEdit={onEdit}
                onCancel={onCancel}
                onRestore={onRestore}
              />
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th
                scope="row"
                colSpan={5}
                className={`${FOOT_CELL} rounded-bl-xl text-start lg:hidden`}
              >
                {t('transactions.table.total', { count: summary.count })}
              </th>
              <th
                scope="row"
                colSpan={6}
                className={`${FOOT_CELL} hidden rounded-bl-xl text-start lg:table-cell`}
              >
                {t('transactions.table.total', { count: summary.count })}
              </th>
              <td className={`${FOOT_CELL} text-end tabular-nums`}>
                <p>
                  <span className="text-xs font-normal text-fg-2">
                    {t('transactions.table.bought')}{' '}
                  </span>
                  {formatMoney(summary.boughtUsd, language, 'USD')}
                </p>
                <p className="mt-1">
                  <span className="text-xs font-normal text-fg-2">
                    {t('transactions.table.sold')}{' '}
                  </span>
                  {formatMoney(summary.soldUsd, language, 'USD')}
                </p>
              </td>
              <td className={`${FOOT_CELL} hidden xl:table-cell`} />
              <td className={`${FOOT_CELL} rounded-br-xl`} />
            </tr>
          </tfoot>
        </table>
      </div>

      <Cards
        transactions={transactions}
        onEdit={onEdit}
        onCancel={onCancel}
        onRestore={onRestore}
      />
    </>
  );
}
