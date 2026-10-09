import Papa from 'papaparse';
import type { CellValue } from 'exceljs';
import { COLUMNS, MAX_ROWS, mapRows, type TransferRow } from './schema';

export async function readTransferFile(file: File): Promise<TransferRow[]> {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('size');
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'csv' && extension !== 'xlsx') {
    throw new Error('format');
  }
  const buffer = await file.arrayBuffer();
  if (extension === 'csv') {
    const result = Papa.parse<string[]>(
      new TextDecoder('utf-8', { fatal: true }).decode(buffer),
      { skipEmptyLines: 'greedy', preview: MAX_ROWS + 2 },
    );
    if (result.errors.length > 0) {
      throw new Error('file');
    }
    return mapRows(
      result.data.map((row) =>
        row.map((value) => value.replace(/^'(?=['=+\-@\t\r])/, '')),
      ),
    );
  }
  const { default: ExcelJS } = await import('exceljs');
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(buffer);
  const sheet = book.worksheets[0];
  if (sheet === undefined) {
    throw new Error('empty');
  }
  if (sheet.rowCount > MAX_ROWS + 1) {
    throw new Error('limit');
  }
  if (sheet.columnCount > COLUMNS.length) {
    throw new Error('headers');
  }
  const grid: string[][] = [];
  sheet.eachRow({ includeEmpty: true }, (row) => {
    grid.push(
      Array.from({ length: sheet.columnCount }, (_, index) =>
        cellText(row.getCell(index + 1).value),
      ),
    );
  });
  return mapRows(grid);
}

function cellText(value: CellValue): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  throw new Error('formula');
}

export async function spreadsheetBlob(
  head: readonly string[],
  rows: readonly (readonly string[])[],
  sheetName: string,
): Promise<Blob> {
  const { default: ExcelJS } = await import('exceljs');
  const book = new ExcelJS.Workbook();
  const sheet = book.addWorksheet(sheetName, {
    views: [{ state: 'frozen', ySplit: 1 }],
  });
  sheet.columns = head.map((header) => ({
    header,
    width: 22,
    style: { numFmt: '@' },
  }));
  rows.forEach((row) => {
    sheet.addRow([...row]);
  });
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF234E52' },
  };
  sheet.getRow(1).height = 32;
  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: rows.length + 1, column: head.length },
  };
  sheet.eachRow((row) => {
    row.alignment = { vertical: 'top', wrapText: true };
  });
  const buffer = await book.xlsx.writeBuffer();
  return new Blob([new Uint8Array(buffer)], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

export function csvBlob(
  head: readonly string[],
  rows: readonly (readonly string[])[],
): Blob {
  return new Blob(
    [
      '\uFEFF',
      Papa.unparse([[...head], ...rows.map((row) => [...row])], {
        escapeFormulae: /^['=+\-@\t\r]/,
      }),
    ],
    { type: 'text/csv;charset=utf-8' },
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
