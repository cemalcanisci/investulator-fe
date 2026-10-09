import type { JSX } from 'react';
import { Skeleton } from '@/components/Skeleton/Skeleton';

const SUMMARY_PLACEHOLDERS = ['a', 'b', 'c'] as const;

export function HoldingsSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col gap-6" role="status" aria-busy="true">
      <div className="grid gap-4 sm:grid-cols-3">
        {SUMMARY_PLACEHOLDERS.map((key) => (
          <Skeleton key={key} className="h-[112px]" />
        ))}
      </div>
      <Skeleton className="h-[88px]" />
      <Skeleton className="h-[420px]" />
    </div>
  );
}
