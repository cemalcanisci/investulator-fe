import { RiReceiptLine } from '@remixicon/react';
import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/Card/Card';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Quantity } from '@/components/Quantity/Quantity';
import { TransactionTypeBadge } from '@/components/Transactions/TransactionTypeBadge';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { Switch } from '@/components/ui/Switch';
import type { Transaction } from '@/domain/transaction';
import { useLanguage } from '@/hooks/useLanguage';
import { formatDate } from '@/lib/formatDate';
import { formatMoney } from '@/lib/formatMoney';
import { sortTransactions } from '@/lib/transactionsView';

export function AssetHistory({
  transactions,
}: {
  readonly transactions: readonly Transaction[];
}): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [showVoided, setShowVoided] = useState(false);
  const [oldestFirst, setOldestFirst] = useState(false);
  const visible = sortTransactions(
    transactions.filter((item) => showVoided || item.status === 'ACTIVE'),
    {
      sort: 'DATE',
      direction: oldestFirst ? 'asc' : 'desc',
    },
  );
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t('assetDetail.history')}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-fg-2">
            <Switch
              checked={showVoided}
              onChange={setShowVoided}
              aria-label={t('transactions.filter.showVoided')}
            />
            {t('transactions.filter.showVoided')}
          </label>
          <NativeSelect
            label={t('assetDetail.order')}
            value={oldestFirst ? 'asc' : 'desc'}
            options={[
              { value: 'desc', label: t('assetDetail.newest') },
              { value: 'asc', label: t('assetDetail.oldest') },
            ]}
            onChange={(value) => setOldestFirst(value === 'asc')}
          />
        </div>
      </div>
      <p className="text-sm text-fg-2">{t('assetDetail.historyNote')}</p>
      {visible.length === 0 ? (
        <EmptyState
          icon={RiReceiptLine}
          title={t('assetDetail.emptyHistory')}
          description={t('assetDetail.emptyHistoryNote')}
        />
      ) : (
        <ol className="flex flex-col gap-3">
          {visible.map((item) => (
            <li key={item.id}>
              <Card className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <TransactionTypeBadge type={item.type} />
                    <time
                      dateTime={item.executedAt}
                      className="text-sm text-fg-2"
                    >
                      {formatDate(item.executedAt, language)}
                      {item.executedTime !== undefined &&
                        ` · ${item.executedTime}`}
                    </time>
                    {item.status === 'VOIDED' && (
                      <span className="rounded-full bg-neg-soft px-2 py-1 text-xs text-neg">
                        {t('transactions.voided.badge')}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-end tabular-nums ${item.status === 'VOIDED' ? 'text-fg-3 line-through' : ''}`}
                  >
                    <p className="font-semibold">
                      {item.totalAmount === null
                        ? '—'
                        : formatMoney(
                            item.totalAmount,
                            language,
                            item.currency,
                          )}
                    </p>
                    {item.currency !== 'USD' && item.totalAmount !== null && (
                      <p className="mt-1 text-xs text-fg-2">
                        {formatMoney(item.usdAmount, language, 'USD')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-fg-2">
                  {item.quantity !== null && (
                    <span>
                      <Quantity quantity={item.quantity} unit={item.unit} />
                    </span>
                  )}
                  {item.splitRatio !== null && (
                    <span>
                      {t('transactions.table.splitRatio', {
                        ratio: item.splitRatio,
                      })}
                    </span>
                  )}
                  {item.platform !== null && <span>{item.platform}</span>}
                  {item.fee !== null && (
                    <span>
                      {t('transactions.table.fee', {
                        fee: formatMoney(item.fee, language, item.currency),
                      })}
                    </span>
                  )}
                </div>
                {item.note !== null && (
                  <p className="mt-2 break-words text-sm text-fg-2">
                    {item.note}
                  </p>
                )}
                {item.voidReason !== null && (
                  <p className="mt-2 break-words text-sm text-neg">
                    {t('transactions.voided.reason', {
                      reason: item.voidReason,
                    })}
                  </p>
                )}
              </Card>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
