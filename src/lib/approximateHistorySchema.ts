import type { ApproximateHistory } from '@/domain/approximateHistory';
function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isApproximateHistory(
  value: unknown,
): value is ApproximateHistory {
  if (!object(value) || !object(value.coverage)) {
    return false;
  }
  const coverage = value.coverage;
  function strings(
    record: Record<string, unknown>,
    keys: readonly string[],
  ): boolean {
    return keys.every((key) => typeof record[key] === 'string');
  }
  function list(value: unknown): boolean {
    return (
      Array.isArray(value) && value.every((item) => typeof item === 'string')
    );
  }
  return (
    strings(value, ['assetId', 'asOf', 'shareBasisDate']) &&
    (value.listedFrom === null || typeof value.listedFrom === 'string') &&
    ['TRY', 'USD'].includes(String(value.currency)) &&
    ['SPLIT_ONLY', 'TOTAL_RETURN', 'UNKNOWN'].includes(
      String(value.priceBasis),
    ) &&
    ['prices', 'fx', 'actions', 'dividends'].every((key) => {
      const item = coverage[key];
      return (
        object(item) &&
        strings(item, ['from', 'to', 'method']) &&
        list(item.sourceIds) &&
        ['REVIEWED', 'MISSING', 'CONFLICT'].includes(String(item.state))
      );
    }) &&
    Array.isArray(value.sources) &&
    value.sources.every(
      (item) =>
        object(item) &&
        strings(item, ['id', 'url', 'title', 'origin', 'retrievedAt']),
    ) &&
    Array.isArray(value.monthly) &&
    value.monthly.every(
      (item) =>
        object(item) &&
        strings(item, [
          'date',
          'close',
          'fx',
          'fxDate',
          'priceSourceId',
          'fxSourceId',
        ]),
    ) &&
    Array.isArray(value.actions) &&
    value.actions.every(
      (item) =>
        object(item) &&
        strings(item, ['id', 'date', 'factor', 'sourceId']) &&
        ['SPLIT', 'BONUS', 'UNSUPPORTED'].includes(String(item.type)),
    ) &&
    Array.isArray(value.dividends) &&
    value.dividends.every(
      (item) =>
        object(item) &&
        strings(item, [
          'id',
          'exDate',
          'payDate',
          'rawGrossPerShare',
          'sourceId',
        ]),
    ) &&
    list(value.expectedDividendIds) &&
    list(value.expectedActionIds)
  );
}
