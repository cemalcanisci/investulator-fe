import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it, vi, afterEach } from 'vitest';
import { transactionPdf } from '@/lib/transfer/pdf';
import { SEED_TRANSACTIONS } from '@/services/mockTransactions';
import { i18n } from '@/i18n';

const font = new Uint8Array(readFileSync('public/fonts/NotoSans-Regular.ttf'))
  .buffer;

describe('transaction PDF', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('generates a multipage report with an embedded Turkish font', async () => {
    const blob = await transactionPdf(SEED_TRANSACTIONS, i18n.t, font);
    expect(blob.type).toBe('application/pdf');
    expect(blob.size).toBeGreaterThan(20000);
    const buffer = await blob.arrayBuffer();
    const text = new TextDecoder('latin1').decode(buffer);
    expect(text).toMatch(/^%PDF/);
    expect(text).toContain('/FontFile2');
    expect((text.match(/\/Type \/Page\b/g) ?? []).length).toBeGreaterThan(1);
    if (process.env.TRANSFER_PDF_PATH !== undefined) {
      writeFileSync(process.env.TRANSFER_PDF_PATH, new Uint8Array(buffer));
    }
  });
  it('loads the font from the same origin and rejects missing fonts', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: () => Promise.resolve(font),
    });
    vi.stubGlobal('fetch', fetcher);
    expect((await transactionPdf([], i18n.t)).type).toBe('application/pdf');
    expect(fetcher).toHaveBeenCalledWith('/fonts/NotoSans-Regular.ttf');
    fetcher.mockResolvedValue({ ok: false });
    await expect(transactionPdf([], i18n.t)).rejects.toThrow('font');
  });
});
