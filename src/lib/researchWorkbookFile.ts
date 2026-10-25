import type { CellValue } from 'exceljs';
import {
  WORKBOOK_VERSION,
  WORKBOOK_SHEETS,
  MAX_WORKBOOK_BYTES,
  MAX_WORKBOOK_ROWS,
  bundleRows,
} from '@/lib/researchWorkbook';
import type { ResearchBundle, WorkbookRow } from '@/lib/researchWorkbook';

const HEADERS = [
  'assetId',
  'companyId',
  'market',
  'entity',
  'recordId',
  'field',
  'value',
  'type',
] as const;

/** Check central-directory expansion sizes before ExcelJS decompresses the archive. */
function checkArchive(buffer: ArrayBuffer): void {
  if (buffer.byteLength > MAX_WORKBOOK_BYTES || buffer.byteLength < 22) {
    throw new Error('size');
  }
  const view = new DataView(buffer);
  let end = -1;
  for (
    let offset = buffer.byteLength - 22;
    offset >= Math.max(0, buffer.byteLength - 65557);
    offset--
  ) {
    if (view.getUint32(offset, true) === 0x06054b50) {
      end = offset;
      break;
    }
  }
  if (end < 0) {
    throw new Error('format');
  }
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true),
    total = 0;
  if (count > 256 || count === 0) {
    throw new Error('limit');
  }
  for (let index = 0; index < count; index++) {
    if (
      offset + 46 > buffer.byteLength ||
      view.getUint32(offset, true) !== 0x02014b50
    ) {
      throw new Error('format');
    }
    total += view.getUint32(offset + 24, true);
    if (
      total > 48 * 1024 * 1024 ||
      (view.getUint16(offset + 8, true) & 1) !== 0
    ) {
      throw new Error('limit');
    }
    offset +=
      46 +
      view.getUint16(offset + 28, true) +
      view.getUint16(offset + 30, true) +
      view.getUint16(offset + 32, true);
  }
}
function cell(value: CellValue): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }
  throw new Error('formula');
}
export async function readResearchWorkbook(
  buffer: ArrayBuffer,
): Promise<WorkbookRow[]> {
  checkArchive(buffer);
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  if (
    cell(workbook.getWorksheet('Instructions')?.getCell('B1').value ?? null) !==
    WORKBOOK_VERSION
  ) {
    throw new Error('version');
  }
  const result: WorkbookRow[] = [];
  for (const sheet of workbook.worksheets) {
    if (['Instructions', 'DataDictionary'].includes(sheet.name)) {
      continue;
    }
    if (
      !WORKBOOK_SHEETS.some((name) => name === sheet.name) ||
      sheet.columnCount > HEADERS.length ||
      sheet.rowCount > MAX_WORKBOOK_ROWS
    ) {
      throw new Error('schema');
    }
    if (
      HEADERS.some(
        (header, index) => cell(sheet.getCell(1, index + 1).value) !== header,
      )
    ) {
      throw new Error('headers');
    }
    sheet.eachRow((row, index) => {
      if (index === 1) {
        return;
      }
      try {
        const values = HEADERS.map((_, column) =>
          cell(row.getCell(column + 1).value),
        );
        if (values.every((value) => !value)) {
          return;
        }
        if (values.some((value) => value.length > 30000)) {
          throw new Error('limit');
        }
        result.push({
          sheet: sheet.name,
          row: index,
          assetId: values[0],
          companyId: values[1],
          market: values[2],
          entity: values[3],
          recordId: values[4],
          field: values[5],
          value: values[6],
          type: values[7],
        });
        if (result.length > MAX_WORKBOOK_ROWS) {
          throw new Error('limit');
        }
      } catch (error) {
        throw new Error(
          `${sheet.name}:${index}: ${error instanceof Error ? error.message : 'cell'}`,
        );
      }
    });
  }
  if (!result.length) {
    throw new Error('empty');
  }
  return result;
}

