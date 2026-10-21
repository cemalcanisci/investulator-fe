import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';

export function ResearchLongTerm({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element | null {
  const { t } = useTranslation();
  if (!report.longTerm) {
    return null;
  }
  const prefix = `${report.contentKey}.longTerm`;
  return (
    <section
      id="long-term"
      aria-labelledby="long-term-title"
      className="scroll-mt-36 space-y-4"
    >
      <div className="rounded-xl border-l-4 border-primary bg-primary-soft p-5 sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          {t('research.longTerm.horizon', {
            from: report.longTerm.horizonYears[0],
            to: report.longTerm.horizonYears[1],
          })}
        </p>
        <h3 id="long-term-title" className="mt-2 text-xl font-semibold">
          {t('research.longTerm.title')}
        </h3>
        <p className="mt-3 font-semibold">{t(`${prefix}.verdict`)}</p>
        <p className="mt-3 text-sm leading-7">{t(`${prefix}.assessment`)}</p>
        <p className="mt-3 text-xs leading-6 text-fg-2">
          {t(`${prefix}.confidence`)}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {['durability', 'income', 'entry'].map((key) => (
          <article
            key={key}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <h4 className="font-semibold">{t(`research.longTerm.${key}`)}</h4>
            <p className="mt-2 text-sm leading-7 text-fg-2">
              {t(`${prefix}.${key}`)}
            </p>
          </article>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {['payout', 'allocation', 'realReturn', 'fit'].map((key) => (
          <article
            key={key}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <h4 className="font-semibold">{t(`research.longTerm.${key}`)}</h4>
            <p className="mt-3 text-sm leading-7 text-fg-2">
              {t(`${prefix}.${key}`)}
            </p>
          </article>
        ))}
      </div>
      <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
        <h3 className="text-lg font-semibold">
          {t('research.longTerm.opportunities')}
        </h3>
        <p className="mt-2 text-sm leading-7 text-fg-2">
          {t(`${prefix}.growthIntro`)}
        </p>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {report.longTerm.opportunityKeys.map((key) => (
            <article key={key} className="min-w-0 rounded-xl bg-surface-2 p-4">
              <h4 className="font-semibold text-primary">
                {t(`${prefix}.opportunities.${key}.title`)}
              </h4>
              <dl className="mt-4 space-y-4 text-sm leading-7">
                {['evidence', 'upside', 'proof', 'risk'].map((field) => (
                  <div key={field}>
                    <dt className="font-semibold">
                      {t(`research.longTerm.${field}`)}
                    </dt>
                    <dd className="mt-1 text-fg-2">
                      {t(`${prefix}.opportunities.${key}.${field}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
        <p className="mt-4 rounded-lg bg-info-soft p-4 text-sm leading-7">
          {t(`${prefix}.pricing`)}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-line bg-pos-soft p-5">
          <h3 className="font-semibold">{t('research.longTerm.confirm')}</h3>
          <p className="mt-3 text-sm leading-7">{t(`${prefix}.confirm`)}</p>
        </article>
        <article className="rounded-xl border border-line bg-warn-soft p-5">
          <h3 className="font-semibold">{t('research.longTerm.invalidate')}</h3>
          <p className="mt-3 text-sm leading-7">{t(`${prefix}.invalidate`)}</p>
        </article>
      </div>
      <details className="rounded-xl border border-line bg-surface p-5">
        <summary className="cursor-pointer font-semibold text-primary">
          {t('research.longTerm.monitor')}
        </summary>
        <ul className="mt-4 space-y-3 text-sm leading-7">
          {['quarter', 'year', 'event', 'missing'].map((key) => (
            <li key={key}>{t(`${prefix}.monitor.${key}`)}</li>
          ))}
        </ul>
      </details>
      <div className="flex flex-wrap gap-3 text-xs">
        {report.sources
          .filter((source) => report.longTerm?.sourceIds.includes(source.id))
          .map((source) => (
            <a
              key={source.id}
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              {source.title} ↗
            </a>
          ))}
      </div>
    </section>
  );
}
