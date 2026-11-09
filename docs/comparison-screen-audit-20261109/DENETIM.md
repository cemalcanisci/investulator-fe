# 9 Kasım 2026 — Karşılaştırma ekranı (`/karsilastir`) son kalite kontrolü

İnceleyen: Claude. Kapsam: 9 Kasım'da eklenen karşılaştırma ekranının (`src/lib/companyMatrix.ts`, `src/lib/companyAssessment.ts`, `src/components/Comparison/*`, `src/pages/Comparison/ComparisonPage.tsx`) sektör/emsal ayrımı, kullanıcı deneyimi, test kararlılığı ve finansal güvenlik açısından son incelemesi. Yeni finansal veri/varsayım üretilmedi; mevcut araştırma raporlarına dokunulmadı.

## 1. Sektör ve emsal ayrımı — gerçek hata bulundu ve düzeltildi

**Bulgu:** `valuationComparisonGroups` (`companyMatrix.ts`) ve `ValuationGroupTable` DOAS, FROTO, TOASO, TTRAK'ı yalnızca `businessModel: "AUTOMOTIVE"` etiketini paylaştıkları için tek bir "Otomotiv · FD/FAVÖK" emsal tablosunda yan yana gösteriyordu. Bu dört şirket gerçekte farklı iş modelleri: DOAS bir distribütör (üretim capex'i yok, FD/FAVÖK'ü bayilik marjından geliyor), FROTO/TOASO yerel montaj/üretim yapan OEM'ler (Ford/Stellantis iştirakleri), TTRAK ise tarım makineleri üreticisi (farklı talep döngüsü). Aynı sektör etiketini paylaşmaları ekonomik emsal uygunluğu anlamına gelmiyor — tam da kök `CLAUDE.md`'nin "Değerleme uygun yöntem... yöntemler gerekçesiz ortalanmaz" ve "Sembole özel veya kopya motor oluşturulmaz" ilkelerinin kesiştiği bir durum.

**Düzeltme (alt grup oluşturma, ratio zorlanmadı):**

- `AnalysisContext`'e (`domain/analysis.ts`) opsiyonel `peerGroup` alanı eklendi — `businessModel`'den ayrı, yalnız emsal gruplamasında kullanılan, yöntem/metrik seçimini etkilemeyen bir alan. Şema doğrulaması `analysisSchema.ts`'e eklendi.
- Dört otomotiv şirketinin **her revizyonuna** (`doas-/froto-/toaso-/ttrak-analysis-reports.json`, toplam 19 revizyon) yapısal (araştırma iddiası değil, halka açık şirket yapısı) sınıflandırma eklendi: DOAS → `AUTOMOTIVE_DISTRIBUTION`, FROTO/TOASO → `AUTOMOTIVE_OEM`, TTRAK → `AUTOMOTIVE_MACHINERY`.
- `valuationComparisonGroups` artık `peerGroup ?? profile.id` ile gruplanıyor: FROTO/TOASO artık gerçek emsal olarak birlikte gösteriliyor; DOAS ve TTRAK kendi tek-şirketlik gruplarında, zaten var olan "bu grupta tek şirket var" uyarısıyla ayrı duruyor. `businessModel` (profil/metrik seçimi) değişmedi — dördü hâlâ aynı EV/EBITDA yöntemini kullanıyor, sadece yan yana _karşılaştırma_ ayrıştırıldı.
- `companyComparison.intro.sectorCaution` metni (TR/EN) "aynı sektör etiketi tek başına emsal uygunluğu anlamına gelmez" cümlesiyle genişletildi.
- **Yan etki olarak bulunan gerçek bug:** `ComparisonPage.tsx`'teki grup listesi `key={businessModel:ratioId}` kullanıyordu; alt gruplama olmadan önce bu benzersizdi, ama yeni yapıda AUTOMOTIVE için üç farklı grup aynı `businessModel` değerini paylaştığından React key çakışması oluşurdu. `key={peerGroup:ratioId}`'ye düzeltildi.

