import type { JSX } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { CompanyMatrixEntry } from '@/lib/companyMatrix';
import { Card } from '@/components/Card/Card';
import { researchPath } from '@/app/routePaths';

function CompanyLink({
  entry,
}: {
  readonly entry: CompanyMatrixEntry;
}): JSX.Element {
  return (
    <Link
      to={researchPath(entry.assetId)}
      className="text-primary underline underline-offset-2"
    >
      {entry.symbol}
    </Link>
  );
}

export function ReliabilitySummary({
  entries,
}: {
  readonly entries: readonly CompanyMatrixEntry[];
}): JSX.Element {
  const { t } = useTranslation();
  const blocked = entries.filter(
    (entry) => entry.reliability.valuationAvailability === 'NONE',
  );
  const needsReview = entries.filter(
    (entry) => entry.reliability.valuationAvailability === 'BLOCKED',
  );
  const withMissing = entries.filter(
    (entry) => entry.assessment.missing.length > 0,
  );
  return (
    <Card className="space-y-4 p-5">
      <h3 className="text-lg font-semibold">
        {t('companyComparison.closing.title')}
      </h3>
      {blocked.length > 0 && (
        <div>
          <h4 className="font-medium">
            {t('companyComparison.closing.blockedHeading')}
          </h4>
          <p className="mt-1 flex flex-wrap gap-2 text-sm">
            {blocked.map((entry) => (
              <CompanyLink key={entry.assetId} entry={entry} />
            ))}
          </p>
        </div>
      )}
      {needsReview.length > 0 && (
        <div>
          <h4 className="font-medium">
            {t('companyComparison.closing.needsReviewHeading')}
          </h4>
          <p className="mt-1 flex flex-wrap gap-2 text-sm">
            {needsReview.map((entry) => (
              <CompanyLink key={entry.assetId} entry={entry} />
            ))}
          </p>
        </div>
      )}
      {withMissing.length > 0 && (
        <div>
          <h4 className="font-medium">
            {t('companyComparison.closing.missingHeading')}
          </h4>
          <ul className="mt-1 space-y-2 text-sm">
            {withMissing.map((entry) => (
              <li key={entry.assetId}>
                <CompanyLink entry={entry} />
                {': '}
                {entry.assessment.missing
                  .map((id) =>
                    t(`ratios.missing.${id}`, {
                      defaultValue: t(`research.metrics.${id}`, {
                        defaultValue: id,
                      }),
                    }),
                  )
                  .join(' · ')}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-fg-2">
        {t('companyComparison.intro.sourceNote')}
      </p>
    </Card>
  );
}
