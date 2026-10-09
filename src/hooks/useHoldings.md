# useHoldings

Kullanıcının tüm pozisyonlarını (varlık başına adet, ortalama maliyet, güncel fiyat/değer, kâr/zarar) ve fiyatların son güncellenme zamanını yükler. Yatırımlarım sayfası bunu kullanır.

## API

```ts
const holdings = useHoldings(); // UseQueryResult<HoldingsResponse>
```

`HoldingsResponse` = `{ holdings: Holding[]; pricesUpdatedAt: string }`. `Holding` tipi `src/domain/holding.ts`'te: para/adet alanları **string**, fiyatı alınamayan varlıkta `currentPricePerUnit`, `value`, `pnl`, `pnlPercent` `null` olur (`priceStatus: 'UNAVAILABLE'`).

Sorgu anahtarı `HOLDINGS_QUERY_KEY` (`['holdings']`). Fiyat güncelleme düğmesi (`PriceStatus`) bunu ve `DASHBOARD_QUERY_KEY`'i birlikte yeniler.

## Ne yapar?

`src/services/holdings.ts`'teki `fetchHoldings()`'i çağırır. Servis şu an **sahte veri** döner; Dashboard ile aynı uydurma portföyden (`mockPortfolio.ts`) beslenir, bu yüzden iki sayfa hep aynı toplamları gösterir. Gerçek uç nokta gelince yalnızca servis dosyası değişir.

Filtreleme, sıralama ve toplamlar saf fonksiyonlardır (`src/lib/holdingsView.ts`), hook'ta değildir.

## Örnek

```tsx
const holdings = useHoldings();

if (holdings.isPending) {
  return <HoldingsSkeleton />;
}
if (holdings.isError) {
  return <ErrorState onRetry={() => void holdings.refetch()} />;
}
const visible = sortHoldings(holdings.data.holdings, 'VALUE', 'tr');
```
