import type { JSX } from 'react';

export interface NativeSelectOption {
  readonly value: string;
  readonly label: string;
}

export interface NativeSelectProps {
  readonly id?: string;
  /** Read by screen readers; the visible text is the selected option. */
  readonly label: string;
  readonly value: string;
  readonly options: readonly NativeSelectOption[];
  readonly onChange: (value: string) => void;
  readonly className?: string;
}

/** A plain select: reliable on phones and in tests, styled to match the inputs. */
export function NativeSelect({
  id,
  label,
  value,
  options,
  onChange,
  className = '',
}: NativeSelectProps): JSX.Element {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`h-10 rounded-lg border border-line-strong bg-surface px-3 text-sm text-fg ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
