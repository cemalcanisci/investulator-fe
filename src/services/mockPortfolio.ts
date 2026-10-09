// The one invented portfolio behind the mock services. Dashboard and Holdings both derive from it,
// so the two pages always agree. Gold is one asset per product (gram, quarter, full Ata coin...).
import type { AssetType, QuantityUnit } from '@/domain/assetTypes';
import type { Holding, PriceStatus } from '@/domain/holding';
import { percentageOf, subtractDecimals, toDisplayNumber } from '@/lib/decimal';

export const PRICES_UPDATED_AT = '2026-09-21T11:05:00.000Z';
const STALE_PRICE_TIME = '2026-09-21T09:05:00.000Z';

interface RawHolding {
  readonly id: string;
  readonly assetName: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly quantity: string;
  readonly unit: QuantityUnit | null;
  readonly avgCostPerUnit: string;
  readonly cost: string;
  readonly price: string | null;
  readonly value: string | null;
  readonly priceStatus?: PriceStatus;
}

const RAW_HOLDINGS: readonly RawHolding[] = [
  {
    id: 'btc',
    assetName: 'Bitcoin',
    symbol: 'BTC',
    assetType: 'CRYPTO',
    quantity: '0.4250',
    unit: null,
    avgCostPerUnit: '41200.00',
    cost: '17510.00',
    price: '51764.71',
    value: '22000.00',
  },
  {
    id: 'eth',
    assetName: 'Ethereum',
    symbol: 'ETH',
    assetType: 'CRYPTO',
    quantity: '4.2000',
    unit: null,
    avgCostPerUnit: '3000.00',
    cost: '12600.00',
    price: '2800.00',
    value: '11760.00',
  },
  {
    id: 'sol',
    assetName: 'Solana',
    symbol: 'SOL',
    assetType: 'CRYPTO',
    quantity: '27.5000',
    unit: null,
    avgCostPerUnit: '127.27',
    cost: '3500.00',
    price: '163.28',
    value: '4490.10',
  },
  {
    id: 'aapl',
    assetName: 'Apple',
    symbol: 'AAPL',
    assetType: 'US_STOCK',
    quantity: '45',
    unit: null,
    avgCostPerUnit: '172.40',
    cost: '7758.00',
    price: '198.10',
    value: '8914.50',
  },
  {
    id: 'msft',
    assetName: 'Microsoft',
    symbol: 'MSFT',
    assetType: 'US_STOCK',
    quantity: '30',
    unit: null,
    avgCostPerUnit: '380.00',
    cost: '11400.00',
    price: '418.50',
    value: '12555.00',
  },
  {
    id: 'nvda',
    assetName: 'NVIDIA',
    symbol: 'NVDA',
    assetType: 'US_STOCK',
    quantity: '85',
    unit: null,
    avgCostPerUnit: '110.00',
    cost: '9350.00',
    price: '131.07',
    value: '11140.90',
  },
  {
    id: 'xau-g',
    assetName: 'Gram altın',
    symbol: 'XAU-G',
    assetType: 'GOLD',
    quantity: '200',
    unit: 'GRAM',
    avgCostPerUnit: '68.10',
    cost: '13620.00',
    price: '74.30',
    value: '14860.00',
  },
  {
    id: 'xau-c',
    assetName: 'Çeyrek altın',
    symbol: 'XAU-Ç',
    assetType: 'GOLD',
    quantity: '24',
    unit: 'PIECE',
    avgCostPerUnit: '238.50',
    cost: '5724.00',
    price: '246.90',
    value: '5925.60',
  },
  {
    id: 'xau-a',
    assetName: 'Ata altını (tam)',
    symbol: 'XAU-A',
    assetType: 'GOLD',
    quantity: '6',
    unit: 'PIECE',
    avgCostPerUnit: '520.00',
    cost: '3120.00',
    price: '555.86',
    value: '3335.17',
  },
  {
    id: 'thyao',
    assetName: 'Türk Hava Yolları',
    symbol: 'THYAO',
    assetType: 'BIST_STOCK',
    quantity: '1800',
    unit: null,
    avgCostPerUnit: '8.90',
    cost: '16020.00',
    price: '8.27',
    value: '14886.00',
    priceStatus: 'STALE',
  },
  {
    id: 'asels',
    assetName: 'Aselsan',
    symbol: 'ASELS',
    assetType: 'BIST_STOCK',
    quantity: '900',
    unit: null,
    avgCostPerUnit: '3.85',
    cost: '3465.00',
    price: '4.20',
    value: '3780.75',
  },
  {
    id: 'bimas',
    assetName: 'BİM',
    symbol: 'BIMAS',
    assetType: 'BIST_STOCK',
    quantity: '220',
    unit: null,
    avgCostPerUnit: '12.00',
    cost: '2640.00',
    price: '12.79',
    value: '2813.80',
  },
  {
    id: 'eur',
    assetName: 'Euro',
    symbol: 'EUR',
    assetType: 'FX',
    quantity: '5000.00',
    unit: null,
    avgCostPerUnit: '1.0820',
    cost: '5410.00',
    price: '1.0750',
    value: '5375.00',
  },
  {
    id: 'gbp',
    assetName: 'İngiliz Sterlini',
    symbol: 'GBP',
    assetType: 'FX',
    quantity: '2100.00',
    unit: null,
    avgCostPerUnit: '1.2500',
    cost: '2625.00',
    price: '1.3065',
    value: '2743.60',
  },
];

function toHolding(raw: RawHolding): Holding {
  const priceStatus = raw.priceStatus ?? 'FRESH';
  const pnl = raw.value === null ? null : subtractDecimals(raw.value, raw.cost);
  return {
    id: raw.id,
    assetName: raw.assetName,
    symbol: raw.symbol,
    assetType: raw.assetType,
    quantity: raw.quantity,
    unit: raw.unit,
    avgCostPerUnit: raw.avgCostPerUnit,
    cost: raw.cost,
    currentPricePerUnit: raw.price,
    value: raw.value,
    pnl,
    pnlPercent: pnl === null ? null : percentageOf(pnl, raw.cost),
    priceStatus,
    priceUpdatedAt:
      priceStatus === 'STALE' ? STALE_PRICE_TIME : PRICES_UPDATED_AT,
  };
}

function valueOf(holding: Holding): number {
  return holding.value === null ? 0 : toDisplayNumber(holding.value);
}

/** Largest position first. */
export const HOLDINGS: readonly Holding[] = RAW_HOLDINGS.map(toHolding).sort(
  (a, b) => valueOf(b) - valueOf(a),
);
