# Harici araştırma Excel'i — sürüm 1

Bu sözleşme DOAS, TUPRS, FROTO, SISE gibi şirketler için aynı okuyucuyu kullanır. XLSX üretmek için Investulator koduna ihtiyaç yoktur. `sise-import-example.json` makine tarafından okunabilir, sıfırdan yazılmış tam örnektir; `sise-import-test.xlsx` bu örnekten harici `@oai/artifact-tool` ile üretilmiştir. Uygulamanın export fonksiyonu veya TUPRS raporu kopyalanmamıştır.

## İki ayrı doğrulama

1. Dosya geçerli bir XLSX/ZIP olmalıdır. XML ad alanı önekleri (`x:workbook` gibi) standartlaştırılır; hücreleri yalnızca ExcelJS okur. Bozuk ZIP/CRC/XML, formüller ve boyut sınırı ihlalleri reddedilir. Bu kontrol tam ECMA-376 uygunluk sertifikası değildir.
2. Okunan satırlar aşağıdaki Investulator uygulama şemasını sağlamalıdır. Normal bir finansal tablo XLSX olarak geçerli olsa bile bu şemaya dönüşmeden içe aktarılamaz.

## Sayfalar ve sütunlar

`Instructions` zorunludur: `A1 = schemaVersion`, **`B1 = investulator-research/1`**. Okuyucu sürümü B1'den denetler. `DataDictionary` isteğe bağlı açıklama sayfasıdır; veri kaydı içermez.

En az bir veri sayfası ve veri satırı gerekir. Boş bölümlerin sayfalarını oluşturmak zorunlu değildir. Yeni şirket + rapor örneği `Companies`, `Financials`, `Sources`, `Reviews`, `Reports` kullanır. Tüm desteklenen veri sayfaları:

| Sayfa                       | İçerik                                                                                          |
| --------------------------- | ----------------------------------------------------------------------------------------------- |
| Companies                   | `companies` varlık kimliği                                                                      |
| Financials                  | `reports` içindeki `/facts/...`                                                                 |
| Sources                     | Kaynaklar ve kanıt alanları                                                                     |
| Reviews                     | İnceleme ve bölüm kapsamı                                                                       |
| Reports                     | Raporun kalan alanları                                                                          |
| MarketData, FXRates         | Yaklaşık tarihçe fiyat/kur girdileri                                                            |
| Dividends, CorporateActions | Temettü ve kurumsal işlemler                                                                    |
| Peers                       | Rapor/olgu referansıyla emsaller                                                                |
| VerifiedHistory             | Mevcut doğrulanmış tarihçenin kayıpsız export'u; yeni/değişen kayıtlar ayrı inceleme gerektirir |

Her veri sayfasında ilk satır **bu sırayla ve bu yazımla** sekiz başlık içerir:

`assetId | companyId | market | entity | recordId | field | value | type`

- `assetId`: uygulamadaki sabit kimlik; örnek `watch-bist-sise`. Sembol ile aynı olması gerekmez.
- `companyId`: raporda ISIN varsa ISIN; yoksa katalog `providerId`; o da yoksa `assetId`. Aynı şirkete ait bütün satırlarda aynı olmalıdır.
- `market`: katalog/rapor borsasıyla birebir eşleşir; örnek `BIST`.
- `entity`: `companies`, `reports`, `approximate`, `verified`.
- `recordId`: rapor için benzersiz `version`; diğer varlıklar için `assetId`.
- `field`: kayıt köküne göre JSON Pointer.
- `value`: tek alan değeri. Finansal sayılar, kimlikler ve ISO tarihler metin olarak yazılır.
- `type`: `string`, `number`, `boolean`, `null`, `array`, `object`.

Kayıt alanı anahtarı `(entity, recordId, field)` birleşimidir. Aynı anahtar iki kez bulunamaz. Satır numarası Excel'deki gerçek numaradır; ilk veri satırı 2'dir. Başlıklardan sonra ek sütun kullanmayın. Kaynak adresini normal metin yazın; formül, önceden hesaplanmış formül sonucu, rich text veya hyperlink hücre nesnesi kullanmayın.

## Tipler ve JSON Pointer

