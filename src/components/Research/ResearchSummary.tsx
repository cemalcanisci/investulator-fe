import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { ResearchMetric } from './ResearchMetric';

export function ResearchSummary({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t } = useTranslation();
  const prefix = `${report.contentKey}.guide`;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border-l-4 border-primary bg-primary-soft p-5 sm:p-6">
        <p className="text-sm font-medium text-primary">
          {t('research.guide.question')}
        </p>
        <h3 className="mt-2 text-xl font-semibold">{t(`${prefix}.verdict`)}</h3>
        <p className="mt-3 text-sm leading-7">{t(`${prefix}.reason`)}</p>
        <a
          href="#valuation"
          className="mt-3 inline-block text-sm font-medium text-primary underline"
        >
          {t('research.guide.jump')}
        </a>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {['business', 'price', 'decision'].map((key) => (
          <article
            key={key}
            className="rounded-xl border border-line bg-surface p-5"
          >
            <h3 className="font-semibold">{t(`research.guide.${key}`)}</h3>
            <p className="mt-3 text-sm leading-7 text-fg-2">
              {t(`${prefix}.${key}`)}
            </p>
          </article>
        ))}
      </div>
      <section
        className="rounded-xl border border-line bg-surface p-5 sm:p-6"
        aria-label={t('research.guide.companyTitle')}
      >
        <h3 className="text-lg font-semibold">
          {t('research.guide.companyTitle')}
        </h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(['activity', 'ownership', 'political', 'exposure'] as const).map(
            (key) => (
              <article key={key} className="rounded-lg bg-surface-2 p-4">
                <h4 className="font-semibold">{t(`research.guide.${key}`)}</h4>
                <p className="mt-2 text-sm leading-7 text-fg-2">
                  {t(`${report.contentKey}.company.${key}`)}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  {report.sources
                    .filter((source) =>
                      (key === 'activity'
                        ? ['business']
                        : key === 'exposure'
                          ? ['annualRisks']
                          : ['ownership', 'shareSale']
                      ).includes(source.id),
                    )
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
              </article>
            ),
          )}
        </div>
        <p className="mt-4 text-xs leading-6 text-fg-2">
          <strong>{t('research.guide.missingLabel')}: </strong>
          {t(`${report.contentKey}.company.limit`)}
        </p>
      </section>
    </div>
  );
}

export function ResearchValuationGuide({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('research.guide.results')}</h3>
      <div className="grid gap-3 lg:grid-cols-3">
        {['priceBook', 'peHalfYear', 'peRunRate'].map((id) => (
          <ResearchMetric key={id} report={report} id={id} explain />
        ))}
      </div>
      <div className="rounded-xl border border-line bg-warn-soft p-5">
        <h3 className="font-semibold">{t('research.guide.missingTitle')}</h3>
        <p className="mt-3 text-sm leading-7">
          {t(`${report.contentKey}.guide.missingIntro`)}
        </p>
        <ul className="mt-4 space-y-3">
          {['earnings', 'benchmark', 'cashflow'].map((key) => (
            <li
              key={key}
              className="rounded-lg bg-surface p-4 text-sm leading-7"
            >
              {t(`${report.contentKey}.guide.missing.${key}`)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm font-medium leading-7">
          {t(`${report.contentKey}.guide.next`)}
        </p>
      </div>
    </div>
  );
}
