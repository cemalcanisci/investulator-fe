import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import type { ResearchReport } from '@/domain/research';
import { formatQuantity } from '@/lib/formatNumber';
import { Card } from '@/components/Card/Card';
import { ResearchMetric } from '@/components/Research/ResearchMetric';

export function ResearchDebt({
  report,
}: {
  readonly report: ResearchReport;
}): JSX.Element {
  const { t, i18n } = useTranslation();
  const currencies = [
    ...new Set(report.debtLines.map((line) => line.currency)),
  ];
  return (
    <Card className="space-y-4 p-5">
      <h3 className="font-semibold">{t('research.debtTitle')}</h3>
      <p className="text-sm leading-7 text-fg-2">
        {t(`${report.contentKey}.debtMeaning`, {
          defaultValue: t('researchUx.interpretation.missing'),
        })}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ResearchMetric report={report} id="debtWithinYear" />
        <ResearchMetric report={report} id="debtLong" />
      </div>
      <h4 className="pt-2 text-sm font-semibold">
        {t('research.debtCurrencyTitle')}
      </h4>
      <p className="text-xs leading-relaxed text-fg-2">
        {t('research.debtCurrencyHint')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {currencies.map((currency) => {
          const lines = report.debtLines.filter(
            (line) => line.currency === currency,
          );
          return (
            <details
              key={currency}
              className="min-w-0 rounded-lg border border-line bg-surface-2 p-3 text-xs"
            >
              <summary className="cursor-pointer">
                <span className="font-semibold">{currency}</span>
                <span className="mt-2 block text-lg font-medium tabular-nums">
                  <span className="text-xs text-fg-2">
                    {t('analysis.unverifiedInputs')}
                  </span>
                </span>
              </summary>
              <ul className="mt-3 space-y-3">
                {lines.map((line, index) => (
                  <li
                    key={`${line.maturity}-${index}`}
                    className="break-words border-t border-line pt-2 leading-relaxed"
                  >
                    <p className="font-medium">
                      {t(`research.maturity.${line.maturity}`)}
                    </p>
                    <p>
                      {formatQuantity(line.originalAmount, i18n.language)}{' '}
                      {currency}
                    </p>
                    <p>
                      {formatQuantity(line.tryEquivalent, i18n.language)}{' '}
                      {t('research.units.TRY')}
                    </p>
                    <p>
                      {t('research.effectiveRate')}:{' '}
                      {formatQuantity(line.effectiveRate, i18n.language)}%
                    </p>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </div>
      <p className="text-sm leading-7 text-fg-2">
        {t(`${report.contentKey}.interestMeaning`, {
          defaultValue: t('researchUx.interpretation.missing'),
        })}
      </p>
      <h4 className="pt-2 text-sm font-semibold">{t('research.fxTitle')}</h4>
      <div className="grid gap-3 sm:grid-cols-2">
        <ResearchMetric report={report} id="fxBeforeNatural" />
        <ResearchMetric report={report} id="fxAfterNatural" />
      </div>
      <p className="text-sm leading-7 text-fg-2">
        {t(`${report.contentKey}.fxMeaning`, {
          defaultValue: t('researchUx.interpretation.missing'),
        })}
      </p>
      <p className="text-sm leading-7 text-fg-2">
        {t(`${report.contentKey}.cashRestrictions`, {
          defaultValue: t('researchUx.interpretation.missing'),
        })}
      </p>
      <a
        href={report.sources.find((source) => source.id === 'financials')?.url}
        target="_blank"
        rel="noreferrer"
        className="inline-block text-xs text-primary underline"
      >
        {t('research.debtSource')} ↗
      </a>
    </Card>
  );
}