- Yol `/` ile başlar: `/facts/0/value`, `/presentation/sources/0/url`.
- Anahtar içindeki `~` → `~0`; `/` → `~1`. Diğer `~` kaçışları geçersizdir.
- Diziler sıfırdan başlayan ardışık indekslerle yazılır. Boş diziyi `value=[]`, `type=array` olarak yazın; dolu dizi/nesneyi tek hücrede JSON olarak yazmayın, yaprak alanlarına ayırın.
- Boş nesne `value={}`, `type=object`; açık null `value=null`, `type=null`; boolean `true`/`false`; sayısal şema sürümü `2`, `type=number`.
- Ondalık finansal değer örneği `224527000000`, `type=string`. Binlik ayıracı, para işareti, virgüllü ondalık veya bilimsel gösterim kullanmayın. Kaynak milyon TL ise önce tam TL'ye dönüştürün; kaynak ölçeğini `locator` içinde belirtin.
- Boş hücre mevcut veriyi silmez. Yeni alan gerçekten null ise yukarıdaki açık null gösterimini kullanın. Dolu nesneyi/diziyi boş kapla değiştirerek silmek yasaktır. `/presentation/facts = []` yalnızca olgulardan türetilen sunum için bir başlangıç işaretidir, kaynak olguları silmez.
- `__proto__`, `prototype`, `constructor`, boş yol parçası ve aşırı derinlik reddedilir. En fazla 20 yol parçası; dosya 8 MiB sıkıştırılmış, 48 MiB açılmış, 100.000 veri satırı ve hücre başına 30.000 karakter sınırındadır.

## Yeni şirketin zorunlu alanları

`companies` kaydında sekiz alanın tamamını yazın:

| Yol             | Tip / kural                                                  |
| --------------- | ------------------------------------------------------------ |
| /id             | Dolu string, assetId ve recordId ile eşleşir                 |
| /symbol         | Dolu string, örnek SISE                                      |
| /assetType      | BIST_STOCK, US_STOCK, CRYPTO, GOLD veya FX                   |
| /identityStatus | UNVERIFIED                                                   |
| /name           | string veya açık null                                        |
| /market         | string veya açık null; raporlu şirket için raporla eşleşmeli |
| /pair           | string veya açık null                                        |
| /providerId     | string veya açık null; SISE örneğinde ISIN                   |

Şirket zaten varsa aynı kimliği kullanın. Katalog/rapor ISIN veya borsa uyuşmazlığını yeni isim vererek aşmayın. Raporun `presentation.symbol` ve `presentation.market` alanları katalogla eşleşmelidir.

## Yeni finansal raporun zorunlu alanları

Kök: `schemaVersion=2` (number), `version` (benzersiz string), `profileVersion="1"` (string), `context`, `facts`, `contracts=[]`, `calculations=[]`, `presentation`.

`context`: `assetType=EQUITY|CRYPTO|FUND`, `businessModel` string, `strategies` dizisi (`DIVIDEND`, `GROWTH`, `VALUE`, `LONG_TERM`). Desteklenen iş modeli örnekleri `INDUSTRIAL`, `AUTOMOTIVE`, `REFINING`, `BANK`, `REIT`, `BROKER`, `TECHNOLOGY`. Bilinmeyen modelin oranları otomatik sanayi modeli sayılmaz.

`presentation` zorunlu alanları:

- `schemaVersion=1` (number).
- String: `id`, `assetId`, `symbol`, `isin`, `market`, `sector`, `contentKey`, `asOf`, `retrievedAt`, `timezone`, `financialPeriod`, `priceAt`.
- `id` ve kök `version` için aynı benzersiz rapor kimliğini kullanın. Yeni dönem veya revizyonda yeni `version` önerilir. `revision` isteğe bağlı pozitif tamsayıdır.
- `asOf`, `retrievedAt`: YYYY-MM-DD; `timezone`: örneğin Europe/Istanbul. Fiyat verisi yoksa `priceAt` boş stringdir; fiyat uydurulmaz.
- `contentKey`: uygulama çeviri anahtarı; harici raporda örneğin `externalResearch`. Şirket adını katalog `name`, sektörünü `sector`, faaliyet açıklamasını isteğe bağlı `businessDescription` string alanında verin. Yeni şirket için uygulamaya çeviri dosyası eklemek gerekmez; eksik yorumlar açık bırakılır.
- `status=PARTIAL`, `valuationStatus=NOT_ASSESSED`.
- `review`: `status=NEEDS_REVIEW`, `independent=false`, `key` string.
- Diziler: `sources`, `facts=[]`, `calculations=[]`, `debtLines=[]`, `coverage=[]`, `disclosures=[]`.
- `disclosureScan`: `from`, `to` ISO tarihleri; `status=UNAVAILABLE`, `sourceId=""`, `pendingDates=[]` (tarama yapılmadıysa).

`contracts`, `calculations` ve `presentation.calculations` yalnızca yeni raporun **boş** dizileri olarak oluşturulabilir. Excel'den hesap tanımı veya hazır oran yüklenemez. Sunum olguları kaynak `facts` dizisinden türetilir. İsteğe bağlı `financialHistory` yıllık olgular için import sırasında oluşturulur. Kaynak JSON örneği gerekli bütün boş alanları gösterir.

## Finansal olgu, kaynak ve dönem

Her `facts/i` kaydı: `id`, `value`, `unit`, `period`, `sourceId`, `checkedAt`, `locator`, `verification`, `basis`. Ekonomik anlam için `metricKey` önerilir (`revenue`, `profit`, `ebitda` gibi). Yeni dönemde eski olgunun dönemini değiştirmeyin; yeni olgu kimliği veya yeni rapor sürümü ekleyin.

