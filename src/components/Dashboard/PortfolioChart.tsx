import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/Card/Card';
import { ChartTooltip } from '@/components/Dashboard/ChartTooltip';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Segmented } from '@/components/ui/Segmented';
import { useLanguage } from '@/hooks/useLanguage';
import { useMoney } from '@/hooks/useMoney';
import { usePortfolioSeries } from '@/hooks/usePortfolioSeries';
import { toChartPoints } from '@/lib/chartData';
import { formatAxisDate, formatDate } from '@/lib/formatDate';
import { PORTFOLIO_RANGES, type PortfolioRange } from '@/services/dashboard';

const CHART_HEIGHT = 280;
const TICK = { fill: 'var(--text-2)', fontSize: 12 };
const LONG_RANGES: readonly PortfolioRange[] = ['1Y', 'ALL'];
// TL figures are longer than USD ones (millions), so the axis labels need more room.
const AXIS_WIDTH = { USD: 72, TRY: 96 } as const;

export function PortfolioChart(): JSX.Element {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [range, setRange] = useState<PortfolioRange>('1M');
  const money = useMoney();
  const series = usePortfolioSeries(range);
  // Converted before charting, so the axis picks round ticks in the display currency.
  const data = series.data
    ? toChartPoints(series.data).map((point) => ({
        ...point,
        value: money.convert(point.value),
        cost: money.convert(point.cost),
      }))
    : [];
  const last = data.at(-1);
  const seriesLabels = {
    value: t('dashboard.portfolioChart.valueSeries'),
    cost: t('dashboard.portfolioChart.costSeries'),
  };

  function renderBody(): JSX.Element {
    if (series.isPending) {
      // A literal class: Tailwind only generates classes it can find as complete strings.
      return <Skeleton className="h-[280px]" />;
    }
    if (series.isError || last === undefined) {
      return <ErrorState onRetry={() => void series.refetch()} />;
    }
    return (
      <>
        <ul className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          <li className="inline-flex items-center gap-2">
            <span
              className="h-0.5 w-4 rounded-full"
              style={{ backgroundColor: 'var(--chart-1)' }}
              aria-hidden="true"
            />
            <span className="text-fg-2">{seriesLabels.value}</span>
            <span className="font-medium tabular-nums">
              {money.formatConverted(last.value)}
            </span>
          </li>
          <li className="inline-flex items-center gap-2">
            <span
              className="h-0.5 w-4 rounded-full"
              style={{ backgroundColor: 'var(--text-3)' }}
              aria-hidden="true"
            />
            <span className="text-fg-2">{seriesLabels.cost}</span>
            <span className="font-medium tabular-nums">
              {money.formatConverted(last.cost)}
            </span>
          </li>
        </ul>
        <div style={{ height: CHART_HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 12, bottom: 0, left: 0 }}
            >
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) =>
                  formatAxisDate(date, language, LONG_RANGES.includes(range))
                }
                tickLine={false}
                axisLine={false}
                tick={TICK}
                minTickGap={28}
              />
              <YAxis
                tickFormatter={(value: number) => money.formatWhole(value)}
                tickLine={false}
                axisLine={false}
                tick={TICK}
                width={AXIS_WIDTH[money.currency]}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={<ChartTooltip seriesLabels={seriesLabels} />}
                cursor={{ stroke: 'var(--border-strong)' }}
              />
              <Line
                dataKey="cost"
                stroke="var(--text-3)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <ReferenceDot
                x={last.date}
                y={last.value}
                r={5}
                fill="var(--chart-1)"
                stroke="var(--surface)"
                strokeWidth={2}
                ifOverflow="visible"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <table className="sr-only">
          <caption>
            {t('dashboard.portfolioChart.tableCaption', {
              currency: money.currency,
            })}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t('dashboard.portfolioChart.dateColumn')}</th>
              <th scope="col">{seriesLabels.value}</th>
              <th scope="col">{seriesLabels.cost}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.date}>
                <td>{formatDate(point.date, language)}</td>
                <td>{money.formatConverted(point.value)}</td>
                <td>{money.formatConverted(point.cost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">
          {t('dashboard.portfolioChart.title')}
        </h2>
        <Segmented
          options={PORTFOLIO_RANGES.map((value) => ({
            value,
            label: t(`dashboard.ranges.${value}`),
          }))}
          value={range}
          onChange={setRange}
          aria-label={t('dashboard.portfolioChart.rangeLabel')}
        />
      </div>
      <figure
        className="m-0"
        aria-label={t('dashboard.portfolioChart.aria', {
          currency: money.currency,
        })}
      >
        {renderBody()}
      </figure>
    </Card>
  );
}
