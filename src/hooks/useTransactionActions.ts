import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { Transaction, TransactionInput } from '@/domain/transaction';
import { DASHBOARD_QUERY_KEY } from '@/hooks/useDashboardSummary';
import { TRANSACTIONS_QUERY_KEY } from '@/hooks/useTransactions';
import {
  createTransaction,
  restoreTransaction,
  updateTransaction,
  voidTransaction,
} from '@/services/transactions';

export interface TransactionActions {
  readonly create: UseMutationResult<Transaction, Error, TransactionInput>;
  readonly update: UseMutationResult<
    Transaction,
    Error,
    { readonly id: string; readonly input: TransactionInput }
  >;
  readonly cancel: UseMutationResult<
    Transaction,
    Error,
    { readonly id: string; readonly reason: string | null }
  >;
  readonly restore: UseMutationResult<Transaction, Error, string>;
}

/** Add, edit, cancel and restore; each refreshes the list and the dashboard's recent transactions. */
export function useTransactionActions(): TransactionActions {
  const queryClient = useQueryClient();
  const refresh = (): void => {
    void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    void queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
  };

  return {
    create: useMutation({
      mutationFn: createTransaction,
      onSuccess: refresh,
    }),
    update: useMutation({
      mutationFn: ({ id, input }: { id: string; input: TransactionInput }) =>
        updateTransaction(id, input),
      onSuccess: refresh,
    }),
    cancel: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string | null }) =>
        voidTransaction(id, reason),
      onSuccess: refresh,
    }),
    restore: useMutation({
      mutationFn: restoreTransaction,
      onSuccess: refresh,
    }),
  };
}
