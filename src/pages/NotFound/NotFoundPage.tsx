import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routePaths';

export function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-start gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">
        {t('notFound.title')}
      </h1>
      <p className="text-fg-2">{t('notFound.description')}</p>
      <Link className="mt-2 text-primary" to={ROUTE_PATHS.dashboard}>
        {t('common.backToHome')}
      </Link>
    </div>
  );
}
