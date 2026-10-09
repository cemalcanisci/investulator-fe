import { useId, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Field } from '@/components/Transactions/Field';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { FxRateSource, TransactionCurrency } from '@/domain/transaction';

export interface FxRateFieldProps {
  readonly currency: TransactionCurrency;
  readonly source: FxRateSource;
  /** The day's rate from the service; null while loading or when it could not be fetched. */
  readonly autoRate: string | null;
  readonly loading: boolean;
  /** The typed rate when the source is manual. */
  readonly manualRate: string;
  readonly error?: string;
  readonly onManualRateChange: (rate: string) => void;
  readonly onSourceChange: (source: FxRateSource) => void;
}

/** The rate to USD stored with the transaction: automatic for the day, or corrected by hand. */
export function FxRateField({
  currency,
  source,
  autoRate,
  loading,
  manualRate,
  error,
  onManualRateChange,
  onSourceChange,
}: FxRateFieldProps): JSX.Element {
  const { t } = useTranslation();
  const id = useId();

  if (source === 'MANUAL') {
    return (
      <Field
        id={id}
        label={t('transactions.form.fx.input', { currency })}
        hint={t('transactions.form.fx.manual')}
        error={error}
      >
        <div className="flex items-center gap-2">
          <Input
            id={id}
            inputMode="decimal"
            autoComplete="off"
            className="max-w-48"
            value={manualRate}
            status={error === undefined ? undefined : 'error'}
            onChange={(event) => onManualRateChange(event.target.value)}
          />
          <Button type="link" onClick={() => onSourceChange('AUTO')}>
            {t('transactions.form.fx.back')}
          </Button>
        </div>
      </Field>
    );
  }

  let status: string;
  if (autoRate !== null) {
    status = t('transactions.form.fx.rate', { currency, rate: autoRate });
  } else if (loading) {
    status = t('transactions.form.fx.loading');
  } else {
    status = t('transactions.form.fx.unavailable');
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">
        {t('transactions.form.fx.label')}
      </span>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="tabular-nums" aria-live="polite">
          {status}
        </span>
        {autoRate !== null && (
          <span className="text-xs text-fg-2">
            {t('transactions.form.fx.auto')}
          </span>
        )}
        {!loading && (
          <Button
            type="link"
            size="small"
            onClick={() => onSourceChange('MANUAL')}
          >
            {t('transactions.form.fx.edit')}
          </Button>
        )}
      </div>
      {error !== undefined && <p className="text-sm text-neg">{error}</p>}
    </div>
  );
}
