import type { ReactElement } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render as renderRaw, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RiWalletLine } from '@remixicon/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { HoldingsSkeleton } from '@/components/Holdings/HoldingsSkeleton';
import { HoldingsSummary } from '@/components/Holdings/HoldingsSummary';
import { HoldingsTable } from '@/components/Holdings/HoldingsTable';
import { HoldingsToolbar } from '@/components/Holdings/HoldingsToolbar';
import { PriceBadge } from '@/components/Holdings/PriceBadge';
import { SortSelect } from '@/components/Holdings/SortSelect';
import { TypeFilterChips } from '@/components/Holdings/TypeFilterChips';
import { Quantity } from '@/components/Quantity/Quantity';
import { i18n } from '@/i18n';
import { countByType, defaultOrder, totalsOf } from '@/lib/holdingsView';
import { HOLDINGS } from '@/services/mockPortfolio';
import { UNAVAILABLE_HOLDING } from '@/__tests__/utils/fixtures';

function render(ui: ReactElement): ReturnType<typeof renderRaw> {
  return renderRaw(ui, { wrapper: MemoryRouter });
}

describe('Quantity', () => {
  it('shows gram gold in grams and coins in pieces', () => {
    const { container, rerender } = render(
      <Quantity quantity="200" unit="GRAM" />,
    );
    expect(container).toHaveTextContent('200 gr');

    rerender(<Quantity quantity="24" unit="PIECE" />);
    expect(container).toHaveTextContent('24 adet');
  });

  it('uses the locale separators and keeps the decimals', () => {
    const { container } = render(<Quantity quantity="0.0500" unit={null} />);

    expect(container).toHaveTextContent('0,0500');
  });

  it('shows a dash when there is no quantity', () => {
    const { container } = render(<Quantity quantity={null} unit={null} />);

    expect(container).toHaveTextContent('—');
  });

  it('follows the interface language', async () => {
    await i18n.changeLanguage('en');
    const { container } = render(<Quantity quantity="24.5" unit="PIECE" />);

    expect(container).toHaveTextContent('24.5 pcs');
  });
});

describe('PriceBadge', () => {
  it('shows nothing for a current price', () => {
    const { container } = render(
      <PriceBadge status="FRESH" updatedAt="2026-09-21T11:05:00.000Z" />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('warns about an old price and tells when it was taken', () => {
    render(<PriceBadge status="STALE" updatedAt="2026-09-21T09:05:00.000Z" />);

    expect(screen.getByText(i18n.t('holdings.price.STALE'))).toHaveAttribute(
      'title',
      expect.stringContaining('Son fiyat:'),
    );
  });

  it('warns about a missing price', () => {
    render(<PriceBadge status="UNAVAILABLE" updatedAt={null} />);

    expect(
      screen.getByText(i18n.t('holdings.price.UNAVAILABLE')),
    ).toHaveAttribute('title', i18n.t('holdings.price.unavailableHint'));
  });

  it('falls back to the generic hint when an old price has no time', () => {
    render(<PriceBadge status="STALE" updatedAt={null} />);

    expect(screen.getByText(i18n.t('holdings.price.STALE'))).toHaveAttribute(
      'title',
      i18n.t('holdings.price.unavailableHint'),
    );
  });
});

describe('TypeFilterChips', () => {
  it('shows every type with its count and marks the chosen one', () => {
    render(
      <TypeFilterChips
        value="GOLD"
        counts={countByType(HOLDINGS)}
        onChange={vi.fn<() => void>()}
      />,
    );

    expect(
      screen.getByRole('group', { name: i18n.t('holdings.filter.label') }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Altın/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: /Tümü/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: /Tümü/ })).toHaveTextContent(
      '14',
    );
  });

  it('reports the chosen type', async () => {
    const onChange = vi.fn<(value: string) => void>();
    render(
      <TypeFilterChips
        value="ALL"
        counts={countByType(HOLDINGS)}
        onChange={onChange}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /Kripto/ }));

    expect(onChange).toHaveBeenCalledWith('CRYPTO');
  });
});

