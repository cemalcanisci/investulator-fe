# CLAUDE.md

Bu dosya, `investulator-fe` üzerinde çalışırken Claude Code'a yol gösterir. Ürün ve domain kararları için önce kökteki [`../CLAUDE.md`](../CLAUDE.md)'yi oku (oradaki [`../AGENTS.md`](../AGENTS.md), Codex için). "Şu an nerede kalındığı" için önce kök [`../WORKLOG.md`](../WORKLOG.md) (genel durum), sonra bu klasördeki [`WORKLOG.md`](WORKLOG.md) (frontend'e özel ayrıntı) — oturum biterken ikisi de güncellenir. Kurallar `aselsan-safi-fe` projesinden **seçilerek** taşındı; işe özel parçalar (Jira/GitLab commitlint, runtime `config.json`, bildirim/şirket seçici, test ekibi için `data-test-id`) bilerek alınmadı.

## Proje durumu

React + TypeScript + Vite iskeleti hazır: sağlayıcılar (`AppProviders`), **tema altyapısı** (3 tema, `ThemeProvider`, token'lar), i18n (Türkçe + İngilizce), `logger`, **uygulama kabuğu** (`AppShell`), **Sayfa 1: Dashboard** (`/`) ve **Sayfa 2: Yatırımlarım** (`/yatirimlar`, onaylandı) ve **Sayfa 3: İşlemler** (`/islemler`, onaylandı), **Sayfa 4: Varlık Detayı** (`/yatirimlar/:assetId`, onaylandı), **Sayfa 5: Analiz** (`/analiz`, onaylandı) ve **Sayfa 6: İçe/Dışa aktar** (`/aktar`, onaylandı). **Sayfa 7: Ayarlar** (`/ayarlar`, yalnızca platform yönetimi kapsamıyla) kodlanıp gösterildi ama kullanıcı gerçek bir ihtiyaç görmedi (Platform alanı zaten geçmiş işlemlerden otomatik öneri çıkarıyor) ve **tamamen kaldırıldı** — rota, nav öğesi, `SettingsPage`, `mockPlatforms` servisi, `usePlatforms`/`usePlatformActions` hook'ları ve ilgili testler silindi; "Profil/ayarlar" ihtiyacı Keycloak entegrasyonuyla gerçek bir kullanıcı profili doğunca yeniden değerlendirilecek. Sayfa sayfa tasarım turu artık bitti; yeni öncelik **Stratejiler ve Takip Listesi** (`/stratejiler`); Keycloak kullanıcı kararıyla ertelendi. Diğer bölümler için ayrı bir `ComingSoonPage` rotası kalmadı; yeni sayfa ihtiyacı olursa sırası gelince tasarlanıp eklenir, kullanıcı `npm run dev` ile bakıp yorum yapar. `/temel` tasarım temeli (renk token'ları, tipografi) sayfasıdır. Figma kullanılmıyor. Token'ların tek kaynağı `src/theme/tokens.ts`'tir (elle düzenlenir; `../design/` klasörü arşivdir, hiçbir şey ona bağlı değil). Veri **sahte**: `src/services/dashboard.ts` ve `holdings.ts` sabit, uydurma veri döner (para/adet JSON string); ikisi de tek portföyden (`mockPortfolio.ts`) beslenir, toplamlar birbirini tutar (test korur); gerçek backend gelince yalnızca servis dosyaları değişir. Henüz gerçek backend'e istek atan kod yok. Kimlik doğrulama **Keycloak** ile olacak (`keycloak-js`, PKCE, public client; bkz. kök `CLAUDE.md`); ilk kurulum Faz 1'de. Aselsan-safi-fe'deki `src/auth/*` yapısı (init promise'inin modül seviyesinde memoize edilmesi gibi) iyi bir referans, ama oradaki `config.json`/`login-required` akışı buraya olduğu gibi taşınmayacak. Oluşmamış bir konvansiyonu varsayma; aşağıdakiler dışında idiomatic React/TypeScript kullan.

## Strateji modülü sınırı

Ana dizindeki iki `INVESTULATOR_*.md` belgesi birlikte uygulanır; ayrıntılı kararlar `../STRATEJI_MVP_UYGULAMA_NOTLARI.md` içindedir. `/stratejiler` ekranı örnek başlangıç snapshot'ı ve ayrı oturum değişiklikleriyle çalışır; gerçek API/AI yoktur. `StrategyService` portföy/işlem servislerine yazmaz. Grup, varlık ve üyelik ayrıdır; üyelikler katalog ID'si üzerinden çoktan çoğa olabilir. Kullanıcı TUPRS araştırma detayını onayladı: `/takip/:assetId`, kaynaklı frontend snapshot ve salt okunur araştırma servisi. Bu ekranın değerlendirmesinden önce başka sayfaya geçilmez; Keycloak ertelenmiştir. Ayrıntı: `../TUPRS_ARASTIRMA_UYGULAMA_NOTLARI.md`.

## Komutlar

```bash
npm run dev           # Vite dev server (HMR), /api isteklerini backend'e (8081) proxy'ler; tasarım temeli: http://localhost:5173/temel
npm run build         # tip kontrolü (tsc -b) + production build
npm run preview       # production build'i yerelde önizle
npm run lint          # Oxlint
npm run format        # Prettier ile biçimlendir (dosyaları değiştirir)
npm run format:check  # biçim kontrolü (değiştirmez)
npm run test          # Vitest, tek seferlik
npm run test:watch    # Vitest, izleme modu
npm run test:coverage # coverage ile; herhangi bir metrik %80'in altındaysa başarısız olur
```

Tek test dosyası: `npx vitest run src/__tests__/App.test.tsx`.

Paket yöneticisi **npm** (`package-lock.json` commit'lenir); temiz kurulum için `npm ci`. Bilinen tuzak: bağımlılık listesini lock dosyası **olmadan** sıfırdan çözmek npm 11.3.0'da `Cannot read properties of null (reading 'edgesOut')` hatasıyla düşüyor (npm'in peer-dependency çözümleyicisindeki bir hata). Yeni bağımlılık eklerken mevcut `package-lock.json`'ı silme; hata yine çıkarsa npm'i güncelle.

## Geliştirme kuralları (zorunlu)

- **Yazım stili:** [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) tabandır; lint ile denetlenebilen alt kümesi Oxlint'te zorunlu (aşağıya bak). Bu dosyadaki kurallar ve Prettier/Oxlint yapılandırması çelişirse onlar kazanır.
- **Test zorunluluğu:** Yazılan her kod için test yaz. Asgari coverage **%80** (satır/ifade/dal/fonksiyon); `vite.config.ts`'te `test.coverage.thresholds` ile zorlanır.
- **i18n:** **Türkçe** (varsayılan) ve **İngilizce** desteklenir (`src/i18n/locales/tr.json`, `en.json`). İki dosyanın anahtarları birebir aynı olmalı (`src/__tests__/i18n/locales.test.ts` doğrular). Dil `useLanguage` hook'u ve `LanguageSwitcher` ile seçilir, `localStorage`'da (`inv-lang`) saklanır. Kullanıcıya görünen hiçbir metni JSX'e gömme, `t('...')` kullan; yeni metin her iki dosyaya birden eklenir.
- **Tema (3 tema: `light`, `dark`, `default`):** Renkler **asla** sabit yazılmaz (`bg-white`, `text-gray-600` gibi sabit renk sınıfları yasak; sayfalar `bg-surface`, `text-fg-2`, `text-primary`, `text-pos`… gibi anlamsal sınıfları kullanır). Anlamsal token'lar (yüzey, metin, kenarlık, birincil, kâr, zarar, grafik serileri…) her tema için CSS değişkeni olarak `<html data-theme="…">` altında tanımlanır ve Tailwind `@theme` ile kullanılır; antd teması (`light`/`default` → `defaultAlgorithm`, `dark` → `darkAlgorithm`, üstüne marka token'ları) aynı kaynaktan üretilir. Seçim `localStorage`'da saklanır. Grafik renkleri de temadan gelir. Kâr/zarar rengine ek olarak işaret/ikon kullan (renk körlüğü).
- **Tema altyapısı (kurulu):** `src/theme/tokens.ts` (kaynak; elle düzenlenir) → `themes.ts` (`getThemeTokens`, `ThemeName`, `TokenName`) → `ThemeProvider` seçili temanın tüm token'larını `<html>`'e CSS değişkeni olarak yazar (`data-theme` ve `color-scheme` ile; seçim `localStorage`'da `inv-theme`). `src/index.css`'teki `@theme inline` bu değişkenleri Tailwind sınıflarına eşler: `canvas`, `surface`, `surface-2`, `line`, `line-strong`, `fg`, `fg-2`, `fg-3`, `primary` (`-hover`, `-soft`), `on-primary`, `accent`, `pos`/`neg`/`warn`/`info` (`-soft`), `nav*`, `chart-1..6`. antd teması `src/app/theme.ts`'te `createAntdTheme(themeName)` ile aynı token'lardan üretilir (antd tonları JS'te türettiği için CSS değişkeni değil somut renk ister) ve `AppProviders`'ta `ConfigProvider`'a verilir. Hook'lar: `useTheme`, `useLanguage` (`src/hooks/`, `.md` dokümanlı). `src/__tests__/theme/themes.test.ts` her tema için WCAG kontrastını denetler; palet değişince bu test kırılırsa rengi düzelt, testi gevşetme. Yeni token eklemek için `tokens.ts`'te üç temaya da ekle (eksik anahtar derleme hatası verir) ve gerekirse `index.css`'teki `@theme inline` eşlemesine bağla. Grafik serisi renkleri (`chart-1..5`) `dataviz` doğrulama betiğinden geçirilmeli (bkz. `tokens.ts` üstündeki not).
- **Responsive (5 boyut: XS <640, S ≥640, MD ≥768, L ≥1024, XL ≥1280):** Mobile-first Tailwind (`sm:`/`md:`/`lg:`/`xl:`). Yatay kaydırma çıkmamalı; tablolar küçük boyutlarda kart listesine dönüşür, modallar XS'te tam ekran olur. Dikkat: antd'nin `Grid.useBreakpoint` eşikleri (576/768/992/1200) Tailwind'inkilerden farklıdır; düzen kararlarını CSS'te (Tailwind) ver, JS'te boyut gerekirse tek bir kendi hook'unu yaz (`src/hooks/`, `.md` ile).
- **Ortak metinleri tekrarlama:** Kısa/genel etiketler (buton metni, Evet/Hayır, yükleniyor/hata, zorunlu alan mesajı…) feature anahtarı altında yeniden yazılmaz; `common.*` altına konur ve her yerde oradan kullanılır. Uzun, eyleme özgü mesajlar (`description`, başarı/hata mesajı) aynı görünse bile feature altında kalabilir.
- **TypeScript strict:** `any` yok, `null`/`undefined` durumları açıkça ele alınır. Tip güvenliğine öncelik ver; generic ve discriminated union tercih et.
- **Readonly props (SonarQube):** Bir bileşenin props arayüzündeki her alan `readonly` olmalı (`interface FooProps { readonly bar: string; }`). Props harici bir tipten geliyorsa `Readonly<...>` ile sar (bkz. `src/components/ui/ConfigProvider.tsx`). Bunu yapan bir Oxlint kuralı yok, elle uygula.
- **Kıdemli seviye:** İdiomatik, production kalitesinde React yaz.
- **Gerçek isim yok:** Örnek/test verisinde gerçek kişi adı kullanma; `"User"` gibi genel yer tutucu kullan.
- **Bileşen bazlı geliştirme:** Her özellik küçük, tek sorumluluklu bileşenlere bölünür. SOLID, özellikle SRP ve DIP: bileşenler üçüncü parti kütüphanelere değil kendi soyutlamalarına bağımlı olur.
- **Ant Design wrapper kuralı:** `antd` bileşenleri feature kodunda **doğrudan import edilmez**; her biri önce `src/components/ui/` altındaki kendi wrapper'ından geçer (şu an `ConfigProvider.tsx`, `Segmented.tsx`, `Button.tsx`, `Drawer.tsx`, `Popover.tsx`, `Input.tsx`, `Modal.tsx`, `Select.tsx`, `AutoComplete.tsx`, `Switch.tsx`). Wrapper'ı ihtiyaç doğunca ekle, önceden üretme. Wrapper dosyaları yalnızca bileşen export eder. antd context'ine ihtiyaç duyan hook `src/hooks/` altında ince bir katman olur.
- **Kod stili (otomatik denetlenir):** `console.*` ve kullanılmayan değişken/import Oxlint'te `error`; `src/lib/logger.ts`'deki `logger`'ı kullan. Noktalı virgül ve tek tırnak Prettier ile zorlanır; kod yazdıktan sonra `npm run format`.
- **Yorumlar:** API tüketicisine dönük dokümantasyon yorumu JSDoc (`/** ... */`), uygulama ayrıntısı yorumu tek satır `//`. Çok satırlı yorum ardışık `//` satırlarıyla yazılır, `/* */` bloğu kullanılmaz. Her JSDoc etiketi kendi satırında. **Kodun zaten gösterdiğini tekrar eden yorum yazma**; yalnızca görünmeyen "neden"i (backend/spec kısıtı, workaround, incelikli değişmez) yaz, varsayılan yorumsuzluk. `catch {}` asla sessiz boş bırakılmaz; boşsa nedenini açıklayan `//` yorumu olur.
- **Hook dokümantasyonu:** Her hook'un yanında aynı adla Türkçe bir `.md` bulunur (`useX.ts` → `useX.md`): ne yaptığı, API'si ve en az bir örnek. `src/hooks/README.md` bunların dizinidir. Hook davranışı değişince `.md`'yi de güncelle.
- **Para/adet gösterimi:** API bu değerleri **string** gönderir (bkz. kök `CLAUDE.md`). `Number()` ile çevirip hesap yapma; gerçek hesap backend'de yapılır.
- **Araştırma para birimi:** Kaynaklı araştırma snapshot tutarları kaynak para biriminde ve açık birimle gösterilir; portföy mock kuruyla çevrilmez. Bu salt okunur araştırma ekranı aşağıdaki USD tabanlı pozisyon gösterimi kuralının dışındadır.

- **Tutar biçimlendirme (USD/TL):** Ekranda para gösteren her bileşen `useMoney()` kullanır (`format`, `formatUnit`; grafiklerde `convert` + `formatConverted` + `formatWhole`); `lib/formatMoney.ts`'i doğrudan çağırma. Tutarlar dolar gelir, `useMoney` seçili para birimine (üst çubuktaki `CurrencySwitcher`, `CurrencyProvider`, `inv-currency`) çevirir. Yeni tutar gösteren yere hardcoded `$` koyma. Yüzdeler `formatPercent` (`lib/formatNumber.ts`). Grafik verisi, eksen yuvarlak adımlar seçsin diye **önce çevrilir**.
- **Tıklanabilir öğeler:** Tailwind 4 düğme imlecini sıfırlar; `src/index.css`'teki `@layer base` kuralı `button`, `select`, bağlantılar ve tıklanabilir radyo/checkbox/switch etiketleri için `cursor: pointer` verir, ham `<button>` için ayrıca sınıf gerekmez.
- **Tablolar:** Uzun tablolarda başlık `sticky top-14` (üst çubuk 56 px), toplam satırı `sticky bottom-0`; bu yüzden sarmalayıcıda `overflow-hidden`/`overflow-auto` **kullanılmaz** (kaydırma kabı olursa sticky sayfaya değil ona bağlanır), köşe yuvarlama hücrelere verilir ve tablo `border-separate border-spacing-0` olur (bkz. `components/Holdings/HoldingsTable.tsx`). Sıralanabilir başlıklar `SortButton` + `aria-sort`.

- **İşlem kayıtlarının gösterimi:** İşlemler ve varlık geçmişindeki kayıt tutarları kendi para biriminde, USD karşılıkları saklanan işlem kuruyla gösterilir; bu alanlarda `formatMoney` doğrudan kullanılabilir ve USD↔TRY gösterim anahtarı uygulanmaz. Pozisyon/analiz değerlerinde `useMoney` zorunluluğu sürer.
- **Ortak bileşenler:** `NativeSelect` ve `SortButton` sayfalar arasında paylaşılır. `AssetPosition` ve `AssetHistory` Varlık Detayı'nı; `TypePerformance` ve `AssetRanking` Analiz'i oluşturur. Grafikler mevcut Dashboard bileşenlerinden paylaşılır.
- **Sayfa geçişi:** Kullanıcı İşlemler, Varlık Detayı, Analiz ve İçe/Dışa aktar'ı onayladı. Ayarlar (yalnızca platform yönetimi kapsamıyla) kodlanıp denendi, kullanıcı gereksiz bulup kaldırdı (bkz. "Proje durumu"). Sayfa sayfa tasarım turu bitti, öncelik Stratejiler/Takip Listesi; Keycloak sonraki aşamada. Rutin geliştirme/test/düzeltme için ayrıca izin sorulmaz; ortamın zorunlu izinleri ayrı tutulur.

## Yığın

- **React 19** + **React Compiler** (`babel-plugin-react-compiler` + `@rolldown/plugin-babel`). Otomatik memoize eder; kanıtlanmış ihtiyaç yoksa elle `useMemo`/`useCallback`/`React.memo` ekleme. Derleyici **Vitest modunda kapalıdır** (`vite.config.ts`, `mode === 'test'`): ürettiği memoization dalları tek render'da hiç çalışmadığı için dal coverage'ını gerçek kaynaktan uzaklaştırıyordu. Dev ve build'de açıktır. (aselsan-safi-fe'de derleyici testte açık ve `rerender` ile telafi ediliyor; burada bilerek farklı.)
- **Vite 8**, **TypeScript ~6** (`strict`, `verbatimModuleSyntax`, `noUnusedLocals/Parameters`, `erasableSyntaxOnly`).
- **Ant Design v6** (yukarıdaki wrapper kuralıyla) + **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first, `src/index.css`'te `@import 'tailwindcss'`; `tailwind.config.js` yok).
  - **CSS katmanı tuzağı (önemli):** Tailwind v4 stilleri bir `@layer` içinde, antd'nin genel stilleri ise katmansızdır; katmansız CSS her katmanlı kuralı yener, bu yüzden antd'nin `a { color }` gibi stilleri Tailwind sınıflarını ezer (çekmece ve popover içinde görülmüştü). Çözüm iki parçalı ve **birlikte** durmalı: `components/ui/ConfigProvider.tsx` antd'yi `<StyleProvider layer>` (`@ant-design/cssinjs`) ile sarar ve `src/index.css`'in en başındaki `@layer theme, base, antd, components, utilities;` bildirimi Tailwind import'undan **önce** gelir. Birini kaldırma.
  - **İkonlar:** `@remixicon/react` (`Ri…Line`/`Ri…Fill`); ikonlar `aria-hidden`, anlam metinle verilir.
  - **Grafikler:** `recharts` v3. Renkler `var(--chart-N)` / `var(--text-3)` gibi CSS değişkenleridir (temayla değişir); asla sabit hex yazma. Varlık türü → renk eşlemesi `src/domain/assetTypes.ts`'te sabittir (renk varlığı izler, sırayı değil). Test ortamında `ResponsiveContainer` `src/__tests__/setup.ts`'te sabit boyutlu bir sürümle değiştirilir (jsdom'da ölçü yok).
- **`@tanstack/react-query` v5** (aselsan-safi-fe'deki v4'ten farklı: tek nesne argümanlı `useQuery({ queryKey, queryFn })`). `QueryClientProvider` `AppProviders`'ta kurulu, varsayılanlar `src/app/queryClient.ts`'te.
- **Routing (`react-router-dom` v7):** `BrowserRouter` `AppProviders`'ta; `src/App.tsx` yalnızca `<Routes>` tanımlar. Sayfalar `src/pages/<Ad>/<Ad>Page.tsx`; tekrar kullanılabilir, rota olmayan UI `src/components/` altında. Yol metinleri `src/app/routePaths.ts`'teki `ROUTE_PATHS`'te toplanır, `Route path`/`Link to` içinde elle yazılmaz. `NotFoundPage` (`path="*"`) `App.tsx`'te **en son** rota olmalı. Rotalı bileşenleri test ederken `<MemoryRouter>` ile sar.
- **i18next + react-i18next:** `src/i18n/index.ts` senkron başlatır, paketli `resources` (lazy backend/dil algılayıcı yok). `src/main.tsx` ve `src/__tests__/setup.ts` bunu import eder. Dil eklerken: `locales/<kod>.json`, `resources`'a kayıt ve `AppProviders`'ta antd locale eşlemesi (`en` → `antd/locale/en_US`). RTL desteği bilerek yok.
- **Oxlint** (ESLint değil): `.oxlintrc.json`, eklentiler `react`, `typescript`, `oxc`, `vitest`, `import`, `unicorn`. Tip-bilinçli kurallar kapalı (`oxlint-tsgolint` gerekir). Google TS Style Guide'dan zorunlu kılınanlar: `no-var`, `prefer-const`, `eqeqeq` (smart), `func-style` (adlandırılmış fonksiyonlar `function` bildirimi, arrow callback'lerde serbest), `typescript/no-explicit-any`, `array-type` (`T[]`), `consistent-type-imports`, `consistent-type-definitions` (`interface`), `explicit-function-return-type`, `consistent-type-assertions` (`as` yasak, `as const` serbest), `import/no-default-export`, `import/no-relative-parent-imports`, `default-case`, `curly`, `prefer-template`. `react/only-export-components` (warn): bileşen dosyası bileşen dışı değer export etmemeli. Override'lar: `src/lib/logger.ts` için `no-console` kapalı, `vite.config.ts` için `no-default-export` kapalı.
- **Prettier:** `semi: true`, `singleQuote: true`. `.prettierignore`: `dist`, `node_modules`, `coverage`, `.claude`.
- **Vitest 4:** `vite.config.ts`'te inline yapılandırılır (`defineConfig` `vitest/config`'ten). `environment: 'jsdom'`, kurulum `src/__tests__/setup.ts` (jest-dom eşleştiricileri, `afterEach(cleanup)`, i18n). **`test.globals` kapalı**: `describe`/`it`/`expect`'i her test dosyasında `vitest`'ten import et. antd popup bileşenleri (Select, Tooltip, Modal…) jsdom'da eksik `ResizeObserver`/`matchMedia` ister; ilk kullanıldıkları teste kurulum dosyasına stub eklenir (aselsan-safi-fe'deki `setup.ts`'e bak).
- **Loglama:** `src/lib/logger.ts`'deki `logger` (`log/info/warn/debug/error`) kullanılır. `log/info/warn/debug` production'da no-op (build sırasında ölü kod olarak elenir), `error` asla bastırılmaz. Testlerde `vi.stubEnv('PROD', …)` ile denenir (bkz. `src/__tests__/lib/logger.test.ts`).
- **`@/*` → `src/*` alias'ı** hem `vite.config.ts`'te hem `tsconfig.app.json`'da tanımlı. Yukarı çıkan (`../`) her import için `@/...` kullan (lint bunu zorlar); aynı klasör/alt ağaç import'ları göreli (`./Foo`) kalır. Testler için de geçerli.

## Dizin yapısı

```
src/
├── app/            # AppProviders, queryClient, theme, routePaths
├── components/
│   └── ui/         # antd wrapper'ları (tek giriş noktası)
├── domain/         # alan sabitleri ve tipleri (varlık/işlem türleri, tür→renk eşlemesi, Holding)
├── hooks/          # ortak hook'lar (useTheme, useLanguage, useCurrency, useMoney, useUsdTryRate, useDashboardSummary, usePortfolioSeries, useHoldings) + .md dokümanları
├── i18n/           # i18next kurulumu, languages.ts, locales/tr.json + en.json
├── theme/          # tema token'ları (tokens.ts = tek kaynak), ThemeProvider, applyTheme
├── currency/       # gösterim para birimi: CurrencyProvider, bağlam, depolama (inv-currency)
├── lib/            # framework'ten bağımsız yardımcılar (logger, formatMoney, formatNumber…)
├── pages/<Ad>/     # rota bileşenleri: <Ad>Page.tsx
├── services/       # backend'e açılan kapı: şu an `dashboard.ts`, `holdings.ts`, `fx.ts`, `mockPortfolio.ts` (sahte veri); gerçek istemci gelince buraya
└── __tests__/      # tüm testler, kaynağın yolunu yansıtır
```

**Tüm testler `src/__tests__/` altında** durur (kaynak yolunu yansıtır: `src/App.tsx` → `src/__tests__/App.test.tsx`); test dosyası kaynağın yanına konmaz. `src/__tests__/**` coverage dışıdır.

## Doğrulama ve çalışma notları

- **Kapılar:** `npm run format`, `npx tsc -b`, `npm run lint`, `npm run build`, `npm run test:coverage` (%80 eşiği). UI işinde ayrıca gerçek tarayıcıda 5 boyut (yatay taşma ölçümü), koyu tema ve TL modu.
- **Gerçek tarayıcı denemesi:** Kullanıcı kendi `npm run dev`'ini 5173'te açık tutabilir; onu **öldürme**. Ayrı portta kendi sunucunu aç (`npx vite --port 5199 --strictPort`, arka planda), bitince yalnızca kendi sürecini durdur. Boyut denemesi için geçici `public/__sizes.html` (5 boyutlu iframe sayfası) yaz, işin sonunda **sil**; kendi origin'inin `localStorage`'ını temizle ve sekmeyi kapat.
- **Araç tuzakları:** `String.replace`'e verilen yeni metinde `$'`, `$&` özel kalıptır (ör. `'$'` dizesi dosyayı bozar); düzenlemeleri `Edit` aracıyla ya da fonksiyonlu replace ile yap. `package.json` `"type": "module"` olduğundan geçici betikler `.cjs` olmalı. Vitest'te `console.log` görünmez (hata mesajıyla yazdır). antd `Segmented` testte radyo girdisine `pointer-events: none` verir: etiket metnine tıkla.

## Backend ile konuşma

Frontend her zaman aynı origin'de göreli `/api/v1/...` çağırır; dev'de Vite proxy (`/api` → `http://localhost:8081`), production'da reverse proxy aynı işi yapar. Bu yüzden CORS ya da ortama göre base URL yapılandırması yok; `fetch` tabanlı ince bir istemci `src/services/` altında kurulacak (henüz yazılmadı). Dış servislere (fiyat, kur API'leri) tarayıcıdan **asla** doğrudan gidilmez.

## Git

Repo: git@github.com:cemalcanisci/investulator-fe.git; çalışma branch: dev. Kullanıcının 2026-10-09 kararıyla şimdilik public; daha sonra kullanıcı private yapacak. Husky pre-commit kancası yalnızca lint çalıştırır; npm install sırasında prepare ile kurulur. Commit mesajı standardı henüz seçilmedi.

## İleride (yol haritasında, şimdi yapma)

PWA (mobil öncesi), Dockerfile + nginx, SonarQube entegrasyonu, gerçek API istemcisi (`fetch` tabanlı, `/api/v1`) ve Keycloak girişi.

## Geçici test politikası (2026-10-09 kullanıcı kararı)

Commit/push ve her yeni özellik sonunda otomatik test çalıştırılmaz; toplu test kontrolü proje sonunda yapılacak. Testler ve elle çalıştırma komutları korunur. Husky pre-commit yalnızca lint çalıştırır; test:coverage isteğe bağlı elle çalıştırılabilir. Bu geçici karar, yukarıdaki her özellik sonrası test çalıştırma kurallarının önüne geçer.
