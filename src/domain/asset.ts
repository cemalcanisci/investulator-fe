import type { AssetType, QuantityUnit } from '@/domain/assetTypes';
import type { TransactionCurrency } from '@/domain/transaction';

/** An entry of the shared asset catalog a transaction can refer to. */
export interface CatalogAsset {
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly assetType: AssetType;
  readonly unit: QuantityUnit | null;
  /** The currency the asset is normally priced and paid in. */
  readonly priceCurrency: TransactionCurrency;
}
