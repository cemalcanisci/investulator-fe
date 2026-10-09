import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionForm } from '@/components/Transactions/TransactionForm';
import { Modal } from '@/components/ui/Modal';
import type { Transaction } from '@/domain/transaction';

export interface TransactionFormModalProps {
  readonly open: boolean;
  /** The transaction being edited, or null for a new one. */
  readonly editing: Transaction | null;
  readonly transactions: readonly Transaction[];
  readonly onClose: () => void;
  readonly onSaved: (kind: 'created' | 'updated') => void;
}

/** New and edit share one modal: a centered dialog from small screens up, full screen on phones. */
export function TransactionFormModal({
  open,
  editing,
  transactions,
  onClose,
  onSaved,
}: TransactionFormModalProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
      width="100%"
      className="w-full max-w-none sm:max-w-[640px] max-sm:top-0 max-sm:m-0 max-sm:pb-0"
      classNames={{ container: 'max-sm:min-h-dvh max-sm:rounded-none' }}
      title={
        editing === null
          ? t('transactions.form.titleNew')
          : t('transactions.form.titleEdit')
      }
    >
      <TransactionForm
        key={editing?.id ?? 'new'}
        editing={editing}
        transactions={transactions}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Modal>
  );
}
