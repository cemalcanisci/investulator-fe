import { RiAddLine, RiReceiptLine, RiSearchLine } from '@remixicon/react';
import { useEffect, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { CancelTransactionDialog } from '@/components/Transactions/CancelTransactionDialog';
import { TransactionFormModal } from '@/components/Transactions/TransactionFormModal';
import { TransactionsSkeleton } from '@/components/Transactions/TransactionsSkeleton';
import { TransactionsTable } from '@/components/Transactions/TransactionsTable';
import { TransactionsToolbar } from '@/components/Transactions/TransactionsToolbar';
import { Button } from '@/components/ui/Button';
import type { Transaction } from '@/domain/transaction';
import { useLanguage } from '@/hooks/useLanguage';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useTransactions } from '@/hooks/useTransactions';
import { formatDate, todayIso } from '@/lib/formatDate';
import { formatQuantity } from '@/lib/formatNumber';
import {
  DEFAULT_TRANSACTION_FILTER,
  DEFAULT_TRANSACTION_ORDER,
  countByTransactionType,
  filterTransactions,
  hiddenVoidedCount,
  nextTransactionOrder,
  platformsOf,
  sortTransactions,
  summaryOf,
  type TransactionFilter,
  type TransactionOrder,
} from '@/lib/transactionsView';
import { TransactionRuleError } from '@/services/transactions';

const PAGE_SIZE = 25;

interface Message {
  readonly kind: 'status' | 'error';
  readonly text: string;
}

export function TransactionsPage(): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const transactions = useTransactions();
  const { restore } = useTransactionActions();
  const [filter, setFilter] = useState<TransactionFilter>(
    DEFAULT_TRANSACTION_FILTER,
  );
  const [order, setOrder] = useState<TransactionOrder>(
    DEFAULT_TRANSACTION_ORDER,
  );
  const [shown, setShown] = useState(PAGE_SIZE);
  // The form is open while this is not null; `editing` is null for a new transaction.
  const [form, setForm] = useState<{
    readonly editing: Transaction | null;
  } | null>(null);
  const [cancelling, setCancelling] = useState<Transaction | null>(null);
  const [message, setMessage] = useState<Message | null>(null);
  const today = todayIso();

  // "Add investment" elsewhere in the app arrives here asking for the form.
  useEffect(() => {
    if (params.get('yeni') === '1') {
      setForm({ editing: null });
      const next = new URLSearchParams(params);
      next.delete('yeni');
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  function updateFilter(next: TransactionFilter): void {
    setFilter(next);
    setShown(PAGE_SIZE);
  }

  function say(text: string): void {
    setMessage({ kind: 'status', text });
  }

  function restoreTransaction(transaction: Transaction): void {
    setMessage(null);
    restore.mutate(transaction.id, {
      onSuccess: () => say(t('transactions.status.restored')),
      onError: (error) =>
        setMessage({
          kind: 'error',
          text:
            error instanceof TransactionRuleError
              ? t('transactions.restoreError', {
                  asset: error.assetName,
                  date: formatDate(error.date, language),
                  short: formatQuantity(error.shortBy, language),
                })
              : t('transactions.restoreFailed'),
        }),
    });
  }

  function renderBody(): JSX.Element {
    if (transactions.isPending) {
      return <TransactionsSkeleton />;
    }
    if (transactions.isError) {
      return <ErrorState onRetry={() => void transactions.refetch()} />;
    }
    const scopedAsset = params.get('varlik');
    const all =
      scopedAsset === null
        ? transactions.data
        : transactions.data.filter((item) => item.assetId === scopedAsset);
    if (all.length === 0) {
      return (
        <EmptyState
          icon={RiReceiptLine}
          title={t('transactions.empty.title')}
          description={t('transactions.empty.description')}
          actions={
            <>
              <Button type="primary" onClick={() => setForm({ editing: null })}>
                {t('transactions.empty.add')}
              </Button>
              <Button onClick={() => void navigate(ROUTE_PATHS.importExport)}>
                {t('transactions.empty.import')}
              </Button>
            </>
          }
        />
      );
    }
    const matching = sortTransactions(
      filterTransactions(all, filter, language, today),
      order,
    );
    const hidden = hiddenVoidedCount(all, filter, language, today);

    return (
      <>
        <TransactionsToolbar
          filter={filter}
          typeCounts={countByTransactionType(
            filterTransactions(
              all,
              { ...filter, type: 'ALL' },
              language,
              today,
            ),
          )}
          platforms={platformsOf(all)}
          sort={order.sort}
          onFilterChange={updateFilter}
          onSortChange={(sort) => setOrder({ sort, direction: 'desc' })}
        />
        {hidden > 0 && (
          <p className="text-sm text-fg-2">
            {t('transactions.filter.hiddenVoided', { count: hidden })}
          </p>
        )}
        {matching.length === 0 ? (
          <EmptyState
            icon={RiSearchLine}
            title={t('transactions.noResults.title')}
            description={t('transactions.noResults.description')}
            actions={
              <Button onClick={() => updateFilter(DEFAULT_TRANSACTION_FILTER)}>
                {t('transactions.noResults.clear')}
              </Button>
            }
          />
        ) : (
          <>
            <TransactionsTable
              transactions={matching.slice(0, shown)}
              summary={summaryOf(matching)}
              order={order}
              onSort={(sort) => setOrder(nextTransactionOrder(order, sort))}
              onEdit={(transaction) => setForm({ editing: transaction })}
              onCancel={setCancelling}
              onRestore={restoreTransaction}
            />
            {matching.length > shown && (
              <div className="flex justify-center">
                <Button onClick={() => setShown(shown + PAGE_SIZE)}>
                  {t('transactions.more', { count: matching.length - shown })}
                </Button>
              </div>
            )}
          </>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('transactions.title')}
        </h1>
        <Button
          type="primary"
          icon={<RiAddLine className="size-4" aria-hidden="true" />}
          onClick={() => setForm({ editing: null })}
        >
          {t('transactions.add')}
        </Button>
      </div>
      {message !== null && (
        <p
          role={message.kind === 'error' ? 'alert' : 'status'}
          className={`text-sm ${message.kind === 'error' ? 'rounded-lg bg-neg-soft p-3 text-neg' : 'text-fg-2'}`}
        >
          {message.text}
        </p>
      )}
      {params.has('varlik') && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-fg-2">
          <span>
            {t('assetDetail.scoped', {
              asset:
                transactions.data?.find(
                  (item) => item.assetId === params.get('varlik'),
                )?.assetName ?? params.get('varlik'),
            })}
          </span>
          <Button type="link" onClick={() => setParams({}, { replace: true })}>
            {t('assetDetail.allTransactions')}
          </Button>
        </div>
      )}
      {renderBody()}

      <TransactionFormModal
        open={form !== null}
        editing={form?.editing ?? null}
        transactions={transactions.data ?? []}
        onClose={() => setForm(null)}
        onSaved={(kind) => {
          setForm(null);
          say(
            kind === 'created'
              ? t('transactions.status.created')
              : t('transactions.status.updated'),
          );
        }}
      />
      <CancelTransactionDialog
        transaction={cancelling}
        onClose={() => setCancelling(null)}
        onCancelled={() => {
          setCancelling(null);
          say(t('transactions.status.cancelled'));
        }}
      />
    </div>
  );
}
