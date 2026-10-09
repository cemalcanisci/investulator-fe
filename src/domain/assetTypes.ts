export const ASSET_TYPES = [
  'CRYPTO',
  'BIST_STOCK',
  'US_STOCK',
  'GOLD',
  'FX',
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

// Each asset type owns one chart color slot for good: color follows the entity, never its rank,
// so filtering or reordering never repaints a type (dataviz rule).
export const ASSET_TYPE_COLOR: Readonly<Record<AssetType, string>> = {
  BIST_STOCK: 'var(--chart-1)',
  GOLD: 'var(--chart-2)',
  US_STOCK: 'var(--chart-3)',
  CRYPTO: 'var(--chart-4)',
  FX: 'var(--chart-5)',
};

export const TRANSACTION_TYPES = [
  'BUY',
  'SELL',
  'BONUS',
  'SPLIT',
  'DIVIDEND',
] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

/** How a position is counted: grams for gram gold, pieces for coins such as quarter gold. */
export type QuantityUnit = 'GRAM' | 'PIECE';
