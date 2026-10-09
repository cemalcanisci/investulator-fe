# Hook'lar

Bileşene ait olmayan, ortak hook'lar burada durur. Her hook'un yanında aynı adla Türkçe bir `.md` bulunur; yeni hook eklerken veya davranışı değiştirirken bu dizini ve ilgili dokümanı güncelle.

| Hook                                                  | Ne yapar                                                                                               |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [`useTheme`](./useTheme.md)                           | Aktif temayı (`default` / `light` / `dark`) okur ve değiştirir                                         |
| [`useLanguage`](./useLanguage.md)                     | Aktif arayüz dilini (`tr` / `en`) okur ve değiştirir                                                   |
| [`useDashboardSummary`](./useDashboardSummary.md)     | Dashboard özet verisini yükler (KPI, dağılım, hareketler, son işlemler)                                |
| [`usePortfolioSeries`](./usePortfolioSeries.md)       | Seçilen aralık için portföy değeri/maliyeti zaman serisini yükler                                      |
| [`useCurrency`](./useCurrency.md)                     | Gösterim para birimini (`USD` / `TRY`) ve kuru okur, para birimini değiştirir                          |
| [`useMoney`](./useMoney.md)                           | USD tutarları seçili para birimine çevirip biçimlendirir (`format`, `formatUnit`, grafik yardımcıları) |
| [`useUsdTryRate`](./useUsdTryRate.md)                 | Güncel USD/TRY kurunu yükler                                                                           |
| [`useTransactions`](./useTransactions.md)             | Tüm işlemleri yükler (iptal edilenler dahil)                                                           |
| [`useTransactionActions`](./useTransactionActions.md) | İşlem ekle, düzenle, iptal et, iptali kaldır                                                           |
| [`useAssetCatalog`](./useAssetCatalog.md)             | İşlem formu için varlık kataloğunu yükler                                                              |
| [`useFxRateToUsd`](./useFxRateToUsd.md)               | Bir para biriminin belirli günkü USD kurunu getirir                                                    |
| [`useHoldings`](./useHoldings.md)                     | Tüm pozisyonları ve fiyatların son güncellenme zamanını yükler                                         |