**GYO (REIT) tarafı — mevcut davranış doğrulandı, değişiklik gerekmedi:** AKMGY/PAGYO/YGGYO aynı F/NAD emsal grubunda kalıyor (üçü de gerçek GYO, bu geçerli bir emsal seti). İncelemede: motor zaten AKMGY/YGGYO'nun `netAssetValue` fact'i CONFLICT olduğu için `priceNav`'ı MISSING_DATA döndürüyor (yalnız PAGYO'nun ayrı `adjustedNetAssetValueFY2025` fact'i VERIFIED, ama `priceNav` hesaplaması buna değil kanonik `netAssetValue`'ya bakıyor — PAGYO da H1 2026 bazlı orijinal fact'i kasıtlı CONFLICT bırakıldığından MISSING_DATA). Yani üç GYO da şu an tabloda "Yeterli uyumlu veri yok" gösteriyor — ekspertiz tarihi/NAD güvenilirliği farkları **zaten** sessizce eşitlenmiyor, motor doğru davranıyor. Tek iyileştirme: her MISSING_DATA satırına `ratioPresentation.issues`'tan gelen kısa gerekçe metni eklendi (`ratios.issues.*` → `researchAnalysis.issues.*` fallback zinciri, `ResearchMetric.tsx`'teki mevcut desenin aynısı tekrar kullanıldı).

## 2. Kullanıcı deneyimi

Ayrı 5199 portunda (kullanıcının 5173 sunucusuna dokunulmadı) gerçek tarayıcıda doğrulandı: TR/EN, açık/koyu tema, Kolay/Detaylı görünüm — hepsinde sektör uyarı metni, yeni "OEM üreticileri / distribütörlük / tarım makineleri" alt grupları, GYO MISSING_DATA gerekçeleri doğru render oluyor; konsol hatası yok.

**Bilinen kısıt:** Bu oturumdaki `resize_window` tarayıcı aracı pencereyi fiilen küçültmedi (390/420/800 px denendi, viewport ~1568 px'te sabit kaldı — ortamsal bir araç kısıtı, ekrana özgü bir bulgu değil). Bu yüzden 390/768/1024 px'te **piksel bazlı gerçek render doğrulaması yapılamadı**; kullanıcı kararıyla bunun yerine statik kod incelemesi yapıldı:

- `ValuationGroupTable` zaten kök `CLAUDE.md`'nin "Tablolar" kuralındaki `hidden md:table` / `md:hidden` ikili render desenini birebir kullanıyor (`HoldingsTable.tsx` ile aynı kalıp) — masaüstünde tablo, mobilde `dl`/`dt`/`dd` kart listesi.
- Tüm grid sarmalayıcılarında `min-w-0` var (`ComparisonPage.tsx`, `CompanyComparisonCard.tsx`) — flex/grid çocuklarının yatay taşma yaratması engelleniyor.
- Breakpoint'ler mobile-first: kartlar `md:grid-cols-2 xl:grid-cols-3`, grup tabloları `lg:grid-cols-2`, detay panelindeki metrik gridleri `sm:grid-cols-2`.
- Hiçbir yerde sabit piksel genişlik veya `whitespace-nowrap` yok; uzun çevrilmiş başlıklar (ör. "Tarım/iş makineleri üretimi · FD/FAVÖK") doğal satır kırılımıyla sarılıyor.

Bu, kod seviyesinde uygunluk teyidi — gerçek 390/768/1024 px ekran görüntüsü değil. İleride bu araç kısıtı giderilirse (veya kullanıcı kendi DevTools'unda bakarsa) gerçek görsel tur yapılmalı.

## 3. Test kararlılığı — kök neden bulundu ve giderildi (timeout artırma değil)

**Başlangıç durumu:** `externalResearchWorkbook.test.ts`'in tek bir testi tam 10 şirketlik araştırma paketini XLSX'e export edip tekrar okuyordu — coverage'sız 23 sn, v8 coverage enstrümantasyonu altında yalnız başına **54 sn** (önceki oturumların "ağa bağımlı" tanımlaması yanlıştı: her iki dosya da gerçek ağ çağrısı yapmıyor — biri yerel fixture dosyası okuyor, diğeri `fetch`'i zaten mock'luyordu; asıl sorun CPU-yoğun gerçek ZIP/crypto işiydi).

**Kullanıcı talimatı:** "timeout artırma, test dosyalarını böl; max 30000". Buna göre:

1. **Kapsam küçültme:** `externalResearchWorkbook.test.ts`'teki tam-paket export testi ayrı bir dosyaya (`externalResearchWorkbookRoundTrip.test.ts`) taşındı ve `exportResearchWorkbook(bundle, ['watch-bist-sise'])` ile **yalnız yeni içe aktarılan şirkete** daraltıldı (zaten `ResearchTransferUrlImport.test.tsx`'in kullandığı aynı scoping mekanizması). Sonuç: 54 sn → ~3 sn (coverage altında ~2-5 sn).
2. **Test bölme:** `ResearchTransferUrlImport.test.tsx`'teki tek testte art arda yapılan iki UI akışı (dosya yükleme + URL'den yükleme) ayrı iki teste bölündü.
3. **Gereksiz tekrar kaldırıldı:** Bölünen testlerin ortak kurulumu (`buildEditedWorkbook`), zaten `externalResearchWorkbookRoundTrip.test.ts`'de bağımsız doğrulanan export→okuma→preview round-trip'ini kendi içinde bir daha yapıyordu; bu tekrar kaldırıldı, beklenen sayaçlar doğrudan `editedResult`'tan türetildi. Coverage altında 30-31 sn (sınırda flake) → **15 sn**'ye düştü.
4. Üç dosya da (`externalResearchWorkbook.test.ts`, `externalResearchWorkbookRoundTrip.test.ts`, `ResearchTransferUrlImport.test.tsx`) `vite.config.ts`'te ayrı, tek-threadli bir Vitest "integration" projesine alındı (`testTimeout: 30000`, `maxWorkers: 1`) — geri kalan ~95 hızlı birim test dosyasıyla worker thread paylaşmıyor, çapraz kontaminasyon riski kalmadı.

**Finansal doğrulama kapsamı daraltılmadı:** Kaldırılan tek şey, zaten ayrı bir testte birebir doğrulanan bir round-trip'in gereksiz tekrarıydı; XLSX import/export'un kendisinin doğruluğu (şema, kimlik, kapsam, TAS29 bazı, kalıcı yazma atomikliği) hâlâ aynı dosyalardaki diğer testlerle tam kapsanıyor.

**Son doğrulama (coverage altında, iki ayrı turda):** integration projesindeki en yavaş test 15,4 sn — 30.000 ms sınırının yarısı kadar pay bırakıyor.

## 4. Finansal güvenlik — ihlal bulunmadı

- BLOCKED/NEEDS_REVIEW adil değer senaryolarının sayısal fiyat hedefleri hiçbir bileşende açılmıyor (`CompanyComparisonCard`/`ReliabilitySummary` yalnızca nitel durum — NONE/BLOCKED/AVAILABLE — gösteriyor).
- Eksik veri hiçbir yerde sıfır veya olumsuz göstergeye dönüştürülmüyor; `MISSING_DATA` ve `assessment.missing` listesi açıkça ayrı tutuluyor.
- Fiyatlar tarihli olarak (`result.periodBasis`/kaynak linki) gösteriliyor, "güncel" diye sunulmuyor.
- Sektörler arası keyfi puanlama yok: sıralama `profile.id → symbol` (madde 1'deki düzeltmeden sonra da aynı), `riskFlags` yalnız yapısal etiket üretiyor, ağırlık/skor yok.
- 42 tarihsel rapor ve doğrulanmış finansal girdilere dokunulmadı; yalnız `peerGroup` adlı yeni, salt yapısal (araştırma iddiası taşımayan) bir sınıflandırma alanı eklendi.

## Doğrulama (tüm değişiklikler bittikten sonra, tek seferde)

`npx tsc -b` 0 hata · `npm run lint` 0 hata (3 önceden var olan ilgisiz transfer-test uyarısı) · `npm run build` PASS · `npm run test` **690/690 PASS** (97 dosya) · `npm run test:coverage` iki ayrı turda da PASS — satır %92,52 · dal %87,39 · fonksiyon %95,10 · ifade %92,67 (hepsi %80 eşiğinin üzerinde). Commit/push yapılmadı; kullanıcının 5173 sunucusuna dokunulmadı (ayrı 5199 portu kullanıldı, iş bitince kapatıldı).

## Kalan açıklar

- **390/768/1024 px'te gerçek piksel render turu yapılamadı** (bkz. madde 2) — bu oturumun tarayıcı aracı kısıtı; statik kod incelemesiyle makul güven sağlandı ama görsel doğrulama değildir.
- GYO emsal grubunda üç şirket de şu an MISSING_DATA gösteriyor (motor doğru davranıyor, ama kullanıcıya "şu an hiçbir GYO karşılaştırılamıyor" izlenimi veriyor olabilir) — bu bir hata değil, AKMGY/YGGYO/PAGYO'nun NAD köprülerinin DENETIM.md'de zaten bilinen CONFLICT durumunun doğal sonucu; NAD denetimi ilerledikçe kendiliğinden düzelecek.
- `peerGroup` alanı şimdilik yalnız dört otomotiv şirketinde dolduruldu; ileride başka bir business model altında (ör. yeni bir sanayi şirketi eklenirse) gerçek bir alt-emsal ayrımı gerekirse aynı mekanizma kullanılabilir.
