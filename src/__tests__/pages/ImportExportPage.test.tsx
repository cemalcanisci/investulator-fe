import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ImportExportPage } from '@/pages/ImportExport/ImportExportPage';
import { renderWithProviders } from '@/__tests__/utils/renderWithProviders';
import * as files from '@/lib/transfer/files';
import * as pdf from '@/lib/transfer/pdf';
import * as service from '@/services/transactions';
import {
  headers,
  mapRows,
  transactionRows,
  type TransferRow,
} from '@/lib/transfer/schema';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';

const row: TransferRow = {
  time: '',
  date: '2026-09-01',
  asset: 'btc',
  type: 'BUY',
  quantity: '1',
  unitPrice: '100',
  totalAmount: '',
  currency: 'USD',
  fee: '',
  fxRate: '1',
  fxSource: 'AUTO',
  platform: '',
  note: 'Test',
  splitRatio: '',
  status: 'ACTIVE',
};
async function upload(rows: readonly TransferRow[]): Promise<void> {
  vi.spyOn(files, 'readTransferFile').mockResolvedValue([...rows]);
  await userEvent.upload(
    screen.getByLabelText('Dosya seç'),
    new File(['test'], 'test.csv', { type: 'text/csv' }),
  );
  await screen.findByRole('region', { name: 'Dosya kontrolü' });
}

describe('ImportExportPage', () => {
  afterEach(() => vi.restoreAllMocks());
  it('downloads a blank template and exports date-scoped CSV, Excel and PDF', async () => {
    const spreadsheet = vi
      .spyOn(files, 'spreadsheetBlob')
      .mockResolvedValue(new Blob());
    const csv = vi.spyOn(files, 'csvBlob').mockReturnValue(new Blob());
    const report = vi
      .spyOn(pdf, 'transactionPdf')
      .mockResolvedValue(new Blob());
    const download = vi
      .spyOn(files, 'downloadBlob')
      .mockImplementation(() => {});
    renderWithProviders(<ImportExportPage />);
    await screen.findByRole('button', { name: 'Excel şablonunu indir' });
    await userEvent.click(
      screen.getByRole('button', { name: 'Excel şablonunu indir' }),
    );
    await waitFor(() =>
      expect(spreadsheet).toHaveBeenCalledWith(headers('tr'), [], 'İşlemler'),
    );
    await userEvent.type(
      screen.getByLabelText('Başlangıç tarihi'),
      '2026-09-01',
    );
    await userEvent.click(screen.getByRole('button', { name: 'CSV indir' }));
    const selected = SEED_TRANSACTIONS.filter(
      (item) => item.executedAt >= '2026-09-01' && item.status === 'ACTIVE',
    ).toSorted(
      (a, b) =>
        a.executedAt.localeCompare(b.executedAt) || a.id.localeCompare(b.id),
    );
    expect(csv).toHaveBeenCalledWith(headers('tr'), transactionRows(selected));
    await userEvent.click(screen.getByRole('button', { name: 'Excel indir' }));
    await waitFor(() => expect(download).toHaveBeenCalledTimes(3));
    await userEvent.click(screen.getByLabelText('İptal edilen işlemler dahil'));
    await userEvent.clear(screen.getByLabelText('Başlangıç tarihi'));
    await userEvent.click(screen.getByRole('button', { name: 'PDF indir' }));
    await waitFor(() => expect(report).toHaveBeenCalledOnce());
    await waitFor(() => expect(download).toHaveBeenCalledTimes(4));
    expect(report.mock.calls[0]?.[0]).toHaveLength(SEED_TRANSACTIONS.length);
    await userEvent.type(
      screen.getByLabelText('Başlangıç tarihi'),
      '2030-01-01',
    );
    expect(screen.getByRole('button', { name: /PDF indir/ })).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Bitiş tarihi'), '2025-01-01');
    expect(
      screen.getByText('Başlangıç tarihi bitiş tarihinden sonra olamaz.'),
    ).toBeInTheDocument();
  });
  it('previews and commits records, then prevents a duplicate second import', async () => {
    renderWithProviders(<ImportExportPage />);
    await screen.findByRole('button', { name: 'Excel şablonunu indir' });
    await upload([row]);
    expect(service.readLedger()).toHaveLength(SEED_TRANSACTIONS.length);
    await userEvent.click(
      screen.getByRole('button', { name: '1 işlemi ekle' }),
    );
    expect(await screen.findByText('1 işlem eklendi.')).toBeInTheDocument();
    expect(service.readLedger()).toHaveLength(SEED_TRANSACTIONS.length + 1);
    await upload([row]);
    expect(
      screen.getByRole('button', { name: '0 işlemi ekle' }),
    ).toBeDisabled();
    await userEvent.click(
      screen.getByRole('button', { name: 'Dosyayı kaldır' }),
    );
    expect(
      screen.queryByRole('region', { name: 'Dosya kontrolü' }),
    ).not.toBeInTheDocument();
  });
  it('blocks invalid rows and paginates the full review', async () => {
    renderWithProviders(<ImportExportPage />);
    await screen.findByRole('button', { name: 'Excel şablonunu indir' });
    await upload([
      row,
      ...Array.from({ length: 20 }, () => ({ ...row, asset: 'wrong' })),
    ]);
    expect(
      screen.getByRole('button', { name: '1 işlemi ekle' }),
    ).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Sonraki' }));
    expect(screen.getByText('Satır 22')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Önceki' }));
    expect(screen.getByText('Satır 2')).toBeInTheDocument();
  });
  it('shows read, empty-file, insufficient balance and download failures', async () => {
    vi.spyOn(files, 'spreadsheetBlob').mockRejectedValue(new Error('offline'));
    renderWithProviders(<ImportExportPage />);
    await screen.findByRole('button', { name: 'Excel şablonunu indir' });
    await userEvent.click(
      screen.getByRole('button', { name: 'Excel şablonunu indir' }),
    );
    await screen.findByRole('alert');
    vi.spyOn(files, 'readTransferFile').mockRejectedValue(new Error('size'));
    await userEvent.upload(
      screen.getByLabelText('Dosya seç'),
      new File(['test'], 'test.csv'),
    );
    expect(
      await screen.findByText('Dosya 5 MB sınırını aşıyor.'),
    ).toBeInTheDocument();
    await upload([]);
    expect(screen.getByText('Dosyada işlem satırı yok.')).toBeInTheDocument();
    await upload([{ ...row, type: 'SELL', quantity: '999' }]);
    await userEvent.click(
      screen.getByRole('button', { name: '1 işlemi ekle' }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'bakiye yetersiz',
    );
    expect(service.readLedger()).toHaveLength(SEED_TRANSACTIONS.length);
    await userEvent.click(screen.getByRole('button', { name: 'Excel indir' }));
    expect(
      await screen.findByText(
        'İşlem tamamlanamadı. Dosyayı kontrol edip tekrar dene.',
      ),
    ).toBeInTheDocument();
  });
  it('retries loading and keeps exported cancelled records out of import', async () => {
    vi.spyOn(service, 'fetchTransactions').mockRejectedValueOnce(
      new Error('offline'),
    );
    renderWithProviders(<ImportExportPage />);
    await screen.findByRole('alert');
    await userEvent.click(screen.getByRole('button', { name: 'Tekrar dene' }));
    await screen.findByRole('button', { name: 'Excel şablonunu indir' });
    await upload(
      mapRows([headers('tr'), ...transactionRows(SEED_TRANSACTIONS)]),
    );
    expect(
      screen.getByRole('button', { name: '0 işlemi ekle' }),
    ).toBeDisabled();
  });
});
