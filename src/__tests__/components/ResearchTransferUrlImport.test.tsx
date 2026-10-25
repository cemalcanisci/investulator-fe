import { afterEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResearchTransfer } from '@/components/Strategies/ResearchTransfer';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import { i18n } from '@/i18n';
import { researchBundle } from '@/services/researchBundle';
import {
  bundleRows,
  previewWorkbook,
  MAX_WORKBOOK_BYTES,
} from '@/lib/researchWorkbook';
import type { ResearchBundle, WorkbookRow } from '@/lib/researchWorkbook';
import {
  exportResearchWorkbook,
  readResearchWorkbook,
} from '@/lib/researchWorkbookFile';

const assetId = 'watch-bist-tuprs';

interface MockFetchResponse {
  readonly ok: boolean;
  readonly headers?: Headers;
  readonly json?: () => Promise<unknown>;
  readonly arrayBuffer?: () => Promise<ArrayBuffer>;
}

type FetchMock = (
  input: string,
  init?: RequestInit,
) => Promise<MockFetchResponse>;

function jsonResponse(body: unknown, ok = true): MockFetchResponse {
  return { ok, json: () => Promise.resolve(body) };
}

function fileResponse(buffer: ArrayBuffer, ok = true): MockFetchResponse {
  return {
    ok,
    headers: new Headers({
      'content-type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-length': String(buffer.byteLength),
    }),
    arrayBuffer: () => Promise.resolve(buffer),
  };
}

function parsePreviewBody(raw: string): {
  rows: readonly WorkbookRow[];
  scope?: string;
} {
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('invalid preview request body');
  }
  const input = Object.fromEntries(Object.entries(parsed));
  if (!Array.isArray(input.rows)) {
    throw new Error('invalid preview request body');
  }
  return {
    rows: input.rows,
    scope: typeof input.scope === 'string' ? input.scope : undefined,
  };
}

