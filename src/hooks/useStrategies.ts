import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { StrategyCommand, StrategySnapshot } from '@/domain/strategy';
import { strategyService } from '@/services/strategies';

const QUERY_KEY = ['strategies'] as const;
interface StrategyState {
  readonly query: UseQueryResult<StrategySnapshot, Error>;
  readonly action: UseMutationResult<StrategySnapshot, Error, StrategyCommand>;
}

export function useStrategies(): StrategyState {
  const client = useQueryClient();
  return {
    query: useQuery({
      queryKey: QUERY_KEY,
      queryFn: () => strategyService.fetch(),
    }),
    action: useMutation({
      mutationFn: (command: StrategyCommand) =>
        strategyService.execute(command),
      onSuccess: (data) => {
        client.setQueryData(QUERY_KEY, data);
      },
    }),
  };
}
