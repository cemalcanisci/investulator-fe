import type { StrategySnapshot, WatchAsset } from '@/domain/strategy';
import { CATALOG } from '@/services/mockCatalog';

const STOCKS = [
  ['DOAS', 'Doğuş Otomotiv'],
  ['TUPRS', 'Tüpraş'],
  ['YGGYO', 'Yeni Gimat GYO'],
  ['TTRAK', 'TürkTraktör'],
  ['FROTO', 'Ford Otosan'],
  ['ISMEN', 'İş Yatırım Menkul Değerler'],
  ['TOASO', 'Tofaş'],
  ['AKSA', 'Aksa Akrilik'],
  ['AKMGY', 'Akmerkez GYO'],
  ['PAGYO', 'Panora GYO'],
] as const;
const CRYPTO = [
  'ENA',
  'TAO',
  'ETHFI',
  'EIGEN',
  'ARB',
  'AI',
  'ZK',
  'RLC',
  'ARKM',
  'METIS',
  'KAS',
  'FET',
  'NAKA',
  'TIA',
  'VAI',
] as const;

const stocks: WatchAsset[] = STOCKS.map(([symbol, name]) => ({
  id: `watch-bist-${symbol.toLowerCase()}`,
  symbol,
  name,
  assetType: 'BIST_STOCK',
  market: 'BIST',
  pair: null,
  providerId: null,
  identityStatus: 'UNVERIFIED',
}));
const crypto: WatchAsset[] = CRYPTO.map((symbol) => ({
  id: `watch-crypto-candidate-${symbol.toLowerCase()}`,
  symbol,
  name: null,
  assetType: 'CRYPTO',
  market: null,
  pair: `${symbol}USDT`,
  providerId: null,
  identityStatus: 'UNVERIFIED',
}));

/** Candidate IDs are local references, never inferred provider identities. */
export function createStrategySeed(): StrategySnapshot {
  return {
    groups: [
      {
        id: 'bist-dividend',
        name: 'BIST Temettü',
        description: '',
        targetWeight: null,
        targetAssetCount: null,
      },
      {
        id: 'crypto-watch',
        name: 'Kripto Takip',
        description: '',
        targetWeight: null,
        targetAssetCount: null,
      },
    ],
    assets: [
      ...stocks,
      ...crypto,
      ...CATALOG.map((asset): WatchAsset => ({
        id: asset.id,
        symbol: asset.symbol,
        name: asset.name,
        assetType: asset.assetType,
        market: asset.assetType === 'BIST_STOCK' ? 'BIST' : null,
        pair: null,
        providerId: null,
        identityStatus: 'UNVERIFIED',
      })),
    ],
    memberships: [
      ...stocks.map((asset) => ({
        groupId: 'bist-dividend',
        assetId: asset.id,
      })),
      ...crypto.map((asset) => ({
        groupId: 'crypto-watch',
        assetId: asset.id,
      })),
    ],
  };
}
