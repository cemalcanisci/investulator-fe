import { describe, expect, it } from 'vitest';
import { researchBundle } from '@/services/researchBundle';
import { bundleRows, canonical, previewWorkbook } from '@/lib/researchWorkbook';
import {
  exportResearchWorkbook,
  readResearchWorkbook,
} from '@/lib/researchWorkbookFile';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { isApproximateHistory } from '@/lib/approximateHistorySchema';

const assetId = 'watch-bist-tuprs';
const rows = bundleRows(researchBundle, [assetId]);
const report = researchBundle.reports[0];
describe('research workbook transaction', () => {
  it('recalculates annual P/E from imported earnings without promoting source quality', () => {
    const index = report.facts.findIndex((fact) => fact.id === 'profit2025');
    const changed = rows.map((row) =>
      row.recordId === report.version && row.field === `/facts/${index}/value`
        ? { ...row, value: '14761591500' }
        : row,
    );
    const preview = previewWorkbook(changed, researchBundle);
    expect(preview.issues).toEqual([]);
    expect(ratioPresentation(preview.bundle.reports[0], 'peTtm')).toMatchObject(
      { value: '50.42', status: 'INDICATIVE', periodBasis: 'ANNUAL' },
    );
  });
  it('round-trips every report and simulation field without changing calculations', () => {
    const result = previewWorkbook(rows, researchBundle, assetId);
    expect(result.issues).toEqual([]);
    expect(result.added + result.updated).toBe(0);
    expect(canonical(result.bundle)).toBe(canonical(researchBundle));
    expect(ratioPresentation(result.bundle.reports[0], 'peRunRate')).toEqual(
      ratioPresentation(report, 'peRunRate'),
    );
    expect(result.bundle.approximate.every(isApproximateHistory)).toBe(true);
  });
  it('exports a versioned blank template and an editable multi-sheet workbook', async () => {
    const empty = await exportResearchWorkbook(researchBundle, []);
    expect(empty.size).toBeGreaterThan(0);
    const file = await exportResearchWorkbook(researchBundle, [assetId]);
    const parsed = await readResearchWorkbook(await file.arrayBuffer());
    expect(previewWorkbook(parsed, researchBundle).issues).toEqual([]);
    expect(canonical(previewWorkbook(parsed, researchBundle).bundle)).toBe(
      canonical(researchBundle),
    );
  }, 60000);
  it('downgrades changed financial facts, preserves history and makes repeated imports idempotent', () => {
    const changed = rows.map((row) =>
      row.recordId === report.version && row.field === '/facts/0/value'
        ? { ...row, value: '400' }
        : row,
    );
    const first = previewWorkbook(changed, researchBundle, assetId);
    expect(first.issues).toEqual([]);
    expect(first.bundle.reports[0].facts[0].verification).toBe('UNVERIFIED');
    expect(first.bundle.reports[0].presentation.narrativeStale).toBe(true);
    expect(first.bundle.reports[0].presentation.review.independent).toBe(false);
    expect(first.bundle.reports[0].facts[0].evidence).toBeUndefined();
    expect(first.bundle.reports.length).toBe(researchBundle.reports.length);
    const second = previewWorkbook(changed, first.bundle, assetId);
    expect(second.added + second.updated).toBe(0);
    expect(canonical(second.bundle)).toBe(canonical(first.bundle));
  });
  it('does not delete with blanks, rejects foreign scope, duplicate cells and prototype paths atomically', () => {
    const target = rows.find((row) => row.field === '/facts/0/value');
    if (!target) {
      throw new Error('fixture');
    }
    expect(
      previewWorkbook([{ ...target, value: '' }], researchBundle).updated,
    ).toBe(0);
    for (const bad of [
      [...rows, rows[0]],
      [{ ...target, assetId: 'foreign' }],
      [{ ...target, field: '/__proto__/polluted' }],
      [{ ...target, market: 'WRONG' }],
    ]) {
      const result = previewWorkbook(bad, researchBundle, assetId);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.bundle).toBe(researchBundle);
    }
  });
  it('refuses changes to calculation definitions and invalid dates', () => {
    const calculation = rows.find((row) => row.field.endsWith('/operation'));
    const start = rows.find((row) => row.field === '/facts/0/basis/start');
    if (!calculation || !start) {
      throw new Error('fixture');
    }
    expect(
      previewWorkbook([{ ...calculation, value: 'CHANGED' }], researchBundle)
        .issues.length,
    ).toBeGreaterThan(0);
    expect(
      previewWorkbook([{ ...start, value: '2026-02-30' }], researchBundle)
        .issues.length,
    ).toBeGreaterThan(0);
  });
  it('rejects arbitrary bytes before decompression', async () => {
    await expect(readResearchWorkbook(new ArrayBuffer(32))).rejects.toThrow(
      'format',
    );
  });
  it('adds a company to the catalog without creating portfolio transactions or duplicate assets', () => {
    const company = {
      ...researchBundle.companies[0],
      id: 'synthetic-company',
      symbol: 'SYNTHETIC',
      name: 'Synthetic fixture',
      market: 'BIST',
    };
    const incoming = bundleRows({
      schemaVersion: 1,
      companies: [company],
      reports: [],
      approximate: [],
      verified: [],
    });
    const result = previewWorkbook(incoming, researchBundle);
    expect(result.issues).toEqual([]);
    expect(result.newCompanyIds).toEqual([company.id]);
    expect(result.bundle.companies.length).toBe(
      researchBundle.companies.length + 1,
    );
    expect(previewWorkbook(incoming, result.bundle).added).toBe(0);
  });
  it('prevents empty-container deletion and reports missing sources', () => {
    const target = rows.find((row) => row.field === '/facts/0/value');
    if (!target) {
      throw new Error('fixture');
    }
    expect(
      previewWorkbook(
        [{ ...target, field: '/facts', type: 'array', value: '[]' }],
        researchBundle,
      ).issues.length,
    ).toBeGreaterThan(0);
    expect(
      previewWorkbook(
        [{ ...target, field: '/facts/0/sourceId', value: 'not-a-source' }],
        researchBundle,
      ).issues.length,
    ).toBeGreaterThan(0);
  });
  it('rejects formula cells without executing cached results', async () => {
    const { default: ExcelJS } = await import('exceljs');
    const workbook = new ExcelJS.Workbook();
    const instructions = workbook.addWorksheet('Instructions');
    instructions.getCell('B1').value = 'investulator-research/1';
    const financials = workbook.addWorksheet('Financials');
    financials.addRow([
      'assetId',
      'companyId',
      'market',
      'entity',
      'recordId',
      'field',
      'value',
      'type',
    ]);
    financials.addRow([
      assetId,
      'issuer',
      'BIST',
      'reports',
      'report',
      '/facts/0/value',
      { formula: '1+1', result: 2 },
      'string',
    ]);
    const bytes = await workbook.xlsx.writeBuffer();
    await expect(
      readResearchWorkbook(new Uint8Array(bytes).buffer),
    ).rejects.toThrow('formula');
  });
});
