import { MAX_WORKBOOK_BYTES } from '@/lib/researchWorkbook';

/** Same-origin `.xlsx` paths under `/research/` only; rejects external hosts, `..` and query strings before any fetch. */
const RESEARCH_PATH_PATTERN =
  /^\/research\/(?:[A-Za-z0-9][\w.-]*\/)*[A-Za-z0-9][\w.-]*\.xlsx$/;

export function sanitizeResearchUrl(input: string): string {
  const path = input.trim();
  if (!RESEARCH_PATH_PATTERN.test(path) || path.includes('..')) {
    throw new Error('url');
  }
  return path;
}

/** Downloads a public research workbook; the caller still runs it through the normal preview/apply gate. */
export async function fetchResearchWorkbookFromUrl(
  input: string,
): Promise<ArrayBuffer> {
  const response = await fetch(sanitizeResearchUrl(input));
  if (!response.ok) {
    throw new Error('fetch');
  }
  if ((response.headers.get('content-type') ?? '').includes('text/html')) {
    throw new Error('fetch');
  }
  const length = Number(response.headers.get('content-length') ?? '0');
  if (length > MAX_WORKBOOK_BYTES) {
    throw new Error('size');
  }
  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > MAX_WORKBOOK_BYTES) {
    throw new Error('size');
  }
  return buffer;
}
