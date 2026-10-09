import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { Transaction } from '@/domain/transaction';
import { fetchTransactions } from '@/services/transactions';

export const TRANSACTIONS_QUERY_KEY = ['transactions'] as const;

/** Every transaction of the user, cancelled ones included (the page filters them). */
export function useTransactions(): UseQueryResult<readonly Transaction[]> {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: fetchTransactions,
  });
}
