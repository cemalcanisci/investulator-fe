# useStrategies

Strateji snapshot'ını ve grup/takip üyeliği komutlarını React Query üzerinden yönetir.
`query` yüklenme, hata, veri ve tekrar denemeyi; `action` asenkron değişiklikleri sunar.
Başarılı komut yalnızca strateji önbelleğini günceller; portföy veya işlem sorgularına dokunmaz.
Bellek adaptörü sayfa yenilemesinde sıfırlanır; gerçek API gelince `strategyService` değiştirilir.

```tsx
const { query, action } = useStrategies();
action.mutate({ type: 'ADD_ASSET', groupId, assetId });
```
