import type { Holding } from '@/domain/holding';

/** A position whose price could not be loaded: value and profit or loss are unknown. */
export const UNAVAILABLE_HOLDING: Holding = {
  id: 'tst',
  assetName: 'Test Coin',
  symbol: 'TST',
  assetType: 'CRYPTO',
  quantity: '10',
  unit: null,
  avgCostPerUnit: '1.00',
  cost: '10.00',
  currentPricePerUnit: null,
  value: null,
  pnl: null,
  pnlPercent: null,
  priceStatus: 'UNAVAILABLE',
  priceUpdatedAt: null,
};
