import type { JSX, ReactNode } from 'react';

export interface CardProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <section
      className={`rounded-xl border border-line bg-surface shadow-card ${className}`}
    >
      {children}
    </section>
  );
}
