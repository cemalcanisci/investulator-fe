import type { JSX, ReactNode } from 'react';

export interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly hint?: string;
  readonly children: ReactNode;
}

/** A form row: label, the control (which must use `id`), an optional hint and the error text. */
export function Field({
  id,
  label,
  error,
  hint,
  children,
}: FieldProps): JSX.Element {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {hint !== undefined && error === undefined && (
        <p className="text-xs text-fg-2">{hint}</p>
      )}
      {error !== undefined && (
        <p id={`${id}-error`} className="text-sm text-neg">
          {error}
        </p>
      )}
    </div>
  );
}
