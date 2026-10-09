# useTransactions

Kullanıcının tüm işlemlerini yükler (iptal edilenler dahil; filtreyi sayfa uygular). İşlemler sayfası ve işlem formu kullanır.

## API

```ts
const transactions = useTransactions(); // UseQueryResult<readonly Transaction[]>
```

Sorgu anahtarı `TRANSACTIONS_QUERY_KEY` (`['transactions']`). `Transaction` tipi `src/domain/transaction.ts`'te: adet, birim fiyat ve tutar **string**; tutar işlemin kendi para biriminde (`currency`), yanında işlem günü kuruyla saklanan USD karşılığı (`usdAmount`) ve kur bilgisi (`fxRateToUsd`, `fxRateSource`: `AUTO` / `MANUAL`) bulunur. `status` `ACTIVE` ya da `VOIDED`'dır (silme yok).

## Ne yapar?

`src/services/transactions.ts`'teki `fetchTransactions()`'i çağırır. Servis şu an **bellekte** yaşayan sahte bir defter döner: ekleme, düzenleme ve iptal listeyi gerçekten değiştirir (sayfa yenilenince başa döner) ve backend'in kuralını uygular (pozisyon hiçbir tarihte negatife düşemez). Gerçek uç nokta gelince yalnızca servis dosyası değişir.

Filtre, sıralama ve özet saf fonksiyonlardır (`src/lib/transactionsView.ts`), hook'ta değildir.

## Örnek

```tsx
const transactions = useTransactions();

if (transactions.isPending) {
  return <TransactionsSkeleton />;
}
if (transactions.isError) {
  return <ErrorState onRetry={() => void transactions.refetch()} />;
}
const visible = sortTransactions(
  filterTransactions(transactions.data, filter, 'tr', todayIso()),
  DEFAULT_TRANSACTION_ORDER,
);
```
