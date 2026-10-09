import { useId, useState, type FormEvent, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { NativeSelect } from '@/components/NativeSelect/NativeSelect';
import { AmountFields } from '@/components/Transactions/AmountFields';
import { AssetPicker } from '@/components/Transactions/AssetPicker';
import { Field } from '@/components/Transactions/Field';
import { FxRateField } from '@/components/Transactions/FxRateField';
import { AutoComplete } from '@/components/ui/AutoComplete';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Segmented } from '@/components/ui/Segmented';
import { TRANSACTION_TYPES, type TransactionType } from '@/domain/assetTypes';
import {
  isTrade,
  type Transaction,
  type TransactionCurrency,
} from '@/domain/transaction';
import { DISPLAY_CURRENCIES } from '@/domain/currency';
import { useAssetCatalog } from '@/hooks/useAssetCatalog';
import { useFxRateToUsd } from '@/hooks/useFxRateToUsd';
import { useLanguage } from '@/hooks/useLanguage';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { formatDate, todayIso } from '@/lib/formatDate';
import { formatMoney } from '@/lib/formatMoney';
import { formatQuantity } from '@/lib/formatNumber';
import { quantityBefore } from '@/lib/positions';
import {
  emptyFormValues,
  formValuesOf,
  resolveAmounts,
  toTransactionInput,
  typeAmount,
  usdPreview,
  validateForm,
  type FormError,
  type FormField,
  type TransactionFormValues,
} from '@/lib/transactionForm';
import { platformsOf } from '@/lib/transactionsView';
import { TransactionRuleError } from '@/services/transactions';

export interface TransactionFormProps {
  /** The transaction being edited, or null for a new one. */
  readonly editing: Transaction | null;
  /** The whole ledger: names the platforms in use and tells how much can still be sold. */
  readonly transactions: readonly Transaction[];
  readonly onClose: () => void;
  readonly onSaved: (kind: 'created' | 'updated') => void;
}

function isCurrency(value: string): value is TransactionCurrency {
  return DISPLAY_CURRENCIES.some((currency) => currency === value);
}

