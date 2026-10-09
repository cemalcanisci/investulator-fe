import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AssetTypeBadge } from '@/components/AssetTypeBadge/AssetTypeBadge';
import { Card } from '@/components/Card/Card';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { KpiCard } from '@/components/KpiCard/KpiCard';
import { PnlValue } from '@/components/Pnl/PnlValue';
import { Sparkline } from '@/components/Pnl/Sparkline';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { i18n } from '@/i18n';

describe('PnlValue', () => {
  it('shows a profit with an up arrow, a plus sign and a text label', () => {
    const { container } = render(<PnlValue amount="1140.20" percent="6.5" />);

    expect(container).toHaveTextContent(i18n.t('pnl.positive'));
    expect(container).toHaveTextContent('+$1.140,20');
    expect(container).toHaveTextContent('(+%6,5)');
    expect(container.querySelector('svg')).not.toBeNull();
    expect(container.firstElementChild).toHaveClass('text-pos');
  });

  it('shows a loss with the negative tone', () => {
    const { container } = render(<PnlValue amount="-189.00" percent="-7.1" />);

    expect(container).toHaveTextContent(i18n.t('pnl.negative'));
    expect(container).toHaveTextContent('189,00');
    expect(container.firstElementChild).toHaveClass('text-neg');
  });

  it('shows only the percentage when no amount is given', () => {
    const { container } = render(<PnlValue percent="13.4" />);

    expect(container).toHaveTextContent('+%13,4');
    expect(container).not.toHaveTextContent('(');
  });

  it('is neutral for zero', () => {
    const { container } = render(<PnlValue amount="0.00" />);

    expect(container).toHaveTextContent(i18n.t('pnl.zero'));
    expect(container.firstElementChild).toHaveClass('text-fg-2');
    expect(container.querySelector('svg')).toBeNull();
  });

  it('defaults to a neutral value when nothing is given', () => {
    const { container } = render(<PnlValue />);

    expect(container.firstElementChild).toHaveClass('text-fg-2');
  });
});

describe('Sparkline', () => {
  it('draws the trend with the tone color', () => {
    const { container, rerender } = render(
      <Sparkline values={['1', '3', '2']} tone="positive" />,
    );
    expect(container.querySelector('polyline')).toHaveAttribute(
      'stroke',
      'var(--pos)',
    );

    rerender(<Sparkline values={['1', '3', '2']} tone="negative" />);
    expect(container.querySelector('polyline')).toHaveAttribute(
      'stroke',
      'var(--neg)',
    );
  });
});

describe('KpiCard', () => {
  it('renders the label, the value and an optional footer', () => {
    render(
      <KpiCard label="Toplam" value="$10" footer={<span>alt bilgi</span>} />,
    );

    expect(screen.getByText('Toplam')).toBeInTheDocument();
    expect(screen.getByText('$10')).toHaveClass('text-2xl');
    expect(screen.getByText('alt bilgi')).toBeInTheDocument();
  });

  it('makes the hero figure larger and omits an absent footer', () => {
    const { container } = render(<KpiCard hero label="Toplam" value="$10" />);

    expect(screen.getByText('$10')).toHaveClass('text-4xl');
    expect(container.querySelectorAll('section > div')).toHaveLength(0);
  });
});

describe('AssetTypeBadge', () => {
  it('shows the translated asset type', () => {
    render(<AssetTypeBadge assetType="GOLD" />);

    expect(screen.getByText(i18n.t('assetTypes.GOLD'))).toBeInTheDocument();
  });
});

describe('Card and Skeleton', () => {
  it('wraps its children and accepts extra classes', () => {
    render(<Card className="p-5">icerik</Card>);

    expect(screen.getByText('icerik')).toHaveClass('p-5', 'bg-surface');
  });

  it('renders a decorative placeholder', () => {
    const { container } = render(<Skeleton className="h-4" />);

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).toHaveClass('h-4');
  });
});

describe('ErrorState', () => {
  it('announces the failure and lets the user retry', async () => {
    const onRetry = vi.fn<() => void>();
    render(<ErrorState onRetry={onRetry} />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      i18n.t('common.loadError'),
    );
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('common.retryButton') }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
