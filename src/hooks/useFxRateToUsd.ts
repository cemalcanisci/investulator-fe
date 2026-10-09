import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { TransactionCurrency } from '@/domain/transaction';
import { FX_QUERY_KEY } from '@/hooks/useUsdTryRate';
import { fetchRateToUsd } from '@/services/fx';
import { validDate } from '@/lib/formatDate';

/** USD per unit of `currency` on `date`; not fetched for dollars or while the date is incomplete. */
export function useFxRateToUsd(
  currency: TransactionCurrency,
  date: string,
): UseQueryResult<string> {
  return useQuery({
    queryKey: [...FX_QUERY_KEY, 'to-usd', currency, date],
    queryFn: () => fetchRateToUsd(currency, date),
    enabled: currency !== 'USD' && validDate(date),
  });
}
