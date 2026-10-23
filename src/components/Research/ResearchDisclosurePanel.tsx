import { useContext } from 'react';
import type { JSX, ReactNode } from 'react';
import { ResearchViewContext } from '@/components/Research/researchView';

export function ResearchDisclosurePanel({
  title,
  children,
}: {
  readonly title: string;
  readonly children: ReactNode;
}): JSX.Element {
  const view = useContext(ResearchViewContext);
  return (
    <details
      open={view === 'DETAILED'}
      className="rounded-xl border border-line bg-surface p-4"
    >
      <summary className="font-medium text-primary">{title}</summary>
      <div className="mt-4 space-y-4">{children}</div>
    </details>
  );
}