export async function exportResearchWorkbook(
  bundle: ResearchBundle,
  assetIds?: readonly string[],
): Promise<Blob> {
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const instructions = workbook.addWorksheet('Instructions');
  instructions.addRows([
    ['schemaVersion', WORKBOOK_VERSION],
    [
      'TR',
      'Değerleri value sütununda düzenleyin. Kimlik ve field sütunları kayıt anahtarıdır. Boş hücreler mevcut veriyi silmez. Formül kullanmayın. Ön izleme onayı gerekir.',
    ],
    [
      'EN',
      'Edit the value column. Identity and field columns form the record key. Blank cells do not delete existing data. No formulas. Preview confirmation is required.',
    ],
    [
      'Kalite / Quality',
      'Yeni/değişen girdiler bağımsız doğrulanmış sayılmaz. New or changed inputs are not independently verified.',
    ],
    [
      'Yapı / Structure',
      'Her satır bir kaynak alanıdır. /facts/0/value ilk finansal kaydın değeridir. Dönem, kaynak, ölçek ve muhasebe alanlarını birlikte doldurun. Each row stores one field; paths preserve complete report data.',
    ],
    [
      'Sınırlar / Limits',
      `8 MiB compressed, 48 MiB expanded, ${MAX_WORKBOOK_ROWS} rows. No deletion. Verified-history changes require separate review.`,
    ],
  ]);
  instructions.columns = [{ width: 25 }, { width: 110 }];
  const dictionary = workbook.addWorksheet('DataDictionary');
  dictionary.addRows([
    ['Column', 'TR / EN'],
    ['assetId', 'Uygulama varlık kimliği / Stable application asset ID'],
    ['companyId', 'ISIN; yoksa providerId veya assetId / Issuer identity'],
    ['market', 'Borsa / Exchange, exact match required'],
    ['entity', 'companies | reports | approximate | verified'],
    [
      'recordId',
      'Rapor version; diğerlerinde assetId / Report version or asset ID',
    ],
    [
      'field',
      'JSON Pointer alan yolu; diziler sıfırdan başlar / JSON Pointer field path, zero-based arrays',
    ],
    [
      'value',
      'Metin olarak ondalık sayı; formül yok / Decimal strings, no formulas',
    ],
    [
      'type',
      'string | number | boolean | null | array | object; array/object only empty containers',
    ],
    [
      'Financials',
      'value, unit, period, metricKey, basis/start/end/currency/scale/accounting/purchasingPowerDate/scope/attribution, sourceId, locator',
    ],
    [
      'Sources',
      'Kaynak ve belge kanıtları; yayımlanma tarihi dahil / Sources, evidence, publication dates',
    ],
    [
      'Peers',
      'Rezerve; hazır oranlarla hesaplama motorunu geçersiz kılamaz / Reserved; cannot override calculated ratios',
    ],
  ]);
  dictionary.columns = [{ width: 25 }, { width: 110 }];
  const rows = bundleRows(bundle, assetIds);
  if (rows.length > MAX_WORKBOOK_ROWS) {
    throw new Error('limit');
  }
  for (const name of WORKBOOK_SHEETS) {
    const sheet = workbook.addWorksheet(name, {
      views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }],
    });
    sheet.columns = HEADERS.map((header) => ({
      header,
      width: header === 'value' ? 55 : header === 'field' ? 48 : 24,
      style: { numFmt: '@' },
    }));
    for (const row of rows.filter((entry) => entry.sheet === name)) {
      sheet.addRow(HEADERS.map((header) => row[header]));
    }
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: Math.max(1, sheet.rowCount), column: HEADERS.length },
    };
  }
  for (const sheet of workbook.worksheets) {
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF234E52' },
    };
    sheet.getRow(1).height = 30;
  }
  const data = await workbook.xlsx.writeBuffer();
  return new Blob([new Uint8Array(data)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
