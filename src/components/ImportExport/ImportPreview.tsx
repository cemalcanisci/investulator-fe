import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import type { ImportRow } from '@/lib/transfer/schema';

interface ImportPreviewProps {
  readonly filename: string;
  readonly rows: readonly ImportRow[];
  readonly busy: boolean;
  readonly onImport: () => void;
  readonly onReset: () => void;
}

export function ImportPreview({
  filename,
  rows,
  busy,
  onImport,
  onReset,
}: ImportPreviewProps): JSX.Element {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const ready = rows.filter((row) => row.input !== null).length;
  const skipped = rows.filter((row) => row.skipped).length;
  const invalid = rows.length - ready - skipped;
  return (
    <section
      className="min-w-0 rounded-2xl border border-line bg-surface p-4 sm:p-6"
      aria-label={t('transfer.review')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{t('transfer.review')}</h2>
          <p className="mt-1 break-all text-sm text-fg-2">{filename}</p>
        </div>
        <Button disabled={busy} onClick={onReset}>
          {t('transfer.reset')}
        </Button>
      </div>
      <div className="my-5 grid grid-cols-3 gap-2">
        {[
          { key: 'ready', count: ready, color: 'text-pos' },
          { key: 'skipped', count: skipped, color: 'text-fg-2' },
          { key: 'invalid', count: invalid, color: 'text-neg' },
        ].map((item) => (
          <div key={item.key} className="rounded-xl bg-surface-2 p-3">
            <span
              className={`block text-2xl font-semibold tabular-nums ${item.color}`}
            >
              {item.count}
            </span>
            <span className="text-xs text-fg-2">
              {t(`transfer.${item.key}`)}
            </span>
          </div>
        ))}
      </div>
      {rows.length === 0 ? (
        <p>{t('transfer.empty')}</p>
      ) : (
        <ol className="divide-y divide-line">
          {rows.slice(page * 20, (page + 1) * 20).map((row) => (
            <li
              key={row.line}
              className="grid gap-2 py-3 sm:grid-cols-[4rem_1fr_1fr]"
            >
              <span className="text-xs text-fg-3">
                {t('transfer.line')} {row.line}
              </span>
              <div className="min-w-0 break-words text-sm">
                <span className="font-medium">
                  {row.raw.asset} · {row.raw.type}
                </span>
                <p className="text-fg-2">
                  {row.raw.date} ·{' '}
                  {row.raw.totalAmount ||
                    row.raw.quantity ||
                    row.raw.splitRatio}{' '}
                  {row.raw.currency}
                </p>
              </div>
              <span
                className={`break-words text-sm ${row.input !== null ? 'text-pos' : row.skipped ? 'text-fg-2' : 'text-neg'}`}
              >
                {row.issue === null
                  ? t('transfer.valid')
                  : t(`transfer.errors.${row.issue}`)}
              </span>
            </li>
          ))}
        </ol>
      )}
      {rows.length > 20 && (
        <div className="mt-3 flex items-center justify-between gap-2">
          <Button disabled={page === 0} onClick={() => setPage(page - 1)}>
            {t('common.previous')}
          </Button>
          <span className="text-sm">
            {page + 1} / {Math.ceil(rows.length / 20)}
          </span>
          <Button
            disabled={(page + 1) * 20 >= rows.length}
            onClick={() => setPage(page + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
      <p className="mt-5 text-xs leading-relaxed text-fg-2">
        {t('transfer.atomic')}
      </p>
      <Button
        type="primary"
        className="mt-4"
        loading={busy}
        disabled={ready === 0 || invalid > 0}
        onClick={onImport}
      >
        {t('transfer.importAction', { count: ready })}
      </Button>
    </section>
  );
}
