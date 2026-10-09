import { useEffect, useRef, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { RiDownload2Line } from '@remixicon/react';
import { Button } from '@/components/ui/Button';
import type { Transaction } from '@/domain/transaction';
import { headers, transactionRows } from '@/lib/transfer/schema';
import { csvBlob, spreadsheetBlob, downloadBlob } from '@/lib/transfer/files';
import { transactionPdf } from '@/lib/transfer/pdf';
import { todayIso } from '@/lib/formatDate';
import { compareLedgerOrder } from '@/lib/positions';

interface ExportPanelProps {
  readonly transactions: readonly Transaction[];
}

export function ExportPanel({ transactions }: ExportPanelProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState(todayIso());
  const [includeVoided, setIncludeVoided] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const dismissTimer = useRef<number | undefined>(undefined);
  function showMessage(text: string, isError: boolean): void {
    window.clearTimeout(dismissTimer.current);
    setFailed(isError);
    setMessage(text);
    if (!isError) {
      dismissTimer.current = window.setTimeout(() => {
        setMessage('');
      }, 4000);
    }
  }
  useEffect(() => {
    return (): void => {
      window.clearTimeout(dismissTimer.current);
    };
  }, []);
  const invalid = from !== '' && to !== '' && from > to;
  const rows = transactions
    .filter(
      (row) =>
        (includeVoided || row.status === 'ACTIVE') &&
        (from === '' || row.executedAt >= from) &&
        (to === '' || row.executedAt <= to),
    )
    .toSorted(compareLedgerOrder);
  async function download(format: 'xlsx' | 'csv' | 'pdf'): Promise<void> {
    setBusy(format);
    window.clearTimeout(dismissTimer.current);
    setMessage('');
    setFailed(false);
    try {
      const head = headers(i18n.language);
      const values = transactionRows(rows);
      const blob =
        format === 'pdf'
          ? await transactionPdf(rows, t)
          : format === 'xlsx'
            ? await spreadsheetBlob(head, values, t('nav.transactions'))
            : csvBlob(head, values);
      downloadBlob(blob, `investulator-${todayIso()}.${format}`);
      showMessage(t('transfer.downloadDone'), false);
    } catch {
      showMessage(t('transfer.failed'), true);
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <RiDownload2Line aria-hidden size={23} />
      </div>
      <h2 className="text-lg font-semibold">{t('transfer.exportTitle')}</h2>
      <p className="mt-2 text-sm leading-relaxed text-fg-2">
        {t('transfer.exportDescription')}
      </p>
      <fieldset
        disabled={busy !== null}
        className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2"
      >
        {[
          { id: 'from', value: from, setter: setFrom },
          { id: 'to', value: to, setter: setTo },
        ].map((field) => (
          <label key={field.id} className="min-w-0 text-sm">
            <span className="mb-2 block text-fg-2">
              {t(`transfer.${field.id}`)}
            </span>
            <input
              type="date"
              value={field.value}
              onChange={(event) => {
                field.setter(event.target.value);
                window.clearTimeout(dismissTimer.current);
                setMessage('');
              }}
              className="h-10 w-full min-w-0 rounded-lg border border-line-strong bg-surface px-3 text-fg"
            />
          </label>
        ))}
      </fieldset>
      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeVoided}
          disabled={busy !== null}
          onChange={(event) => {
            setIncludeVoided(event.target.checked);
            window.clearTimeout(dismissTimer.current);
            setMessage('');
          }}
          className="h-4 w-4 accent-primary"
        />
        {t('transfer.includeVoided')}
      </label>
      <p
        className={`mt-6 text-sm ${invalid ? 'text-neg' : 'text-fg-2'}`}
        aria-live="polite"
      >
        {invalid
          ? t('transfer.rangeError')
          : rows.length === 0
            ? t('transfer.noExport')
            : t('transfer.count', { count: rows.length })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {(['xlsx', 'csv', 'pdf'] as const).map((format) => (
          <Button
            key={format}
            type={format === 'pdf' ? 'primary' : 'default'}
            disabled={
              invalid || rows.length === 0 || (busy !== null && busy !== format)
            }
            loading={busy === format}
            onClick={() => {
              void download(format);
            }}
          >
            {t('transfer.download', {
              format: format === 'xlsx' ? 'Excel' : format.toUpperCase(),
            })}
          </Button>
        ))}
      </div>
      {message !== '' && (
        <p
          role={failed ? 'alert' : 'status'}
          className={`mt-4 text-sm ${failed ? 'text-neg' : 'text-pos'}`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
