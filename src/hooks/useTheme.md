# useTheme

Aktif temayı okur ve değiştirir. Üç tema vardır: `default` (marka), `light` (açık), `dark` (koyu).

## API

```ts
const { theme, setTheme } = useTheme();
```

| Alan             | Tip                              | Açıklama                                                                      |
| ---------------- | -------------------------------- | ----------------------------------------------------------------------------- |
| `theme`          | `'default' \| 'light' \| 'dark'` | Aktif tema                                                                    |
| `setTheme(name)` | `(ThemeName) => void`            | Temayı değiştirir, `<html>`'e uygular ve `localStorage`'a (`inv-theme`) yazar |

`ThemeProvider` (`AppProviders` içinde kurulu) dışında çağrılırsa hata fırlatır.

## Ne yapar?

Tema seçilince tüm token'lar CSS değişkeni olarak `<html>`'e yazılır (`data-theme` özniteliği ve `color-scheme` ile birlikte). Tailwind sınıfları (`bg-surface`, `text-fg-2`, `text-pos`…) bu değişkenleri okuduğu için ayrıca bir şey yapmak gerekmez. antd teması `AppProviders` içinde aynı token'lardan üretilir.

## Örnek

```tsx
import { useTheme } from '@/hooks/useTheme';

function DarkModeButton(): JSX.Element {
  const { theme, setTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'default' : 'dark')}
    >
      {theme}
    </button>
  );
}
```

Hazır bir seçici için `ThemeSwitcher` bileşenini kullan.