describe('SortSelect', () => {
  it('offers every sort order and reports the chosen one', async () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<SortSelect value="VALUE" onChange={onChange} />);

    expect(screen.getAllByRole('option')).toHaveLength(4);
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /Sırala/ }),
      'NAME',
    );

    expect(onChange).toHaveBeenCalledWith('NAME');
  });

  it('ignores a value that is not a sort order', () => {
    const onChange = vi.fn<(value: string) => void>();
    render(<SortSelect value="VALUE" onChange={onChange} />);

    fireEvent.change(screen.getByRole('combobox', { name: /Sırala/ }), {
      target: { value: 'BOGUS' },
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('HoldingsToolbar', () => {
  it('reports what the user types in the search box', async () => {
    const onQueryChange = vi.fn<(value: string) => void>();
    render(
      <HoldingsToolbar
        type="ALL"
        query=""
        sort="VALUE"
        counts={countByType(HOLDINGS)}
        onTypeChange={vi.fn<() => void>()}
        onQueryChange={onQueryChange}
        onSortChange={vi.fn<() => void>()}
      />,
    );

    await userEvent.type(
      screen.getByRole('textbox', { name: i18n.t('holdings.search.label') }),
      'a',
    );

    expect(onQueryChange).toHaveBeenCalledWith('a');
  });
});

describe('HoldingsSummary', () => {
  it('shows the total value, the total cost and the total profit or loss', () => {
    const { container } = render(
      <HoldingsSummary totals={totalsOf(HOLDINGS)} />,
    );

    expect(container).toHaveTextContent('$124.580,42');
    expect(container).toHaveTextContent('$114.742,00');
    expect(container).toHaveTextContent('+$9.838,42');
    expect(container).toHaveTextContent('+%8,6');
    expect(screen.queryByText(/fiyatı alınamadı/)).not.toBeInTheDocument();
  });

  it('says how many holdings are missing from the totals', () => {
    render(
      <HoldingsSummary totals={totalsOf([...HOLDINGS, UNAVAILABLE_HOLDING])} />,
    );

    expect(
      screen.getByText('1 yatırımın fiyatı alınamadı; toplamlara dahil değil.'),
    ).toBeInTheDocument();
  });
});

describe('HoldingsTable', () => {
  const totals = totalsOf(HOLDINGS);

  it('lists every holding in an accessible table with a total row', () => {
    render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    const table = screen.getByRole('table', {
      name: i18n.t('holdings.table.caption'),
    });
    expect(table).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(16);
    expect(screen.getAllByText(i18n.t('holdings.table.total'))).toHaveLength(2);
    expect(
      screen.getByRole('columnheader', {
        name: i18n.t('holdings.table.weight'),
      }),
    ).toBeInTheDocument();
  });

  it('shows gold products in grams or pieces and currency rates with four decimals', () => {
    render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    expect(screen.getAllByText('200 gr')).toHaveLength(2);
    expect(screen.getAllByText('24 adet')).toHaveLength(2);
    expect(screen.getAllByText('$1,0750').length).toBeGreaterThan(0);
  });

  it('marks the old price', () => {
    render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    expect(screen.getAllByText(i18n.t('holdings.price.STALE'))).toHaveLength(2);
  });

  it('shows dashes when the price is unavailable', () => {
    const list = [...HOLDINGS, UNAVAILABLE_HOLDING];
    render(
      <HoldingsTable
        holdings={list}
        totals={totalsOf(list)}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    expect(
      screen.getAllByText(i18n.t('holdings.price.UNAVAILABLE')),
    ).toHaveLength(2);
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(4);
  });

  it('sorts by the column header that was clicked', async () => {
    const onSort = vi.fn<(sort: string) => void>();
    render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={onSort}
      />,
    );

    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('holdings.table.asset') }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: i18n.t('holdings.table.pnl') }),
    );
    await userEvent.click(
      screen.getByRole('button', {
        name: i18n.t('holdings.table.pnlPercentSort'),
      }),
    );

    expect(onSort.mock.calls).toEqual([['NAME'], ['PNL'], ['PNL_PERCENT']]);
  });

  it('tells assistive technology which column is sorted and in which direction', () => {
    const { rerender } = render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={{ sort: 'VALUE', direction: 'desc' }}
        onSort={vi.fn<() => void>()}
      />,
    );
    const header = (key: string): HTMLElement =>
      screen.getByRole('columnheader', { name: new RegExp(key) });

    expect(header(i18n.t('holdings.table.value'))).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(header(i18n.t('holdings.table.asset'))).toHaveAttribute(
      'aria-sort',
      'none',
    );

    rerender(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={{ sort: 'NAME', direction: 'asc' }}
        onSort={vi.fn<() => void>()}
      />,
    );

    expect(header(i18n.t('holdings.table.asset'))).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
  });

  it('does not offer sorting on columns that cannot be compared', () => {
    render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    for (const column of ['quantity', 'avgCost', 'price']) {
      expect(
        screen.getByRole('columnheader', {
          name: i18n.t(`holdings.table.${column}`),
        }),
      ).not.toHaveAttribute('aria-sort');
    }
  });

  it('shows the losses in the negative tone', () => {
    const { container } = render(
      <HoldingsTable
        holdings={HOLDINGS}
        totals={totals}
        portfolioValue={totals.value}
        order={defaultOrder('VALUE')}
        onSort={vi.fn<() => void>()}
      />,
    );

    expect(container.querySelectorAll('.text-neg').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.text-pos').length).toBeGreaterThan(0);
  });
});

describe('EmptyState', () => {
  it('shows the message and the actions', () => {
    render(
      <EmptyState
        icon={RiWalletLine}
        title="Boş"
        description="Açıklama"
        actions={<button type="button">Ekle</button>}
      />,
    );

    expect(screen.getByText('Boş')).toBeInTheDocument();
    expect(screen.getByText('Açıklama')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ekle' })).toBeInTheDocument();
  });

  it('works without actions', () => {
    render(
      <EmptyState icon={RiWalletLine} title="Boş" description="Açıklama" />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('HoldingsSkeleton', () => {
  it('announces that content is loading', () => {
    render(<HoldingsSkeleton />);

    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });
});
