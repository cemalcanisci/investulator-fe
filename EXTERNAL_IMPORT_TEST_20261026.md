# Harici Excel aktarımı — teslimat ve test sonuçları

26.10.2026, Codex. Güncel `dev` üzerinde çalışıldı (`git pull --ff-only`: Already up to date). Commit/push yapılmadı.

## Kök neden

Silinmiş eski SISE dosyasının HEAD kopyası geri yüklenmeden incelendi. ZIP içindeki geçerli `x:workbook` / `x:sheets` ad alanı önekleri ExcelJS 4.4.0 okuyucusunun beklediği etiketten farklıydı. Doğrudan ExcelJS ile hata tekrarlandı: `TypeError: Cannot read properties of undefined (reading 'sheets')`, `node_modules/exceljs/lib/xlsx/xlsx.js:323:37`. Portatif regresyon testi aynı XML önekini üreterek hatayı tekrarlar.

Çözüm, XLSX içindeki SpreadsheetML ad alanı öneklerini XML düzeyinde standartlaştırmak; hücre ayrıştırıcısı hâlâ yalnızca ExcelJS. ZIP/CRC, boyut, XML DTD/entity, formül, kimlik, kapsam ve uygulama şema kontrolleri korunur. Normal export dosyaları gereksiz XML serileştirmesine girmez. Teknik olarak geçerli sıradan Excel ile Investulator şemasına uygun Excel ayrı test edilir.

Okuma hatasından bağımsız iki entegrasyon açığı da giderildi: yeni raporun zorunlu boş hesap dizileri başlangıçta oluşturulamıyordu; kaynak finansal olgular boş sunum listesine yansımıyordu. Yalnızca boş başlangıç dizilerine izin verildi; Excel'den hesap tanımı eklemek hâlâ yasak. Sunum olguları gerçek rapor olgularından türetilir. Harici şirketler için çeviri anahtarı gerektirmeyen ad/sektör/faaliyet ve eksik metin gösterimi eklendi.

## Dosya ve kullanım

- Excel: [public/research/sise-import-test.xlsx](public/research/sise-import-test.xlsx).
- Makine tarafından okunabilir örnek: [sise-import-example.json](public/research/sise-import-example.json).
- Tam format sözleşmesi: [EXTERNAL_FORMAT.md](public/research/EXTERNAL_FORMAT.md).
- Harici üretim kodu: `../outputs/sise-integration-20261026/build.mjs`; `@oai/artifact-tool` kullanır, Investulator export'u veya TUPRS verisini kopyalamaz.

Kısa sözleşme: `Instructions!B1 = investulator-research/1`; veri sayfalarının sekiz sütunu `assetId, companyId, market, entity, recordId, field, value, type`. Yeni şirket/rapor örneği Companies, Financials, Sources, Reviews ve Reports sayfalarını kullanır. Alanlar JSON Pointer'dır (`/facts/0/value`; `~0` ve `~1` kaçışları). Finansal tutarlar ondalık metin, tarihler ISO, boş diziler açık `[]` olarak yazılır. Şirketin sabit kimliği, borsa/ISIN eşleşmesi, rapor sürümü/context/presentation ve olguların kaynak/dönem/muhasebe bazı zorunludur. Alanların tam listesi format belgesindedir.

Yerel sunucuda `INVESTULATOR_RESEARCH_WRITE=1` etkin olmalı. Genel Import → Excel → URL'den Yükle → `/research/sise-import-test.xlsx`. Şirkete özel TUPRS kapsamından yüklemek doğru biçimde reddedilir.

SISE örneği resmi Şişecam 2025 sunumu ve KAP kimlik kaynağına dayanır; uydurma finansal rakam içermez. Kaynak bağlantıları ve sayfa/ölçek bilgileri Excel/JSON/format belgesinde bulunur. Rapor kısmi, olgular UNVERIFIED ve inceleme NEEDS_REVIEW'dur. Kesin yayımlanma tarihi doğrulanmadığı için null; ayrı observedAt yalnızca gözlemlenme tarihidir. Fiyat/borç/nakit/emsal uydurulmaz, eksik oranlar hesaplanmaz. TMS 29 ve dönem kapıları korunur.

## Gerçek ön izleme ve kalıcılık

```json
{
  "added": 142,
  "updated": 0,
  "unchanged": 0,
  "newCompanyIds": ["watch-bist-sise"],
  "issues": []
}
```

`watch-bist-sise`, sembolü SISE olan katalog kimliğidir. İzole gerçek HTTP servisinde diskten XLSX okuma → readResearchWorkbook → previewWorkbook → onaylı apply → diskten yeniden okuma → sunucuyu yeniden başlatma → gerçek araştırma/analiz servisleri → export → yeniden import zinciri başarılı. 19 kontrol geçti, 0 başarısız. İkinci import değişiklik üretmez; export dönüşünde kanonik veri aynıdır. Kapsam, yanlış onay, undo ve kapalı servis de denetlendi.

