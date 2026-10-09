import type { JSX } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';

export function TransactionsSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-6" role="status" aria-busy="true">
      <Skeleton className="h-[88px]" />
      <Skeleton className="h-[480px]" />
    </div>
  );
}
