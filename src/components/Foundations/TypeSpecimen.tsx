import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/hooks/useLanguage';
import { formatMoney } from '@/lib/formatMoney';

export function TypeSpecimen(): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">{t('foundations.typography')}</h2>
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5">
        <p className="text-3xl font-semibold tracking-tight">
          {t('foundations.typeDisplay')}
        </p>
        <p>{t('foundations.typeBody')}</p>
        <p className="text-sm text-fg-2">{t('foundations.typeNumbers')}</p>
        <p className="text-2xl font-semibold tabular-nums">
          {formatMoney(124580.42, language, 'USD')}
        </p>
        <div className="flex flex-wrap gap-6 font-medium tabular-nums">
          <span className="inline-flex items-center gap-1 text-pos">
            <span aria-hidden="true">▲</span>
            <span className="sr-only">{t('foundations.profit')}</span>
            {formatMoney(1140.2, language, 'USD', { signed: true })}
          </span>
          <span className="inline-flex items-center gap-1 text-neg">
            <span aria-hidden="true">▼</span>
            <span className="sr-only">{t('foundations.loss')}</span>
            {formatMoney(-189, language, 'USD', { signed: true })}
          </span>
        </div>
      </div>
    </section>
  );
}
