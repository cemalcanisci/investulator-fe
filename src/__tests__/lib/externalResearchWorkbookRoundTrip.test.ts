import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import {
  readResearchWorkbook,
  exportResearchWorkbook,
} from '@/lib/researchWorkbookFile';
import { canonical, previewWorkbook } from '@/lib/researchWorkbook';
import { researchBundle } from '@/services/researchBundle';

async function bytes(): Promise<ArrayBuffer> {
  return new Uint8Array(await readFile('public/research/sise-import-test.xlsx'))
    .buffer;
}

describe('external research XLSX round-trip', () => {
  // Split out of externalResearchWorkbook.test.ts: exporting is the one step here that
  // serializes real ZIP/XLSX bytes, so it is scoped to just the newly-imported company
  // (not the full 10-company bundle) to keep this test fast — exportResearchWorkbook's
  // scoping is the same mechanism ResearchTransferUrlImport.test.tsx already relies on.
  it('round-trips a newly imported company through export/import without loss', async () => {
    const rows = await readResearchWorkbook(await bytes());
    const result = previewWorkbook(rows, researchBundle);
    expect(result.issues).toEqual([]);
    expect(result.newCompanyIds).toContain('watch-bist-sise');

    const exported = await exportResearchWorkbook(result.bundle, [
      'watch-bist-sise',
    ]);
    const again = previewWorkbook(
      await readResearchWorkbook(await exported.arrayBuffer()),
      result.bundle,
    );
    expect(again.issues).toEqual([]);
    expect(again.added + again.updated).toBe(0);
    expect(canonical(again.bundle)).toBe(canonical(result.bundle));
  });
});
