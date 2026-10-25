import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchResearchWorkbookFromUrl,
  sanitizeResearchUrl,
} from '@/lib/researchUrlImport';
import { MAX_WORKBOOK_BYTES } from '@/lib/researchWorkbook';

interface MockFetchResponse {
  readonly ok: boolean;
  readonly headers: Headers;
  readonly arrayBuffer: () => Promise<ArrayBuffer>;
}

function mockResponse(init: {
  readonly ok?: boolean;
  readonly contentType?: string;
  readonly contentLength?: number;
  readonly body?: ArrayBuffer;
}): MockFetchResponse {
  const body = init.body ?? new ArrayBuffer(8);
  const headers = new Headers();
  if (init.contentType) {
    headers.set('content-type', init.contentType);
  }
  if (init.contentLength !== undefined) {
    headers.set('content-length', String(init.contentLength));
  }
  return {
    ok: init.ok ?? true,
    headers,
    arrayBuffer: () => Promise.resolve(body),
  };
}

describe('sanitizeResearchUrl', () => {
  it('accepts same-origin .xlsx paths under /research/, including nested folders', () => {
    expect(sanitizeResearchUrl('/research/report.xlsx')).toBe(
      '/research/report.xlsx',
    );
    expect(sanitizeResearchUrl('  /research/sub/report-v2.xlsx  ')).toBe(
      '/research/sub/report-v2.xlsx',
    );
  });
  it.each([
    'https://evil.example/research/report.xlsx',
    '//evil.example/research/report.xlsx',
    '/other/report.xlsx',
    '/research/../secrets.xlsx',
    '/research/report.xlsx?token=1',
    '/research/report.xlsm',
    '/research/report.XLSX.exe',
    'research/report.xlsx',
    '',
  ])('rejects forbidden or malformed URL %s', (value) => {
    expect(() => sanitizeResearchUrl(value)).toThrow('url');
  });
});

describe('fetchResearchWorkbookFromUrl', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('downloads a workbook body from an allowed path', async () => {
    const body = new ArrayBuffer(16);
    const fetcher = vi
      .fn<(input: string) => Promise<MockFetchResponse>>()
      .mockResolvedValue(
        mockResponse({
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          contentLength: 16,
          body,
        }),
      );
    vi.stubGlobal('fetch', fetcher);
    const result = await fetchResearchWorkbookFromUrl('/research/report.xlsx');
    expect(result).toBe(body);
    expect(fetcher).toHaveBeenCalledWith('/research/report.xlsx');
  });
  it('rejects a forbidden URL before any network call', async () => {
    const fetcher = vi.fn<(input: string) => Promise<MockFetchResponse>>();
    vi.stubGlobal('fetch', fetcher);
    await expect(
      fetchResearchWorkbookFromUrl('https://evil.example/research/x.xlsx'),
    ).rejects.toThrow('url');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects a missing file', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse({ ok: false })),
    );
    await expect(
      fetchResearchWorkbookFromUrl('/research/missing.xlsx'),
    ).rejects.toThrow('fetch');
  });
  it('rejects an SPA fallback page served instead of the file', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(mockResponse({ contentType: 'text/html' })),
    );
    await expect(
      fetchResearchWorkbookFromUrl('/research/missing.xlsx'),
    ).rejects.toThrow('fetch');
  });
  it('rejects a file whose declared content-length exceeds the limit', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          mockResponse({ contentLength: MAX_WORKBOOK_BYTES + 1 }),
        ),
    );
    await expect(
      fetchResearchWorkbookFromUrl('/research/huge.xlsx'),
    ).rejects.toThrow('size');
  });
  it('rejects a file whose actual body exceeds the limit when no content-length is sent', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          mockResponse({ body: new ArrayBuffer(MAX_WORKBOOK_BYTES + 1) }),
        ),
    );
    await expect(
      fetchResearchWorkbookFromUrl('/research/huge.xlsx'),
    ).rejects.toThrow('size');
  });
});