Gerçek Chrome'da URL modalından import ve `/takip/watch-bist-sise` sayfasında yenileme test edildi. Hasılat 224,53 milyar TL, net kâr 9,88 milyar TL ve FAVÖK 23,98 milyar TL; eksik veri, TAS29, UNVERIFIED ve NEEDS_REVIEW gösterimleri doğrulandı. Beş genişlikte (390/640/820/1024/1440) yatay taşma yok, runtime exception yok; koyu tema doğrulandı. TR/EN sayfa testleri de geçti. Üst çubuk TRY tercihi verilse de kur servisi mevcut olmadığından para birimi dönüşümü doğrulanmış sayılmadı; kaynak rapor tutarları TL olarak görünür.

Gerçek veri deposuna yazılmadı. analysis-reports, imported-research, tuprs-approximate-history ve tuprs-dividend-history SHA-256 değerleri test öncesi/sonrası aynı. Kullanıcının 5173 sunucusu durdurulmadı; test 5198 ve ayrı Chrome profili/9248 kullandı.

Kanıtlar: `../outputs/sise-integration-20261026/` içindeki `persistence-result.json`, `browser-result.json`, `sise-browser.png`, `sise-browser-text.txt`, `full-tests.json`, `baseline-tests.json`. Geçici depo yolu persistence-result içinde kayıtlıdır.

## Kontroller ve mevcut hatalar

| Kontrol                                              | Sonuç                                               |
| ---------------------------------------------------- | --------------------------------------------------- |
| Tam Vitest + coverage                                | 532 test: 527 başarılı, 5 başarısız                 |
| Temiz HEAD karşılaştırması (ilgili iki test dosyası) | 8 test: 3 başarılı, aynı 5 başarısız                |
| Gerçek HTTP + disk + Chrome                          | 19 başarılı, 0 başarısız                            |
| TypeScript (`tsc -b`, build içinde)                  | Başarılı                                            |
| Lint (`npm run lint`, projede Oxlint)                | Başarılı                                            |
| Production build                                     | Başarılı; büyük chunk uyarısı sürüyor               |
| Genel format:check                                   | Önceden mevcut 4 dosya nedeniyle başarısız; aşağıda |

Genel coverage: statements %91,87; branches %86,02; functions %93,64; lines %91,71. Genel %80 eşiği aşılır; her dosya/dal için ayrı %80 garantisi değildir (örneğin ResearchTransfer satır kapsamı %68,81; ayrıca gerçek Chrome ile sınanmıştır).

Önceden var olan 5 hata temiz HEAD arşivinde yeniden üretildi: AnalysisPage.test.tsx içinde 4 eski ekran beklentisi; services/research.test.ts içinde v6 beklerken mevcut v7 raporu dönmesi. Bu çalışmanın testlerinde başarısızlık yok. Önceki bir tam koşuda iki ResearchPage testi zaman aşımına uğradı; son koşu iki worker ve 60 saniye test süresiyle bu testleri geçti.

Genel format kontrolünün işaretlediği dosyalar: kullanıcı tarafından değiştirilmiş `public/research/README.md`, değiştirilmeyen `src/data/research/analysis-reports.json`, `imported-research.json`, `tuprs-approximate-history.json`. Bunlara dokunulmadı. Bu çalışmada değiştirilen bütün dosyaların hedefli Prettier kontrolü ve `git diff --check` başarılıdır. Proje ESLint kullanmıyor; mevcut lint komutu Oxlint çalıştırır. Önceden mevcut üç test mock tipi uyarısı sürer; lint hatası yoktur.

## Değiştirilen dosyalar

- Okuma/şema: `src/lib/researchWorkbookXml.ts` (yeni), `researchWorkbookFile.ts`, `researchWorkbook.ts`, `analysisSchema.ts`, `financialPeriodSelection.ts`.
- Veri modeli/kalıcılık: `src/domain/research.ts`, `src/services/researchBundle.ts`, `dev/researchStore.ts`.
- Kullanıcı akışı: `src/components/Strategies/ResearchTransfer.tsx`, `src/pages/Research/ResearchPage.tsx`; Research bileşenleri `ResearchOverview.tsx`, `ResearchMetric.tsx`, `ResearchDebt.tsx`, `ResearchDisclosures.tsx`, `ResearchSummary.tsx`; TR/EN locale JSON'ları.
- Bağımlılıklar: `package.json`, `package-lock.json` (doğrudan jszip ve @xmldom/xmldom).
- Testler: `src/__tests__/lib/externalResearchWorkbook.test.ts`, `src/__tests__/pages/ExternalResearchPage.test.tsx`; `scripts/test-external-import.mjs`, `browser-external-import.mjs`, `check-import-baseline.mjs`, `summarize-external-tests.mjs`.
- Örnek/dokümantasyon: public/research altındaki yukarıdaki üç yeni dosya; bu teslimat belgesi; frontend ve kök WORKLOG.

Başlangıçtaki README değişikliği, eski SISE XLSX silinmesi ve `public/research/test.xlsx` kullanıcıya aittir; korunmuştur.

## Sınırlar

Kalıcılık mevcut yerel geliştirme servisi için doğrulandı; production backend/API eklenmedi. Harici XLSX uyumluluğu namespace önekli dosya ve bağımsız üretici örneğiyle sınandı; tüm Excel üreticileri/ECMA-376 varyantları için sertifika değildir. Örnek tam şirket araştırması veya bağımsız doğrulama değildir. Mevcut 5 test ve 4 format sorunu açık kalır. Genel ürün verisi ve TUPRS araştırması değiştirilmedi.
