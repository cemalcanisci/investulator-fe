import { RiArrowDownSFill, RiArrowUpSFill } from '@remixicon/react';
import type { JSX } from 'react';

export interface SortState<K extends string> {
  readonly sort: K;
  readonly direction: 'asc' | 'desc';
}

export interface SortButtonProps<K extends string> {
  readonly label: string;
  /** Read by screen readers instead of `label` when the visible label alone is unclear ("%"). */
  readonly ariaLabel?: string;
  readonly sort: K;
  readonly order: SortState<K>;
  readonly onSort: (sort: K) => void;
}

/** Column header button: shows the current direction with two carets, the active one highlighted. */
export function SortButton<K extends string>({
  label,
  ariaLabel,
  sort,
  order,
  onSort,
}: SortButtonProps<K>): JSX.Element {
  const active = order.sort === sort;
  const caret = 'size-3.5 -my-1';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => onSort(sort)}
      className={`inline-flex items-center gap-1 rounded-sm hover:text-fg ${active ? 'text-fg' : ''}`}
    >
      {label}
      <span className="flex flex-col" aria-hidden="true">
        <RiArrowUpSFill
          className={`${caret} ${active && order.direction === 'asc' ? 'text-primary' : 'text-fg-3'}`}
        />
        <RiArrowDownSFill
          className={`${caret} ${active && order.direction === 'desc' ? 'text-primary' : 'text-fg-3'}`}
        />
      </span>
    </button>
  );
}
