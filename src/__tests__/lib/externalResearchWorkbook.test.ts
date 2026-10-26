import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import {
  readResearchWorkbook,
  exportResearchWorkbook,
} from '@/lib/researchWorkbookFile';
import { canonical, previewWorkbook } from '@/lib/researchWorkbook';
import { researchBundle } from '@/services/researchBundle';
import { ratioPresentation } from '@/lib/ratioPresentation';
import { availableAt } from '@/lib/financialPeriodSelection';

async function bytes(): Promise<ArrayBuffer> {
  return new Uint8Array(await readFile('public/research/sise-import-test.xlsx'))
    .buffer;
}
describe('external research XLSX integration', () => {
  it('reproduces the original namespace stack and reads it with the same application reader', async () => {
    const zip = await JSZip.loadAsync(await bytes());
    const xml = await zip.file('xl/workbook.xml')?.async('string');
    if (!xml) {
      throw new Error('fixture');
    }
    zip.file(
      'xl/workbook.xml',
      xml
        .replace(
          '<workbook ',
          '<workbook xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ',
        )
        .replace(/<(\/?)(workbook|sheets|sheet)(?=[\s/>])/g, '<$1x:$2'),
    );
    const original = await zip.generateAsync({ type: 'arraybuffer' });
    await expect(new ExcelJS.Workbook().xlsx.load(original)).rejects.toThrow(
      "reading 'sheets'",
    );
    const rows = await readResearchWorkbook(original);
    expect(rows.length).toBeGreaterThan(0);
    expect(previewWorkbook(rows, researchBundle).issues).toEqual([]);
  });
  it('imports a genuinely external workbook, exposes financial inputs and round-trips without loss', async () => {
    const rows = await readResearchWorkbook(await bytes());
    const result = previewWorkbook(rows, researchBundle);
    expect(result.issues).toEqual([]);
    expect(result.added).toBeGreaterThan(0);
    expect(result.newCompanyIds).toContain('watch-bist-sise');
    const report = result.bundle.reports.find(
      (r) => r.presentation.symbol === 'SISE',
    );
    expect(report).toBeDefined();
    expect(report?.facts.map((f) => f.value)).toEqual([
      '224527000000',
      '9878000000',
      '23982000000',
    ]);
    expect(report?.facts.every((f) => f.verification === 'UNVERIFIED')).toBe(
      true,
    );
    expect(report?.presentation.facts).toHaveLength(3);
    expect(report?.presentation.review).toMatchObject({
      status: 'NEEDS_REVIEW',
      independent: false,
    });
    if (!report) {
      throw new Error('fixture');
    }
    expect(availableAt(report, report.facts[0], '2026-10-25')).toBe(false);
    expect(availableAt(report, report.facts[0], '2026-10-26')).toBe(true);
    expect(
      previewWorkbook(rows, result.bundle).added +
        previewWorkbook(rows, result.bundle).updated,
    ).toBe(0);
    expect(ratioPresentation(report, 'revenue')).toMatchObject({
      value: '224527000000',
      status: 'INDICATIVE',
    });
    expect(ratioPresentation(report, 'peTtm').value).toBeUndefined();
    expect(
      canonical(
        result.bundle.reports.filter((r) => r.presentation.symbol === 'TUPRS'),
      ),
    ).toBe(canonical(researchBundle.reports));
    const exported = await exportResearchWorkbook(result.bundle);
    const again = previewWorkbook(
      await readResearchWorkbook(await exported.arrayBuffer()),
      result.bundle,
    );
    expect(again.issues).toEqual([]);
    expect(again.added + again.updated).toBe(0);
    expect(canonical(again.bundle)).toBe(canonical(result.bundle));
  }, 60000);
  it('separates valid XLSX, wrong version, corrupt XML and unsupported archives', async () => {
    const ordinary = new ExcelJS.Workbook();
    ordinary.addWorksheet('Sheet1').addRow(['Valid spreadsheet']);
    await expect(
      readResearchWorkbook(
        new Uint8Array(await ordinary.xlsx.writeBuffer()).buffer,
      ),
    ).rejects.toThrow('format');
    ordinary.addWorksheet('Instructions').getCell('B1').value =
      'investulator-research/999';
    await expect(
      readResearchWorkbook(
        new Uint8Array(await ordinary.xlsx.writeBuffer()).buffer,
      ),
    ).rejects.toThrow('version');
    const zip = await JSZip.loadAsync(await bytes());
    zip.file('xl/workbook.xml', '<broken>');
    await expect(
      readResearchWorkbook(await zip.generateAsync({ type: 'arraybuffer' })),
    ).rejects.toThrow('corrupt');
  });
  it('rejects DTD declarations, missing workbook parts and malformed prefixed XML before preview', async () => {
    for (const [xml, code] of [
      ['<!DOCTYPE workbook><workbook/>', 'format'],
      [
        '<x:workbook xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><x:sheets></x:workbook>',
        'corrupt',
      ],
    ]) {
      const zip = await JSZip.loadAsync(await bytes());
      zip.file('xl/workbook.xml', xml);
      await expect(
        readResearchWorkbook(await zip.generateAsync({ type: 'arraybuffer' })),
      ).rejects.toThrow(code);
    }
    const zip = await JSZip.loadAsync(await bytes());
    zip.remove('[Content_Types].xml');
    await expect(
      readResearchWorkbook(await zip.generateAsync({ type: 'arraybuffer' })),
    ).rejects.toThrow('format');
  });
  it('rejects missing company fields, report schema, identity, scope and calculation injection atomically', async () => {
    const rows = await readResearchWorkbook(await bytes());
    for (const [input, code] of [
      [
        rows.filter(
          (r) => !(r.entity === 'companies' && r.field === '/symbol'),
        ),
        'companyRequired',
      ],
      [
        rows.filter((r) => r.field !== '/context/businessModel'),
        'reportSchema',
      ],
      [rows.map((r) => ({ ...r, companyId: 'WRONG' })), 'identity'],
      [
        rows.map((r) =>
          r.field === '/calculations'
            ? {
                ...r,
                field: '/calculations/0/id',
                type: 'string',
                value: 'injected',
              }
            : r,
        ),
        'calculationReadOnly',
      ],
      [
        rows.map((r) =>
          r.field === '/facts/0/value' ? { ...r, field: 'facts/0/value' } : r,
        ),
        'field',
      ],
      [
        rows.map((r) =>
          r.field === '/facts/0/value' ? { ...r, field: '/bad~2pointer' } : r,
        ),
        'field',
      ],
    ] as const) {
      const result = previewWorkbook(input, researchBundle);
      expect(result.issues.some((issue) => issue.code === code)).toBe(true);
      expect(result.bundle).toBe(researchBundle);
    }
    expect(
      previewWorkbook(rows, researchBundle, 'watch-bist-tuprs').issues[0].code,
    ).toBe('scope');
  });
  it('rejects missing TAS29 basis and does not overwrite an existing financial period', async () => {
    const rows = await readResearchWorkbook(await bytes());
    expect(
      previewWorkbook(
        rows.map((r) =>
          r.field === '/facts/0/basis/purchasingPowerDate'
            ? { ...r, type: 'null', value: 'null' }
            : r,
        ),
        researchBundle,
      ).issues.some((i) => i.code.includes('BASIS')),
    ).toBe(true);
    const imported = previewWorkbook(rows, researchBundle);
    const changed = rows.map((r) =>
      r.field === '/facts/0/basis/start' ? { ...r, value: '2024-01-01' } : r,
    );
    expect(
      previewWorkbook(changed, imported.bundle).issues.some(
        (i) => i.code === 'appendNewPeriod',
      ),
    ).toBe(true);
  });
});
