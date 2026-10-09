import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';

export interface BrandProps {
  readonly className?: string;
  readonly nameClassName?: string;
}

export function Brand({
  className = '',
  nameClassName = '',
}: BrandProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center gap-2.5 font-semibold ${className}`}
    >
      <span
        className="grid size-8 flex-none place-items-center rounded-lg bg-primary text-on-primary"
        aria-hidden="true"
      >
        I
      </span>
      <span className={nameClassName}>{t('app.name')}</span>
    </span>
  );
}
