import { useEffect, useRef, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { RiUpload2Line, RiShieldCheckLine } from '@remixicon/react';
import { Button } from '@/components/ui/Button';
import { ImportPreview } from '@/components/ImportExport/ImportPreview';
import { ExportPanel } from '@/components/ImportExport/ExportPanel';
import {
  useTransactions,
  TRANSACTIONS_QUERY_KEY,
} from '@/hooks/useTransactions';
import { DASHBOARD_QUERY_KEY } from '@/hooks/useDashboardSummary';
import {
  readTransferFile,
  spreadsheetBlob,
  downloadBlob,
} from '@/lib/transfer/files';
import { headers, previewRows, type ImportRow } from '@/lib/transfer/schema';
import { todayIso } from '@/lib/formatDate';
import {
  importTransactions,
  TransactionRuleError,
} from '@/services/transactions';
import { CATALOG } from '@/services/mockCatalog';

export function ImportExportPage(): JSX.Element {
  const { t, i18n } = useTranslation();
  const query = useTransactions();
  const client = useQueryClient();
  const [preview, setPreview] = useState<readonly ImportRow[] | null>(null);
  const [filename, setFilename] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const dismissTimer = useRef<number | undefined>(undefined);
  function success(text: string): void {
    window.clearTimeout(dismissTimer.current);
    setFailed(false);
    setMessage(text);
    dismissTimer.current = window.setTimeout(() => {
      setMessage('');
    }, 4000);
  }
  function failure(error: unknown): void {
    window.clearTimeout(dismissTimer.current);
    setFailed(true);
    setMessage(
      error instanceof TransactionRuleError
        ? t('transfer.balance', { asset: error.assetName, date: error.date })
        : error instanceof Error &&
            i18n.exists(`transfer.errors.${error.message}`)
          ? t(`transfer.errors.${error.message}`)
          : t('transfer.failed'),
    );
  }
  async function template(): Promise<void> {
    setBusy(true);
    window.clearTimeout(dismissTimer.current);
    setMessage('');
    setFailed(false);
    try {
      downloadBlob(
        await spreadsheetBlob(
          headers(i18n.language),
          [],
          t('nav.transactions'),
        ),
        'investulator-template.xlsx',
      );
      success(t('transfer.downloadDone'));
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  async function selectFile(file: File): Promise<void> {
    setBusy(true);
    window.clearTimeout(dismissTimer.current);
    setMessage('');
    setFailed(false);
    setPreview(null);
    setFilename(file.name);
    try {
      const rows = await readTransferFile(file);
      setPreview(previewRows(rows, query.data ?? [], todayIso()));
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  async function submit(): Promise<void> {
    if (preview === null) {
      return;
    }
    setBusy(true);
    window.clearTimeout(dismissTimer.current);
    setMessage('');
    setFailed(false);
    try {
      const count = await importTransactions(
        preview.flatMap((row) => (row.input === null ? [] : [row.input])),
      );
      setPreview(null);
      success(t('transfer.done', { count }));
      await Promise.all([
        client.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY }),
        client.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY }),
      ]);
    } catch (error) {
      failure(error);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    return (): void => {
      window.clearTimeout(dismissTimer.current);
    };
  }, []);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('nav.importExport')}
        </h1>
        <p className="mt-2 text-sm text-fg-2">{t('transfer.description')}</p>
      </header>
      <p className="flex items-start gap-2 rounded-xl border border-line bg-surface-2 p-4 text-sm text-fg-2">
        <RiShieldCheckLine
          aria-hidden
          size={20}
          className="shrink-0 text-primary"
        />
        {t('transfer.local')}
      </p>
      {query.isPending ? (
        <p role="status">{t('common.loading')}</p>
      ) : query.isError ? (
        <div role="alert">
          <p>{t('common.loadError')}</p>
          <Button
            onClick={() => {
              void query.refetch();
            }}
          >
            {t('common.retryButton')}
          </Button>
        </div>
      ) : (
        <>
          <div className="grid items-start gap-5 lg:grid-cols-2">
            <section className="min-w-0 rounded-2xl border border-line bg-surface p-5 sm:p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <RiUpload2Line aria-hidden size={23} />
              </div>
              <h2 className="text-lg font-semibold">
                {t('transfer.importTitle')}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-fg-2">
                {t('transfer.importDescription')}
              </p>
              <Button
                className="mt-5"
                disabled={busy}
                onClick={() => {
                  void template();
                }}
              >
                {t('transfer.template')}
              </Button>
              <div className="mt-5 rounded-xl border border-dashed border-line-strong bg-surface-2 p-5">
                <label className="relative inline-flex cursor-pointer items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary">
                  <span className="block">{t('transfer.choose')}</span>
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    disabled={busy}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      event.target.value = '';
                      if (file !== undefined) {
                        void selectFile(file);
                      }
                    }}
                  />
                </label>
                <p className="mt-3 text-xs text-fg-3">
                  {t('transfer.fileHint')}
                </p>
              </div>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer font-medium text-primary">
                  {t('transfer.guide')}
                </summary>
                <p className="mt-3 leading-relaxed text-fg-2">
                  {t('transfer.guideText')}
                </p>
                <h3 className="mt-4 font-medium">{t('transfer.catalog')}</h3>
                <ul className="mt-2 grid gap-1 text-xs text-fg-2 sm:grid-cols-2">
                  {CATALOG.map((asset) => (
                    <li key={asset.id}>
                      <span className="font-mono text-fg">{asset.id}</span> —{' '}
                      {asset.name}
                    </li>
                  ))}
                </ul>
              </details>
            </section>
            <ExportPanel transactions={query.data} />
          </div>
          {busy && (
            <p role="status" className="text-sm text-fg-2">
              {t('transfer.loading')}
            </p>
          )}
          {message !== '' && (
            <p
              role={failed ? 'alert' : 'status'}
              className={`rounded-xl border border-line bg-surface p-4 text-sm ${failed ? 'text-neg' : 'text-pos'}`}
            >
              {message}
            </p>
          )}
          {preview !== null && (
            <ImportPreview
              key={filename}
              filename={filename}
              rows={preview}
              busy={busy}
              onImport={() => {
                void submit();
              }}
              onReset={() => {
                setPreview(null);
                setFilename('');
                window.clearTimeout(dismissTimer.current);
                setMessage('');
              }}
            />
          )}
        </>
      )}
      <p className="text-xs leading-relaxed text-fg-3">
        {t('transfer.session')}
      </p>
    </div>
  );
}
