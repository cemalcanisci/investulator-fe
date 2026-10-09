import { describe, expect, it, vi, afterEach } from 'vitest';
import ExcelJS from 'exceljs';
import {
  csvBlob,
  spreadsheetBlob,
  readTransferFile,
  downloadBlob,
} from '@/lib/transfer/files';
import { headers, transactionRows } from '@/lib/transfer/schema';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';

async function bufferOf(blob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (): void => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('buffer'));
      }
    };
    reader.onerror = (): void => reject(new Error('read'));
    reader.readAsArrayBuffer(blob);
  });
}
function fileOf(buffer: ArrayBuffer, name: string): File {
  const file = new File([buffer], name);
  Object.defineProperty(file, 'arrayBuffer', {
    value: () => Promise.resolve(buffer),
  });
  return file;
}

describe('transfer files', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
  it('roundtrips CSV with Turkish text, quotes, newlines and formula-like notes', async () => {
    const rows = transactionRows(SEED_TRANSACTIONS.slice(0, 2));
    if (rows[0] !== undefined) {
      rows[0][11] = '=SUM(A1:A2)';
      rows[0][10] = 'Örnek, "platform"\nyeni satır';
    }
    const buffer = await bufferOf(csvBlob(headers('tr'), rows));
    expect(new TextDecoder().decode(buffer)).toContain("'=SUM");
    const parsed = await readTransferFile(fileOf(buffer, 'test.CSV'));
    expect(parsed[0]?.note).toBe('=SUM(A1:A2)');
    expect(parsed[0]?.platform).toBe('Örnek, "platform"\nyeni satır');
  });
  it('roundtrips XLSX with precision-safe text cells and a frozen header', async () => {
    const buffer = await bufferOf(
      await spreadsheetBlob(
        headers('en'),
        transactionRows(SEED_TRANSACTIONS),
        'Transactions',
      ),
    );
    const parsed = await readTransferFile(fileOf(buffer, 'test.xlsx'));
    expect(parsed).toHaveLength(SEED_TRANSACTIONS.length);
    expect(parsed[0]?.quantity).toBe(SEED_TRANSACTIONS[0]?.quantity);
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(buffer);
    expect(book.worksheets[0]?.views[0]).toMatchObject({
      state: 'frozen',
      ySplit: 1,
    });
    const empty = await bufferOf(
      await spreadsheetBlob(headers('tr'), [], 'İşlemler'),
    );
    expect(await readTransferFile(fileOf(empty, 'template.xlsx'))).toEqual([]);
  });
  it('rejects unsupported, oversized, malformed, formula and huge-row files', async () => {
    await expect(readTransferFile(new File([], 'test.pdf'))).rejects.toThrow(
      'format',
    );
    const large = new File([], 'test.csv');
    Object.defineProperty(large, 'size', { value: 6 * 1024 * 1024 });
    await expect(readTransferFile(large)).rejects.toThrow('size');
    await expect(
      readTransferFile(
        fileOf(new TextEncoder().encode('"unterminated').buffer, 'test.csv'),
      ),
    ).rejects.toThrow('file');
    const book = new ExcelJS.Workbook();
    const sheet = book.addWorksheet('Data');
    sheet.addRow(headers('en'));
    sheet.addRow([{ formula: '1+1' }]);
    await expect(
      readTransferFile(
        fileOf(
          new Uint8Array(await book.xlsx.writeBuffer()).buffer,
          'test.xlsx',
        ),
      ),
    ).rejects.toThrow('formula');
    sheet.getCell('A2').value = new Date('2026-09-01T00:00:00Z');
    sheet.getCell('D2').value = 2;
    const parsed = await readTransferFile(
      fileOf(new Uint8Array(await book.xlsx.writeBuffer()).buffer, 'test.xlsx'),
    );
    expect(parsed[0]).toMatchObject({ date: '2026-09-01', quantity: '2' });
    sheet.getCell('A1002').value = 'overflow';
    await expect(
      readTransferFile(
        fileOf(
          new Uint8Array(await book.xlsx.writeBuffer()).buffer,
          'test.xlsx',
        ),
      ),
    ).rejects.toThrow('limit');
  });
  it('downloads with the right filename and releases the object URL', () => {
    vi.useFakeTimers();
    const create = vi.fn(() => 'blob:test');
    const revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: create, revokeObjectURL: revoke });
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement): void {
        expect(this.download).toBe('report.csv');
      });
    downloadBlob(new Blob(['test']), 'report.csv');
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector('a[download]')).toBeNull();
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith('blob:test');
  });
});
