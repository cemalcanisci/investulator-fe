import { RiErrorWarningLine } from '@remixicon/react';
import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

export interface ErrorStateProps {
  readonly onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-line bg-surface p-8 text-center"
    >
      <RiErrorWarningLine className="size-8 text-neg" aria-hidden="true" />
      <div>
        <p className="font-medium">{t('common.loadError')}</p>
        <p className="text-sm text-fg-2">{t('common.loadErrorHint')}</p>
      </div>
      <Button onClick={onRetry}>{t('common.retryButton')}</Button>
    </div>
  );
}
