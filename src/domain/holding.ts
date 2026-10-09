import type { AssetType, QuantityUnit } from '@/domain/assetTypes';

/** FRESH: current price; STALE: an old price is shown; UNAVAILABLE: no price could be loaded. */
export type PriceStatus = 'FRESH' | 'STALE' | 'UNAVAILABLE';

/** One position: everything the user holds of a single asset (gold is one asset per product). */
export interface Holding {
  readonly id: string;
  readonly assetName: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly quantity: string;
  readonly unit: QuantityUnit | null;
  readonly avgCostPerUnit: string;
  readonly cost: string;
  /** Null while the price is unavailable; value and profit or loss are then unknown too. */
  readonly currentPricePerUnit: string | null;
  readonly value: string | null;
  readonly pnl: string | null;
  readonly pnlPercent: string | null;
  readonly priceStatus: PriceStatus;
  readonly priceUpdatedAt: string | null;
}