export function TransactionForm({
  editing,
  transactions,
  onClose,
  onSaved,
}: TransactionFormProps): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const ids = { date: useId(), time: useId(), currency: useId(), fee: useId() };
  const others = { platform: useId(), note: useId(), extra: useId() };
  const today = todayIso();
  const catalog = useAssetCatalog();
  const actions = useTransactionActions();
  const [values, setValues] = useState<TransactionFormValues>(() =>
    editing === null ? emptyFormValues(today) : formValuesOf(editing),
  );
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const hasCash = isTrade(values.type) || values.type === 'DIVIDEND';
  const fetchedRate = useFxRateToUsd(
    hasCash ? values.currency : 'USD',
    values.date,
  );
  // An edit that keeps the day and the currency keeps the rate stored with the transaction;
  // the stored rate is a snapshot and must not change just because the form was opened.
  const keepsSnapshot =
    editing !== null &&
    (isTrade(editing.type) || editing.type === 'DIVIDEND') &&
    hasCash &&
    values.date === editing.executedAt &&
    values.currency === editing.currency;
  const autoRate = keepsSnapshot
    ? editing.fxRateToUsd
    : (fetchedRate.data ?? null);

  const asset = catalog.data?.find((entry) => entry.id === values.assetId);
  const available =
    values.type === 'SELL' && values.assetId !== '' && values.date !== ''
      ? quantityBefore(transactions, values.assetId, {
          executedAt: values.date,
          executedTime: values.time,
          id: editing?.id ?? '\uffff',
        })
      : null;
  const errors = validateForm(values, { today, autoRate, available });
  const resolved = resolveAmounts(values);
  const usd = usdPreview(values, autoRate);
  const pending = actions.create.isPending || actions.update.isPending;

  function change(patch: Partial<TransactionFormValues>): void {
    setValues((current) => ({ ...current, ...patch }));
  }

  function errorText(field: FormField): string | undefined {
    const error: FormError | undefined = errors[field];
    // Too much to sell is worth telling right away; the rest waits for the first save attempt.
    if (error === undefined || !(submitted || field === 'quantity')) {
      return undefined;
    }
    const available = error.params?.available;
    return t(`transactions.form.errors.${error.key}`, {
      ...error.params,
      ...(available === undefined
        ? {}
        : { available: formatQuantity(available, language) }),
    });
  }

  function describe(error: Error): string {
    return error instanceof TransactionRuleError
      ? t('transactions.form.ruleError', {
          asset: error.assetName,
          date: formatDate(error.date, language),
          short: formatQuantity(error.shortBy, language),
        })
      : t('transactions.form.saveError');
  }

  function submit(event: FormEvent): void {
    event.preventDefault();
    setSubmitted(true);
    setServerError(null);
    if (Object.keys(errors).length > 0) {
      return;
    }
    const input = toTransactionInput(values, autoRate);
    const callbacks: {
      readonly onSuccess: () => void;
      readonly onError: (error: Error) => void;
    } = {
      onSuccess: () => onSaved(editing === null ? 'created' : 'updated'),
      onError: (error) => setServerError(describe(error)),
    };
    if (editing === null) {
      actions.create.mutate(input, callbacks);
    } else {
      actions.update.mutate({ id: editing.id, input }, callbacks);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">
          {t('transactions.form.type')}
        </span>
        <Segmented<TransactionType>
          className="max-sm:[&_.ant-segmented-item-label]:px-0"
          block
          value={values.type}
          aria-label={t('transactions.form.type')}
          options={TRANSACTION_TYPES.map((type) => ({
            value: type,
            label: t(`transactionTypes.${type}`),
          }))}
          onChange={(type) => {
            change({
              type,
              quantity: '',
              unitPrice: '',
              totalAmount: '',
              fee: '',
              splitRatio: '',
              anchors: [],
            });
            setSubmitted(false);
            setServerError(null);
          }}
        />
      </div>

      <AssetPicker
        assets={catalog.data ?? []}
        value={values.assetId}
        error={errorText('asset')}
        onChange={(chosen) =>
          change({
            assetId: chosen.id,
            currency: chosen.priceCurrency,
            ...(chosen.priceCurrency === values.currency
              ? {}
              : { fxSource: 'AUTO', fxRate: '' }),
          })
        }
      />

      <Field
        id={ids.date}
        label={t('transactions.form.date')}
        error={errorText('date')}
      >
        <Input
          id={ids.date}
          type="date"
          max={today}
          className="max-w-48"
          value={values.date}
          status={errors.date === undefined || !submitted ? undefined : 'error'}
          onChange={(event) => change({ date: event.target.value })}
        />
      </Field>

      <Field
        id={ids.time}
        label={t('transactions.form.time')}
        hint={t('transactions.form.timeHint')}
        error={errorText('time')}
      >
        <Input
          id={ids.time}
          type="time"
          className="max-w-48"
          value={values.time}
          onChange={(event) => change({ time: event.target.value })}
        />
      </Field>

      {isTrade(values.type) && (
        <AmountFields
          resolved={resolved}
          unit={asset?.unit ?? null}
          error={errorText('amounts') ?? errorText('quantity')}
          onType={(field, text) =>
            setValues((current) => typeAmount(current, field, text))
          }
        />
      )}
      {values.type === 'BONUS' && (
        <Field
          id={others.extra}
          label={t('transactions.form.bonusQuantity')}
          error={errorText('quantity')}
        >
          <Input
            id={others.extra}
            inputMode="decimal"
            autoComplete="off"
            className="max-w-48"
            value={values.quantity}
            onChange={(event) => change({ quantity: event.target.value })}
          />
        </Field>
      )}
      {values.type === 'SPLIT' && (
        <Field
          id={others.extra}
          label={t('transactions.form.splitRatio')}
          hint={t('transactions.form.splitHint')}
          error={errorText('splitRatio')}
        >
          <Input
            id={others.extra}
            inputMode="decimal"
            autoComplete="off"
            className="max-w-48"
            value={values.splitRatio}
            onChange={(event) => change({ splitRatio: event.target.value })}
          />
        </Field>
      )}
      {values.type === 'DIVIDEND' && (
        <Field
          id={others.extra}
          label={t('transactions.form.dividendAmount')}
          error={errorText('totalAmount')}
        >
          <Input
            id={others.extra}
            inputMode="decimal"
            autoComplete="off"
            className="max-w-48"
            value={values.totalAmount}
            onChange={(event) => change({ totalAmount: event.target.value })}
          />
        </Field>
      )}

      {hasCash && (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={ids.currency} label={t('transactions.form.currency')}>
            <NativeSelect
              id={ids.currency}
              label={t('transactions.form.currency')}
              value={values.currency}
              options={DISPLAY_CURRENCIES.map((code) => ({
                value: code,
                label: code,
              }))}
              onChange={(code) => {
                if (isCurrency(code)) {
                  change({ currency: code, fxSource: 'AUTO', fxRate: '' });
                }
              }}
            />
          </Field>
          {isTrade(values.type) && (
            <Field
              id={ids.fee}
              label={t('transactions.form.fee')}
              error={errorText('fee')}
            >
              <Input
                id={ids.fee}
                inputMode="decimal"
                autoComplete="off"
                value={values.fee}
                onChange={(event) => change({ fee: event.target.value })}
              />
            </Field>
          )}
        </div>
      )}

      {hasCash && values.currency !== 'USD' && (
        <FxRateField
          currency={values.currency}
          source={values.fxSource}
          autoRate={autoRate}
          loading={fetchedRate.isPending && !keepsSnapshot}
          manualRate={values.fxRate}
          error={errorText('fxRate')}
          onManualRateChange={(fxRate) => change({ fxRate })}
          onSourceChange={(fxSource) =>
            change(
              fxSource === 'MANUAL'
                ? { fxSource, fxRate: autoRate ?? values.fxRate }
                : { fxSource },
            )
          }
        />
      )}

      <p className="text-sm text-fg-2" aria-live="polite">
        {values.type === 'BONUS' || values.type === 'SPLIT'
          ? t('transactions.form.noCost')
          : usd !== null && (
              <>
                {t('transactions.form.usd')}:{' '}
                <span className="font-semibold tabular-nums text-fg">
                  {formatMoney(usd, language, 'USD')}
                </span>
              </>
            )}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field id={others.platform} label={t('transactions.form.platform')}>
          <AutoComplete
            id={others.platform}
            value={values.platform}
            placeholder={t('transactions.form.platformPlaceholder')}
            options={platformsOf(transactions).map((name) => ({
              value: name,
            }))}
            filterOption={(input, option) =>
              (option?.value ?? '')
                .toString()
                .toLocaleLowerCase(language)
                .includes(input.toLocaleLowerCase(language))
            }
            onChange={(platform) => change({ platform })}
          />
        </Field>
        <Field id={others.note} label={t('transactions.form.note')}>
          <Input
            id={others.note}
            value={values.note}
            onChange={(event) => change({ note: event.target.value })}
          />
        </Field>
      </div>

      {serverError !== null && (
        <p role="alert" className="rounded-lg bg-neg-soft p-3 text-sm text-neg">
          {serverError}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button onClick={onClose}>{t('transactions.form.cancel')}</Button>
        <Button type="primary" htmlType="submit" loading={pending}>
          {t('transactions.form.save')}
        </Button>
      </div>
    </form>
  );
}
