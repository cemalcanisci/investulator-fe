import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Segmented } from '@/components/ui/Segmented';
import { researchBundle } from '@/services/researchBundle';
import { downloadBlob } from '@/lib/transfer/files';
import {
  exportResearchWorkbook,
  readResearchWorkbook,
} from '@/lib/researchWorkbookFile';
import { fetchResearchWorkbookFromUrl } from '@/lib/researchUrlImport';
import { MAX_WORKBOOK_BYTES, object } from '@/lib/researchWorkbook';
import type { WorkbookIssue } from '@/lib/researchWorkbook';

type ImportSource = 'FILE' | 'URL';

interface Preview {
  readonly approval?: string;
  readonly added: number;
  readonly updated: number;
  readonly unchanged: number;
  readonly companyIds: readonly string[];
  readonly newCompanyIds: readonly string[];
  readonly sections: readonly string[];
  readonly issues: readonly WorkbookIssue[];
}
async function session(): Promise<string> {
  const response = await fetch('/__research/session');
  if (!response.ok) {
    throw new Error('disabled');
  }
  const data: unknown = await response.json();
  if (!object(data) || typeof data.token !== 'string') {
    throw new Error('disabled');
  }
  return data.token;
}
async function request(
  route: string,
  body: unknown,
  token: string,
): Promise<unknown> {
  const response = await fetch(`/__research/${route}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Research-Token': token },
    body: JSON.stringify(body),
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    throw new Error(
      object(data) && typeof data.error === 'string' ? data.error : 'invalid',
    );
  }
  return data;
}
function isPreview(value: unknown): value is Preview {
  return (
    object(value) &&
    ['added', 'updated', 'unchanged'].every(
      (key) => typeof value[key] === 'number',
    ) &&
    ['companyIds', 'newCompanyIds', 'sections'].every(
      (key) =>
        Array.isArray(value[key]) &&
        value[key].every((item: unknown) => typeof item === 'string'),
    ) &&
    Array.isArray(value.issues) &&
    value.issues.every(
      (issue) =>
        object(issue) &&
        typeof issue.sheet === 'string' &&
        typeof issue.row === 'number' &&
        typeof issue.column === 'string' &&
        typeof issue.code === 'string',
    ) &&
    (value.approval === undefined || typeof value.approval === 'string')
  );
}

export function ResearchTransfer({
  assetId,
  removeItems = [],
}: {
  readonly assetId?: string;
  readonly removeItems?: readonly {
    readonly key: string;
    readonly label: string;
    readonly onClick: () => void;
  }[];
}): JSX.Element {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'IMPORT' | 'EXPORT' | null>(null);
  const [selected, setSelected] = useState<readonly string[]>(
    assetId ? [assetId] : researchBundle.companies.map((company) => company.id),
  );
  const [preview, setPreview] = useState<Preview | null>(null);
  const [token, setToken] = useState('');
  const [source, setSource] = useState<ImportSource>('FILE');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function run(action: () => Promise<void>): Promise<void> {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'invalid');
    } finally {
      setBusy(false);
    }
  }
  function open(next: 'IMPORT' | 'EXPORT'): void {
    setMode(next);
    setPreview(null);
    setError('');
    setSource('FILE');
    setUrl('');
  }
  async function exportFile(ids: readonly string[]): Promise<void> {
    downloadBlob(
      await exportResearchWorkbook(researchBundle, ids),
      ids.length ? 'investulator-research.xlsx' : 'investulator-template.xlsx',
    );
  }
  async function importBuffer(buffer: ArrayBuffer): Promise<void> {
    const access = await session();
    setToken(access);
    const rows = await readResearchWorkbook(buffer);
    const result = await request('preview', { rows, scope: assetId }, access);
    if (!isPreview(result)) {
      throw new Error('schema');
    }
    setPreview(result);
  }
  return (
    <>
      {assetId ? (
        <Dropdown
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'import',
                label: t('researchTransfer.cardImport'),
                onClick: () => open('IMPORT'),
              },
              {
                key: 'export',
                label: t('researchTransfer.cardExport'),
                onClick: () => void run(() => exportFile([assetId])),
              },
              ...removeItems.map((item) => ({ ...item, danger: true })),
            ],
          }}
        >
          <Button
            size="small"
            aria-label={`${t('researchTransfer.actions')} ${assetId}`}
          >
            {t('researchTransfer.actions')}
          </Button>
        </Dropdown>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'xlsx',
                  label: 'Excel (.xlsx)',
                  onClick: () => open('IMPORT'),
                },
              ],
            }}
          >
            <Button>{t('researchTransfer.import')}</Button>
          </Dropdown>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'xlsx',
                  label: 'Excel (.xlsx)',
                  onClick: () => open('EXPORT'),
                },
              ],
            }}
          >
            <Button>{t('researchTransfer.export')}</Button>
          </Dropdown>
        </div>
      )}
      {!mode && error && (
        <p role="alert" className="text-sm text-neg">
          {t(`researchTransfer.errors.${error}`, { defaultValue: error })}
        </p>
      )}
      <Modal
        open={mode !== null}
        onCancel={() => !busy && setMode(null)}
        footer={null}
        width={800}
        title={t(
          mode === 'EXPORT'
            ? 'researchTransfer.export'
            : 'researchTransfer.import',
        )}
        destroyOnHidden
      >
        <div className="space-y-4">
          <p className="text-sm">{t('researchTransfer.persistence')}</p>
          {mode === 'EXPORT' ? (
            <>
              <p className="text-sm">{t('researchTransfer.schema')}</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  disabled={busy}
                  onClick={() => void run(() => exportFile([]))}
                >
                  {t('researchTransfer.template')}
                </Button>
                <Button
                  disabled={busy}
                  onClick={() =>
                    void run(() =>
                      exportFile(
                        researchBundle.companies.map((company) => company.id),
                      ),
                    )
                  }
                >
                  {t('researchTransfer.all')}
                </Button>
              </div>
              <fieldset className="grid max-h-64 gap-2 overflow-auto sm:grid-cols-2">
                <legend>{t('researchTransfer.selection')}</legend>
                {researchBundle.companies.map((company) => (
                  <label key={company.id} className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(company.id)}
                      onChange={(event) =>
                        setSelected(
                          event.target.checked
                            ? [...selected, company.id]
                            : selected.filter((id) => id !== company.id),
                        )
                      }
                    />
                    {company.symbol} · {company.market}
                  </label>
                ))}
              </fieldset>
              <Button
                disabled={busy || !selected.length}
                onClick={() => void run(() => exportFile(selected))}
              >
                {t('researchTransfer.selected')}
              </Button>
            </>
          ) : (
            <>
              <Segmented<ImportSource>
                value={source}
                disabled={busy}
                onChange={(next) => {
                  setSource(next);
                  setPreview(null);
                  setError('');
                }}
                options={[
                  { label: t('researchTransfer.sourceFile'), value: 'FILE' },
                  { label: t('researchTransfer.sourceUrl'), value: 'URL' },
                ]}
              />
              {assetId && <p>{t('researchTransfer.scope', { assetId })}</p>}
              {source === 'FILE' ? (
                <label className="block">
                  {t('researchTransfer.choose')}
                  <input
                    className="mt-2 block max-w-full"
                    aria-label={t('researchTransfer.choose')}
                    type="file"
                    accept=".xlsx"
                    disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setPreview(null);
                      if (!file) {
                        return;
                      }
                      void run(async () => {
                        if (
                          !file.name.toLowerCase().endsWith('.xlsx') ||
                          file.size > MAX_WORKBOOK_BYTES
                        ) {
                          throw new Error('size');
                        }
                        await importBuffer(await file.arrayBuffer());
                      });
                    }}
                  />
                </label>
              ) : (
                <div className="space-y-2">
                  <label className="block">
                    {t('researchTransfer.urlLabel')}
                    <Input
                      className="mt-2"
                      placeholder="/research/dosya-adi.xlsx"
                      aria-label={t('researchTransfer.urlLabel')}
                      value={url}
                      disabled={busy}
                      onChange={(event) => {
                        setUrl(event.target.value);
                        setPreview(null);
                      }}
                    />
                  </label>
                  <p className="text-sm text-fg-2">
                    {t('researchTransfer.urlHint')}
                  </p>
                  <Button
                    disabled={busy || !url.trim()}
                    loading={busy}
                    onClick={() =>
                      void run(async () => {
                        setPreview(null);
                        await importBuffer(
                          await fetchResearchWorkbookFromUrl(url),
                        );
                      })
                    }
                  >
                    {t('researchTransfer.urlLoad')}
                  </Button>
                </div>
              )}
              {preview && (
                <div className="space-y-3" role="status">
                  <p>
                    {t('researchTransfer.counts', {
                      added: preview.added,
                      updated: preview.updated,
                      unchanged: preview.unchanged,
                    })}
                  </p>
                  <p>
                    {t('researchTransfer.companies')}:{' '}
                    {preview.companyIds.join(', ')}
                  </p>
                  <p>
                    {t('researchTransfer.newCompanies')}:{' '}
                    {preview.newCompanyIds.join(', ') || '—'}
                  </p>
                  <p>
                    {t('researchTransfer.sections')}:{' '}
                    {preview.sections.join(', ') || '—'}
                  </p>
                  <ul className="max-h-64 overflow-auto text-sm text-neg">
                    {preview.issues.slice(0, 100).map((issue, index) => (
                      <li key={`${issue.sheet}-${issue.row}-${index}`}>
                        {issue.sheet} · {issue.row} · {issue.column}:{' '}
                        {issue.code}
                      </li>
                    ))}
                  </ul>
                  <p>{t('researchTransfer.quality')}</p>
                  <Button
                    type="primary"
                    disabled={
                      busy ||
                      preview.issues.length > 0 ||
                      !preview.approval ||
                      preview.added + preview.updated === 0
                    }
                    loading={busy}
                    onClick={() =>
                      void run(async () => {
                        await request(
                          'apply',
                          { approval: preview.approval },
                          token,
                        );
                        window.location.reload();
                      })
                    }
                  >
                    {t('researchTransfer.apply')}
                  </Button>
                </div>
              )}
              <details>
                <summary>{t('researchTransfer.undoTitle')}</summary>
                <p className="my-2 text-sm">{t('researchTransfer.undoHint')}</p>
                <Button
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      const access = await session();
                      await request('undo', {}, access);
                      window.location.reload();
                    })
                  }
                >
                  {t('researchTransfer.undo')}
                </Button>
              </details>
            </>
          )}
          {busy && <p role="status">{t('common.loading')}</p>}
          {error && (
            <p role="alert" className="break-words text-neg">
              {t(`researchTransfer.errors.${error}`, { defaultValue: error })}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
