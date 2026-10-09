# useAssetCatalog

İşlem formunun varlık arama kutusu için varlık kataloğunu yükler.

## API

```ts
const catalog = useAssetCatalog(); // UseQueryResult<readonly CatalogAsset[]>
```

`CatalogAsset`: `id`, `name`, `symbol`, `assetType`, `unit` (`GRAM` / `PIECE` / `null`) ve `priceCurrency` (varlığın normalde alınıp satıldığı para birimi; formda varsayılan olur). Altın **ürün bazlıdır**: gram, yarım, çeyrek, tam, Ata altını… her biri ayrı bir kayıttır ve birimi gram ya da adettir.

Sorgu anahtarı `CATALOG_QUERY_KEY`. Servis şu an sabit sahte bir liste döner (`src/services/mockCatalog.ts`); gerçekte katalog sağlayıcıda aranır ve varlık ilk kullanımda kataloğa eklenir.

## Örnek

```tsx
const catalog = useAssetCatalog();
const options = (catalog.data ?? []).map((asset) => ({
  value: asset.id,
  label: `${asset.name} (${asset.symbol})`,
}));
```