`basis` zorunlu alanları:

- `currency` (TRY/USD vb.), `scale="1"`.
- `scope=CONSOLIDATED|SOLO|MARKET`.
- `attribution=GROUP|PARENT|SHARE`. Konsolide hasılat/FAVÖK GROUP; ana ortaklık net kârı PARENT.
- `accounting=TAS29|NOMINAL|IFRS`.
- `purchasingPowerDate`: TAS29 için açık ve geçerli YYYY-MM-DD; diğer bazlarda string veya null. Finansal dönem sonu ile aynı olduğu varsayılmaz, belgeden alınır.
- `start`, `end`: YYYY-MM-DD. `periodKind=INSTANT|H1|YTD|QUARTER|YEAR|TTM`. `YEAR` gerçek tam mali yıl olmalı; `fiscalYearStart` isteğe bağlı, takvim yılı dışı mali yıllar için yazılmalı.
- `shareBasis`: pay bazlı veride dolu string; diğer olgularda null.

`unit`: TRY, TRY_SHARE, USD, USD_SHARE, SHARES, USD_BARREL, PERCENT, MULTIPLE. Aktarılan hesaplanmış oranlar hesap motorunu geçersiz kılamaz.

Her `presentation.sources/i`: `id`, `title`, `url` (https), `publishedAt` (YYYY-MM-DD veya null), `period`, `locator`. Kesin yayımlanma tarihi bilinmiyorsa null bırakın; belgenin gerçekten görüldüğü tarihi **ayrı `observedAt`** alanına yazabilirsiniz. Bu tarih yalnızca muhafazakâr erişilebilirlik sınırıdır ve yayımlanma tarihi olarak gösterilmez. Kaynak kesin yayımlanma tarihine sahipse o tarih önceliklidir. Kaynak kimliği olgunun `sourceId` alanıyla eşleşmelidir.

Yeni/değişen olgular `UNVERIFIED`, rapor `NEEDS_REVIEW`, `independent=false` olur; kanıtlar bağımsız onay sayılmaz. Eksik kaynak/dönem/baz teknik hatadır. Eksik fiyat veya finansal girdi ilgili oranı eksik bırakır. TMS 29 ve dönem uyum kapıları import ile kaldırılmaz.

## SISE örneğinin kaynak ve kapsamı

[Şişecam 2025 yatırımcı sunumu](https://www.sisecam.com/en/s-investor-relations/InvestorPresentations/1.%20SISECAM%2012M%202025%20-%20INVESTOR%20PRESENTATION.pdf), s.33, 2025 sütunu: hasılat 224.527 milyon TL, ana ortaklık net kârı 9.878 milyon TL, FAVÖK 23.982 milyon TL. Hücreler tam TL'ye ×1.000.000 dönüştürülmüştür; kaynağın milyon TL yuvarlaması korunur. FAVÖK, düzeltilmiş FAVÖK değildir. Dönem 2025 tam yılı; TMS 29 satın alma gücü bazı 31.12.2025. Belge 26.10.2026 tarihinde gözlendi; kesin yayımlanma tarihi doğrulanmadığından null bırakıldı.

Kimlik: [KAP SISE/ISIN bildirimi](https://www.kap.org.tr/tr/api/BildirimPdf/1411658). Bu örnek kaynaklı gerçek tutarlar içerir; tam şirket araştırması veya bağımsız finansal denetim değildir. Fiyat, borç, nakit ve emsal bilgisi eklenmemiştir. Testler mevcut gerçek araştırma deposuna yazmaz.

## Kullanım ve doğrulama

Yerel kalıcı kayıt sunucusunu `INVESTULATOR_RESEARCH_WRITE=1` ile başlatın. Genel Import → URL'den Yükle → `/research/sise-import-test.xlsx` → ön izleme → açık onay. Başka şirketin kartından yüklemek kapsam hatasıdır. Yeni şirketin varlık kimliği `watch-bist-sise` olduğundan `newCompanyIds` bu kimliği içerir; sembol SISE'dir.

Doğrulama komutları (frontend dizininde):

```text
node node_modules/vitest/vitest.mjs run src/__tests__/lib/externalResearchWorkbook.test.ts
node scripts/test-external-import.mjs
node scripts/test-external-import.mjs --browser
```

Son komut, kurulu Chrome'u kendi geçici profiliyle headless açar; yalnızca 5198/9248 portlarını kullanır. Geçici depo yolu ve sonuçlar kökte `outputs/sise-integration-20261026/` altında raporlanır. Mevcut 5173 sunucusuna dokunulmaz. Kalıcı servis geliştirme ortamına özgüdür; production backend/API bu çalışmanın kapsamında değildir.
