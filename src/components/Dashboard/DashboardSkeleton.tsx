import type { JSX } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';

const KPI_PLACEHOLDERS = ['a', 'b', 'c', 'd'] as const;

export function DashboardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-6" role="status" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-[128px]" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-[380px] lg:col-span-2" />
        <Skeleton className="h-[380px]" />
      </div>
      <Skeleton className="h-[240px]" />
    </div>
  );
}
