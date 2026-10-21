export const ROUTE_PATHS = {
  dashboard: '/',
  holdings: '/yatirimlar',
  assetDetail: '/yatirimlar/:assetId',
  transactions: '/islemler',
  // The transactions page opens its new-transaction form when it finds this query.
  transactionsNew: '/islemler?yeni=1',
  analysis: '/analiz',
  strategies: '/stratejiler',
  research: '/takip/:assetId',
  importExport: '/aktar',
  foundations: '/temel',
} as const;

export function assetDetailPath(assetId: string): string {
  return `/yatirimlar/${encodeURIComponent(assetId)}`;
}

export function researchPath(assetId: string): string {
  return `/takip/${encodeURIComponent(assetId)}`;
}
