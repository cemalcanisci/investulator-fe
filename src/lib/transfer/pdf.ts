import type { Transaction } from '@/domain/transaction';
import type { TFunction } from 'i18next';

export async function transactionPdf(
  rows: readonly Transaction[],
  t: TFunction,
  fontBytes?: ArrayBuffer,
): Promise<Blob> {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  let bytes = fontBytes;
  if (bytes === undefined) {
    const response = await fetch(
      `${import.meta.env.BASE_URL}fonts/NotoSans-Regular.ttf`,
    );
    if (!response.ok) {
      throw new Error('font');
    }
    bytes = await response.arrayBuffer();
  }
  const font = Array.from(new Uint8Array(bytes), (byte) =>
    String.fromCharCode(byte),
  ).join('');
  const doc = new jsPDF({ orientation: 'landscape', compress: true });
  doc.addFileToVFS('NotoSans.ttf', btoa(font));
  doc.addFont('NotoSans.ttf', 'NotoSans', 'normal');
  doc.setFont('NotoSans');
  doc.setFontSize(20);
  doc.text('Investulator', 14, 19);
  doc.setFontSize(12);
  doc.text(t('transfer.reportTitle'), 14, 28);
  doc.setFontSize(9);
  doc.text(t('transfer.reportCount', { count: rows.length }), 14, 35);
  autoTable(doc, {
    startY: 42,
    margin: { top: 15, bottom: 18, left: 14, right: 14 },
    styles: {
      font: 'NotoSans',
      fontStyle: 'normal',
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    headStyles: { fontStyle: 'normal', fillColor: [35, 78, 82] },
    head: [
      [
        t('transfer.columns.date'),
        t('transfer.columns.asset'),
        t('transfer.columns.type'),
        t('transfer.columns.quantity'),
        t('transfer.columns.totalAmount'),
        'USD',
        t('transfer.columns.status'),
      ],
    ],
    body: rows.map((row) => [
      row.executedAt,
      `${row.assetName}\n${row.symbol}`,
      t(`transactionTypes.${row.type}`),
      row.quantity ?? (row.splitRatio === null ? '-' : `× ${row.splitRatio}`),
      row.totalAmount === null ? '-' : `${row.totalAmount} ${row.currency}`,
      row.usdAmount,
      t(`transfer.${row.status}`),
    ]),
    rowPageBreak: 'avoid',
  });
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFontSize(8);
    doc.text(t('transfer.reportFooter'), 14, 201);
    doc.text(`${page} / ${pages}`, 282, 201, { align: 'right' });
  }
  return doc.output('blob');
}
