# useTransactionActions

İşlem ekleme, düzenleme, iptal ve iptali kaldırma. Dördü de bir `useMutation` sonucudur; başarılı olunca işlem listesini ve Dashboard'daki "Son işlemler"i yeniler.

## API

```ts
const { create, update, cancel, restore } = useTransactionActions();

create.mutate(input); // TransactionInput
update.mutate({ id, input });
cancel.mutate({ id, reason: 'Yanlış girdim' }); // neden opsiyonel: null
restore.mutate(id);
```

## Reddedilme

Servis, kuralı çiğneyen değişikliği `TransactionRuleError` ile **reddeder** (bir işlemi eklemek/düzenlemek/iptal etmek ya da iptali kaldırmak, pozisyonu herhangi bir tarihte negatife düşürecekse). Hata `assetName`, `date` (pozisyonun ilk negatif olduğu gün) ve `shortBy` (eksik miktar) taşır; arayüz bunu kullanıcıya nedeniyle gösterir:

```tsx
cancel.mutate(
  { id, reason: null },
  {
    onError: (error) => {
      if (error instanceof TransactionRuleError) {
        showReason(error.assetName, error.date, error.shortBy);
      }
    },
  },
);
```

Mock servis bellekte çalıştığı için **Yatırımlarım ve Dashboard toplamları güncellenmez** (pozisyon hesabı backend'in işi); yalnızca liste ve "Son işlemler" değişir.
