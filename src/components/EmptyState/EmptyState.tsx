import type { ComponentType, JSX, ReactNode } from 'react';

export interface EmptyStateProps {
  readonly icon: ComponentType<{ readonly className?: string }>;
  readonly title: string;
  readonly description: string;
  readonly actions?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actions,
}: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface p-10 text-center">
      <Icon className="size-8 text-fg-2" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="mt-1 max-w-prose text-sm text-fg-2">{description}</p>
      </div>
      {actions !== undefined && (
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
