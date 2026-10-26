import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';

export function ResearchDisclosures({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-warn-soft p-4 text-sm">
        <p className="font-medium text-warn">
          {t('research.scanRange')}: {report.disclosureScan.from} →{' '}
          {report.disclosureScan.to} ·{' '}
          {t(`research.status.${report.disclosureScan.status}`)}
        </p>
        <p className="mt-2 leading-relaxed text-fg-2">
          {t(`${report.contentKey}.scanLimit`, {
            defaultValue: t('researchUx.interpretation.missing'),
          })}
        </p>
        <a
          className="mt-2 inline-block text-primary underline"
          href={
            report.sources.find(
              (source) => source.id === report.disclosureScan.sourceId,
            )?.url
          }
          target="_blank"
          rel="noreferrer"
        >
          {t('research.kapList')} ↗
        </a>
      </div>
      {report.disclosures.map((disclosure) => (
        <article
          key={disclosure.id}
          className="rounded-xl border border-line bg-surface p-4 sm:p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-fg-2">
            <span>
              {disclosure.publishedAt.replace('T', ' ').replace('+03:00', '')} ·{' '}
              {report.timezone}
            </span>
            <span className="rounded-full bg-surface-2 px-2 py-1">
              {t(
                disclosure.contextOnly
                  ? 'research.contextOnly'
                  : `research.impact.${disclosure.impact}`,
              )}
            </span>
          </div>
          <h3 className="mt-3 font-semibold">
            {t(`${report.contentKey}.news.${disclosure.key}.title`)}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-fg-2">
            {t(`${report.contentKey}.news.${disclosure.key}.fact`)}
          </p>
          <div className="mt-3 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
            <span className="font-medium">
              {t('research.analystInterpretation')}:{' '}
            </span>
            {t(`${report.contentKey}.news.${disclosure.key}.effect`)}
          </div>
          <p className="mt-3 text-xs text-fg-2">
            {t('research.eventDate')}: {disclosure.eventDate} ·{' '}
            {t(
              disclosure.isUpdate
                ? 'research.updateNotice'
                : 'research.newNotice',
            )}{' '}
            ·{' '}
            {t(
              disclosure.isCorrection
                ? 'research.correction'
                : 'research.noCorrection',
            )}
          </p>
          {disclosure.previousDisclosureDate && (
            <p className="mt-1 text-xs text-fg-2">
              {t('research.previousNotice')}:{' '}
              {disclosure.previousDisclosureDate}
            </p>
          )}
          {disclosure.attachmentReview === 'PARTIAL' && (
            <p className="mt-1 text-xs text-warn">
              {t('research.attachmentsPartial')}
            </p>
          )}
          <a
            className="mt-3 inline-block text-sm text-primary underline"
            href={
              report.sources.find((source) => source.id === disclosure.sourceId)
                ?.url
            }
            target="_blank"
            rel="noreferrer"
          >
            KAP #{disclosure.id} ↗
          </a>
        </article>
      ))}
    </div>
  );
}