/** Mocks the dev-only `/__research/*` endpoints with the real preview engine, and serves `files` for `/research/*` requests. */
function installFetchMock(
  files: Record<string, () => MockFetchResponse | Promise<MockFetchResponse>>,
): ReturnType<typeof vi.fn<FetchMock>> {
  const fetcher = vi.fn<FetchMock>(async (input, init) => {
    if (input === '/__research/session') {
      return jsonResponse({ token: 'test-token' });
    }
    if (input === '/__research/preview') {
      const body = parsePreviewBody(String(init?.body));
      const result = previewWorkbook(body.rows, researchBundle, body.scope);
      const { bundle: _bundle, ...summary } = result;
      return jsonResponse({
        ...summary,
        approval: result.issues.length ? undefined : 'approval-token',
      });
    }
    if (input === '/__research/apply' || input === '/__research/undo') {
      return jsonResponse({ saved: true });
    }
    const file = files[input];
    if (file) {
      return file();
    }
    return jsonResponse({ error: 'route' }, false);
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}

async function openCardImport(): Promise<HTMLElement> {
  await userEvent.click(
    screen.getByRole('button', {
      name: `${i18n.t('researchTransfer.actions')} ${assetId}`,
    }),
  );
  await userEvent.click(
    await screen.findByRole('menuitem', {
      name: i18n.t('researchTransfer.cardImport'),
    }),
  );
  return screen.findByRole('dialog');
}

async function openGlobalImport(): Promise<HTMLElement> {
  await userEvent.click(
    screen.getByRole('button', { name: i18n.t('researchTransfer.import') }),
  );
  await userEvent.click(
    await screen.findByRole('menuitem', { name: 'Excel (.xlsx)' }),
  );
  return screen.findByRole('dialog');
}

async function loadFromUrl(dialog: HTMLElement, path: string): Promise<void> {
  await userEvent.click(screen.getByText(i18n.t('researchTransfer.sourceUrl')));
  await userEvent.type(
    within(dialog).getByLabelText(i18n.t('researchTransfer.urlLabel')),
    path,
  );
  await userEvent.click(
    within(dialog).getByRole('button', {
      name: i18n.t('researchTransfer.urlLoad'),
    }),
  );
}

describe('research transfer URL import', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('produces the same preview whether the workbook is uploaded as a file or loaded from an allowed URL', async () => {
    const rows = bundleRows(researchBundle, [assetId]);
    const report = researchBundle.reports[0];
    const index = report.facts.findIndex((fact) => fact.id === 'profit2025');
    const edited = rows.map((row) =>
      row.recordId === report.version && row.field === `/facts/${index}/value`
        ? { ...row, value: '14761591500' }
        : row,
    );
    const editedResult = previewWorkbook(edited, researchBundle, assetId);
    expect(editedResult.issues).toEqual([]);
    expect(editedResult.updated).toBeGreaterThan(0);
    const blob = await exportResearchWorkbook(editedResult.bundle, [assetId]);
    const buffer = await blob.arrayBuffer();
    const expectedRows = await readResearchWorkbook(buffer.slice(0));
    const expected = previewWorkbook(expectedRows, researchBundle, assetId);
    expect(expected.issues).toEqual([]);
    const expectedText = i18n.t('researchTransfer.counts', {
      added: expected.added,
      updated: expected.updated,
      unchanged: expected.unchanged,
    });
    const file = new File([buffer], 'edited.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    installFetchMock({
      '/research/edited.xlsx': () => fileResponse(buffer.slice(0)),
    });
    renderWithProviders(<ResearchTransfer assetId={assetId} />);
    const dialog = await openCardImport();
    await userEvent.upload(
      within(dialog).getByLabelText(i18n.t('researchTransfer.choose')),
      file,
    );
    expect(
      await within(dialog).findByText(expectedText, {}, { timeout: 30000 }),
    ).toBeVisible();

    await loadFromUrl(dialog, '/research/edited.xlsx');
    expect(
      await within(dialog).findByText(expectedText, {}, { timeout: 30000 }),
    ).toBeVisible();
  }, 60000);

  it('adds a new company via URL import, matching the field-level add/update engine', async () => {
    const company = {
      ...researchBundle.companies[0],
      id: 'url-import-synthetic-company',
      symbol: 'URLSYN',
      name: 'URL import fixture',
    };
    const synthetic: ResearchBundle = {
      schemaVersion: 1,
      companies: [company],
      reports: [],
      approximate: [],
      verified: [],
    };
    const blob = await exportResearchWorkbook(synthetic, [company.id]);
    const buffer = await blob.arrayBuffer();
    const expectedRows = await readResearchWorkbook(buffer.slice(0));
    const expected = previewWorkbook(expectedRows, researchBundle);
    expect(expected.issues).toEqual([]);
    expect(expected.newCompanyIds).toContain(company.id);
    expect(expected.added).toBeGreaterThan(0);

    installFetchMock({
      '/research/new-company.xlsx': () => fileResponse(buffer),
    });
    renderWithProviders(<ResearchTransfer />);
    const dialog = await openGlobalImport();
    await loadFromUrl(dialog, '/research/new-company.xlsx');
    expect(
      await within(dialog).findByText(
        i18n.t('researchTransfer.counts', {
          added: expected.added,
          updated: expected.updated,
          unchanged: expected.unchanged,
        }),
        {},
        { timeout: 30000 },
      ),
    ).toBeVisible();
    expect(
      within(dialog).getAllByText(new RegExp(company.id)).length,
    ).toBeGreaterThan(0);
  }, 60000);

  it('rejects a forbidden URL without any network call or preview', async () => {
    const fetcher = installFetchMock({});
    renderWithProviders(<ResearchTransfer assetId={assetId} />);
    const dialog = await openCardImport();
    await loadFromUrl(dialog, 'https://evil.example/research/report.xlsx');
    expect(
      await within(dialog).findByText(i18n.t('researchTransfer.errors.url')),
    ).toBeVisible();
    expect(fetcher).not.toHaveBeenCalled();
    expect(
      within(dialog).queryByRole('button', {
        name: i18n.t('researchTransfer.apply'),
      }),
    ).not.toBeInTheDocument();
  });

  it('shows a clear error for a missing remote file', async () => {
    installFetchMock({
      '/research/missing.xlsx': () => fileResponse(new ArrayBuffer(0), false),
    });
    renderWithProviders(<ResearchTransfer assetId={assetId} />);
    const dialog = await openCardImport();
    await loadFromUrl(dialog, '/research/missing.xlsx');
    expect(
      await within(dialog).findByText(i18n.t('researchTransfer.errors.fetch')),
    ).toBeVisible();
  });

  it('rejects a remote file above the size limit before reading it as a workbook', async () => {
    installFetchMock({
      '/research/huge.xlsx': () =>
        fileResponse(new ArrayBuffer(MAX_WORKBOOK_BYTES + 1)),
    });
    renderWithProviders(<ResearchTransfer assetId={assetId} />);
    const dialog = await openCardImport();
    await loadFromUrl(dialog, '/research/huge.xlsx');
    expect(
      await within(dialog).findByText(i18n.t('researchTransfer.errors.size')),
    ).toBeVisible();
  });

  it('rejects a remote file that is not a valid workbook', async () => {
    installFetchMock({
      '/research/corrupt.xlsx': () => fileResponse(new ArrayBuffer(32)),
    });
    renderWithProviders(<ResearchTransfer assetId={assetId} />);
    const dialog = await openCardImport();
    await loadFromUrl(dialog, '/research/corrupt.xlsx');
    expect(await within(dialog).findByRole('alert')).toHaveTextContent(
      'format',
    );
  });
});
