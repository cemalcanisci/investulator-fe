import { useId, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Transaction } from '@/domain/transaction';
import { useLanguage } from '@/hooks/useLanguage';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { formatDate } from '@/lib/formatDate';
import { formatQuantity } from '@/lib/formatNumber';
import { TransactionRuleError } from '@/services/transactions';

export interface CancelTransactionDialogProps {
  /** The transaction to cancel; the dialog is shown while it is not null. */
  readonly transaction: Transaction | null;
  readonly onClose: () => void;
  readonly onCancelled: () => void;
}

function Body({
  transaction,
  onClose,
  onCancelled,
}: {
  readonly transaction: Transaction;
  readonly onClose: () => void;
  readonly onCancelled: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { cancel } = useTransactionActions();
  const reasonId = useId();
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);

  function confirm(): void {
    setError(null);
    cancel.mutate(
      {
        id: transaction.id,
        reason: reason.trim() === '' ? null : reason.trim(),
      },
      {
        onSuccess: onCancelled,
        onError: (failure) =>
          setError(
            failure instanceof TransactionRuleError
              ? t('transactions.cancelDialog.refused', {
                  asset: failure.assetName,
                  date: formatDate(failure.date, language),
                  short: formatQuantity(failure.shortBy, language),
                })
              : t('transactions.cancelDialog.failed'),
          ),
      },
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-fg-2">
        {t('transactions.cancelDialog.description')}
      </p>
      <p className="text-sm font-medium">
        {transaction.assetName} · {formatDate(transaction.executedAt, language)}
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={reasonId} className="text-sm font-medium">
          {t('transactions.cancelDialog.reason')}
        </label>
        <Input
          id={reasonId}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </div>
      {error !== null && (
        <p role="alert" className="rounded-lg bg-neg-soft p-3 text-sm text-neg">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>{t('transactions.cancelDialog.keep')}</Button>
        <Button
          danger
          type="primary"
          loading={cancel.isPending}
          onClick={confirm}
        >
          {t('transactions.cancelDialog.confirm')}
        </Button>
      </div>
    </div>
  );
}

/** Asks before cancelling: the transaction leaves every calculation but is kept, and can be restored. */
export function CancelTransactionDialog({
  transaction,
  onClose,
  onCancelled,
}: CancelTransactionDialogProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Modal
      open={transaction !== null}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      title={t('transactions.cancelDialog.title')}
    >
      {transaction !== null && (
        <Body
          key={transaction.id}
          transaction={transaction}
          onClose={onClose}
          onCancelled={onCancelled}
        />
      )}
    </Modal>
  );
}
