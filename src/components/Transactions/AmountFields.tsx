import { useId, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/Transactions/Field';
import { Input } from '@/components/ui/Input';
import type { QuantityUnit } from '@/domain/assetTypes';
import {
  AMOUNT_FIELDS,
  type AmountField,
  type ResolvedAmounts,
} from '@/lib/transactionForm';

export interface AmountFieldsProps {
  readonly resolved: ResolvedAmounts;
  readonly unit: QuantityUnit | null;
  readonly error?: string;
  readonly onType: (field: AmountField, text: string) => void;
}

/** Quantity, unit price and total amount: any two are typed, the third is calculated. */
export function AmountFields({
  resolved,
  unit,
  error,
  onType,
}: AmountFieldsProps): JSX.Element {
  const { t } = useTranslation();
  const baseId = useId();

  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="sr-only">{t('transactions.form.amountsHint')}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {AMOUNT_FIELDS.map((field) => {
          const derived = resolved.derived === field;
          return (
            <Field
              key={field}
              id={`${baseId}-${field}`}
              label={t(`transactions.form.${field}`)}
              hint={derived ? t('transactions.form.calculated') : undefined}
            >
              <Input
                id={`${baseId}-${field}`}
                inputMode="decimal"
                autoComplete="off"
                value={resolved.display[field]}
                status={error === undefined ? undefined : 'error'}
                className={derived ? 'bg-surface-2' : undefined}
                suffix={
                  field === 'quantity' && unit !== null
                    ? t(`units.${unit}`)
                    : undefined
                }
                onChange={(event) => onType(field, event.target.value)}
              />
            </Field>
          );
        })}
      </div>
      {error === undefined ? (
        <p className="text-xs text-fg-2">
          {t('transactions.form.amountsHint')}
        </p>
      ) : (
        <p className="text-sm text-neg">{error}</p>
      )}
    </fieldset>
  );
}
