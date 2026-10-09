import type { JSX } from 'react';

export interface SkeletonProps {
  readonly className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps): JSX.Element {
  return (
    <div
      className={`rounded-lg bg-surface-2 motion-safe:animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}
