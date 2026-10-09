# useLanguage

Aktif arayüz dilini okur ve değiştirir. Desteklenen diller: `tr` (varsayılan) ve `en`.

## API

```ts
const { language, setLanguage } = useLanguage();
```

| Alan                | Tip                           | Açıklama                                                        |
| ------------------- | ----------------------------- | --------------------------------------------------------------- |
| `language`          | `'tr' \| 'en'`                | Aktif dil. i18next desteklenmeyen bir dil bildirirse `tr` döner |
| `setLanguage(code)` | `(SupportedLanguage) => void` | Dili değiştirir ve `localStorage`'a (`inv-lang`) yazar          |

## Ne yapar?

Dil değişince `react-i18next` bileşenleri yeniden çizer. `AppProviders` ayrıca `<html lang>` özniteliğini günceller ve antd'nin yerelleştirmesini (`tr_TR` / `en_US`) değiştirir.

Çeviriler için `useTranslation()`'dan `t` kullanılır; bu hook yalnızca dilin kendisini yönetir. Yeni metin hem `tr.json` hem `en.json`'a eklenmelidir (anahtarların aynı olduğunu bir test doğrular).

## Örnek

```tsx
import { useLanguage } from '@/hooks/useLanguage';

function LanguageToggle(): JSX.Element {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
    >
      {language}
    </button>
  );
}
```

Hazır bir seçici için `LanguageSwitcher` bileşenini kullan.
