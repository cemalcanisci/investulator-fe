import {
  RiArrowGoBackLine,
  RiCloseCircleLine,
  RiEditLine,
} from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import type { Transaction } from '@/domain/transaction';

export interface RowActionsProps {
  readonly transaction: Transaction;
  readonly onEdit: (transaction: Transaction) => void;
  readonly onCancel: (transaction: Transaction) => void;
  readonly onRestore: (transaction: Transaction) => void;
  /** Icon buttons for the table, or labelled buttons for the card list. */
  readonly labelled?: boolean;
}

/** Edit and cancel for an active transaction, restore for a cancelled one. Never delete. */
export function RowActions({
  transaction,
  onEdit,
  onCancel,
  onRestore,
  labelled = false,
}: RowActionsProps): JSX.Element {
  const { t } = useTranslation();
  const asset = transaction.assetName;
  const size = labelled ? 'middle' : 'small';
  const icon = 'size-4';

  if (transaction.status === 'VOIDED') {
    return (
      <Button
        size={size}
        type={labelled ? 'default' : 'text'}
        icon={<RiArrowGoBackLine className={icon} aria-hidden="true" />}
        aria-label={t('transactions.actions.restoreFor', { asset })}
        title={t('transactions.actions.restore')}
        onClick={() => onRestore(transaction)}
      >
        {labelled ? t('transactions.actions.restore') : null}
      </Button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Button
        size={size}
        type={labelled ? 'default' : 'text'}
        icon={<RiEditLine className={icon} aria-hidden="true" />}
        aria-label={t('transactions.actions.editFor', { asset })}
        title={t('transactions.actions.edit')}
        onClick={() => onEdit(transaction)}
      >
        {labelled ? t('transactions.actions.edit') : null}
      </Button>
      <Button
        size={size}
        type={labelled ? 'default' : 'text'}
        icon={<RiCloseCircleLine className={icon} aria-hidden="true" />}
        aria-label={t('transactions.actions.cancelFor', { asset })}
        title={t('transactions.actions.cancel')}
        onClick={() => onCancel(transaction)}
      >
        {labelled ? t('transactions.actions.cancel') : null}
      </Button>
    </span>
  );
}
