// The invented ledger behind the mock services. Quantities add up to the holdings in
// mockPortfolio.ts (a test guards it), and the five newest active rows are the ones the dashboard
// lists. Amounts are derived here so every row is internally consistent: total = quantity x unit
// price, USD = total x the day's rate.
import type { TransactionType } from '@/domain/assetTypes';
import type { Transaction } from '@/domain/transaction';
import { multiplyDecimals, roundDecimal } from '@/lib/decimal';
import { CATALOG } from '@/services/mockCatalog';

interface Extra {
  readonly total?: string;
  readonly fee?: string;
  readonly note?: string;
  readonly manualRate?: boolean;
  readonly voidReason?: string;
}

type Row = readonly [
  date: string,
  type: TransactionType,
  assetId: string,
  quantity: string | null,
  unitPrice: string | null,
  rateToUsd: string,
  platform: string | null,
  extra?: Extra,
];

// Keyed by date and asset; the mistaken Ethereum purchase was cancelled a day later.
const VOIDED = new Set(['2026-09-15|eth']);
const VOIDED_AT = '2026-09-16';

// Oldest first; rates are USD per lira on the day (the lira weakens over the year).
const ROWS: readonly Row[] = [
  ['2025-09-30', 'BUY', 'nvda', '50', '108.40', '1', 'Midas'],
  [
    '2025-10-08',
    'BUY',
    'xau-g',
    '120',
    '2600.00',
    '0.02650',
    'Kuyumcu',
    { note: 'İlk gram altın alımı' },
  ],
  [
    '2025-10-14',
    'BUY',
    'thyao',
    '1000',
    '330.00',
    '0.02630',
    'Midas',
    { fee: '82.50' },
  ],
  ['2025-10-20', 'BUY', 'aapl', '30', '170.20', '1', 'Midas'],
  ['2025-11-03', 'BUY', 'msft', '20', '372.00', '1', 'Midas'],
  ['2025-11-10', 'BUY', 'btc', '0.3000', '39500.00', '1', 'Binance'],
  ['2025-12-02', 'BUY', 'eth', '3.0000', '3050.00', '1', 'Binance'],
  ['2025-12-15', 'BUY', 'xau-c', '10', '9150.00', '0.02600', 'Kuyumcu'],
  [
    '2026-01-08',
    'BUY',
    'asels',
    '600',
    '145.00',
    '0.02560',
    'Midas',
    { fee: '65.25' },
  ],
  ['2026-01-14', 'BUY', 'sol', '20.0000', '118.50', '1', 'Binance'],
  ['2026-01-22', 'BUY', 'xau-a', '4', '19900.00', '0.02550', 'Kuyumcu'],
  ['2026-02-05', 'BUY', 'nvda', '35', '113.10', '1', 'Midas'],
  ['2026-02-12', 'BUY', 'eur', '3000.00', '42.60', '0.02540', 'Banka'],
  ['2026-02-18', 'BUY', 'eth', '1.2000', '2900.00', '1', 'Binance'],
  [
    '2026-02-25',
    'BUY',
    'thyao',
    '500',
    '350.00',
    '0.02530',
    'Midas',
    { fee: '43.75' },
  ],
  ['2026-03-04', 'BUY', 'btc', '0.1750', '44000.00', '1', 'Binance'],
  ['2026-03-16', 'BUY', 'msft', '10', '398.00', '1', 'Midas'],
  ['2026-03-25', 'BUY', 'xau-g', '70', '2700.00', '0.02510', 'Banka'],
  ['2026-04-08', 'BUY', 'aapl', '12', '175.90', '1', 'Midas'],
  ['2026-04-14', 'BUY', 'bimas', '220', '480.00', '0.02500', 'Midas'],
  ['2026-05-06', 'BUY', 'xau-c', '12', '9600.00', '0.02490', 'Kuyumcu'],
  ['2026-05-20', 'BUY', 'sol', '7.5000', '139.80', '1', 'Binance'],
  [
    '2026-05-28',
    'BONUS',
    'thyao',
    '300',
    null,
    '0.02480',
    'Midas',
    { note: 'Bedelsiz sermaye artırımı' },
  ],
  ['2026-06-03', 'BUY', 'gbp', '2500.00', '50.60', '0.02480', 'Banka'],
  ['2026-06-11', 'BUY', 'xau-a', '2', '21050.00', '0.02480', 'Kuyumcu'],
  [
    '2026-07-02',
    'BUY',
    'asels',
    '300',
    '160.00',
    '0.02470',
    'Midas',
    { fee: '36.00' },
  ],
  ['2026-07-21', 'BUY', 'eur', '2000.00', '44.00', '0.02460', 'Banka'],
  [
    '2026-08-11',
    'SELL',
    'gbp',
    '400.00',
    '52.60',
    '0.02450',
    'Banka',
    { manualRate: true, note: 'Bankanın kuru farklıydı' },
  ],
  ['2026-09-02', 'BUY', 'xau-g', '10', '2952.00', '0.02424', 'Kuyumcu'],
  [
    '2026-09-05',
    'DIVIDEND',
    'thyao',
    null,
    null,
    '0.02423',
    'Midas',
    { total: '1700.00' },
  ],
  ['2026-09-12', 'BUY', 'aapl', '3', '198.10', '1', 'Midas'],
  [
    '2026-09-15',
    'BUY',
    'eth',
    '0.5000',
    '2820.00',
    '1',
    'Binance',
    { voidReason: 'Yanlış varlığı seçtim' },
  ],
  ['2026-09-17', 'SELL', 'btc', '0.0500', '43000.00', '1', 'Binance'],
  ['2026-09-19', 'BUY', 'xau-c', '2', '10070.00', '0.02424', 'Kuyumcu'],
];

function toTransaction(row: Row, index: number): Transaction {
  const [date, type, assetId, quantity, unitPrice, rate, platform, extra] = row;
  const asset = CATALOG.find((entry) => entry.id === assetId);
  if (asset === undefined) {
    throw new Error(`Unknown asset in the mock ledger: ${assetId}`);
  }
  const total =
    extra?.total ??
    (quantity !== null && unitPrice !== null
      ? roundDecimal(multiplyDecimals(quantity, unitPrice), 2)
      : null);
  const voided = VOIDED.has(`${date}|${assetId}`);

  return {
    id: `tx-${String(index + 1).padStart(4, '0')}`,
    type,
    assetId,
    assetName: asset.name,
    symbol: asset.symbol,
    assetType: asset.assetType,
    unit: asset.unit,
    executedAt: date,
    quantity,
    unitPrice,
    totalAmount: total,
    currency: asset.priceCurrency,
    fee: extra?.fee ?? null,
    fxRateToUsd: rate,
    fxRateSource: extra?.manualRate ? 'MANUAL' : 'AUTO',
    usdAmount:
      total === null ? '0.00' : roundDecimal(multiplyDecimals(total, rate), 2),
    platform,
    note: extra?.note ?? null,
    splitRatio: null,
    status: voided ? 'VOIDED' : 'ACTIVE',
    voidedAt: voided ? VOIDED_AT : null,
    voidReason: voided ? (extra?.voidReason ?? null) : null,
  };
}

export const SEED_TRANSACTIONS: readonly Transaction[] =
  ROWS.map(toTransaction);
