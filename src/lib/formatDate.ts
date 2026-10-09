/** Formats a calendar date ("2026-09-19"); dates carry no time zone, so the day never shifts. */
export function formatDate(isoDate: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

/** Short axis label; long ranges show month and year, short ranges day and month. */
export function formatAxisDate(
  isoDate: string,
  locale: string,
  longRange: boolean,
): string {
  return new Intl.DateTimeFormat(locale, {
    ...(longRange
      ? { month: 'short', year: '2-digit' }
      : { day: 'numeric', month: 'short' }),
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatTime(isoDateTime: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeStyle: 'short' }).format(
    new Date(isoDateTime),
  );
}

/** Today's calendar date in the user's time zone as an ISO date ("2026-09-21"). */
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}
