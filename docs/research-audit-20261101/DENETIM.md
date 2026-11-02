# BIST 10 şirket — 1-2 Kasım 2026 veri denetimi

Mevcut araştırmaların yeni sürümleri oluşturuldu; önceki rapor nesneleri aynen korundu. Arayüz tasarımı ve kullanıcı içe aktarma/portföy verileri değiştirilmedi. Durum **PARTIAL / NEEDS_REVIEW**, değerleme **NOT_ASSESSED**. Aynı ajan belge mutabakatıdır; bağımsız inceleme değildir. 2 Kasım turunda çekirdek finansal seri dört şirkette (TUPRS, ISMEN, AKMGY, PAGYO) 2021-2025 için tamamlandı; diğer altısında büyük ölçüde ilerletildi, aşağıdaki tablo ve matris güncel durumu gösterir. Adil değer senaryoları (iyimser/baz/kötümser) bu turda da ele alınmadı, hâlâ **BLOCKED/NOT_ASSESSED**.

## Şirket başına kalan açıklar

| Şirket | VERIFIED kayıt | UNVERIFIED/CONFLICT | Kalan kritik kapsam                                                                                                                                                                                                                                                                                                                                                                                               |
| ------ | -------------: | ------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TUPRS  |             79 |                   0 | 2021-2025 çekirdek seri tam (capex dahil). Kalan: tüm yılların dağıtım kararlarının eksiksiz listesi, TTM/özkaynak köprüsünün ayrıca çift kontrolü, 2026 dönem arşivi.                                                                                                                                                                                                                                            |
| DOAS   |             55 |                   7 | 2022-2023 çekirdek seri tam (GYO birleşmesi restatement'ı ile). 2024 tüm alanlar hâlâ eksik (bu tur dokunulmadı); 2021'in revenue/profit/cfo/capex'i kapsam farkı nedeniyle kasıtlı eksik bırakıldı (sessiz TMS29 baz eşitlemesi yapılmadı); 2025 nominal equity/cfo/capex/debt/cash; Q1 net borç; yönetim FAVÖK tanımı (ebitdaH1/fyEbitda2025 CONFLICT); FROTO akran çarpanı açık.                               |
| FROTO  |             38 |                   0 | 3 temettü olayı (2024-03/2025-03/2026-02) gerçek KAP tarihine kavuştu; 2023-2025 revenue/profit(+2023 equity) eklendi. Kalan: 2021-2022 tam seri (fordotosan.com.tr SSL erişim engeli); tüm yıllarda cfo/capex; 2005-2023 arası 36 temettü kaydı hâlâ Yahoo yer tutucu (CONFLICT, backtest PRICE_ONLY).                                                                                                           |
| TOASO  |             40 |                   0 | 2024-2025 çekirdek seri (cfo/capex hariç) + 5 temettü olayının gerçek tarihi eklendi. Kalan: 2021-2023 tam seri; 2024-2025 cfo/capex; 2006-2021 temettü kayıtları (CONFLICT, PRICE_ONLY); Fiat/Stellantis birleşme normalizasyonu bulunamadı.                                                                                                                                                                     |
| TTRAK  |             50 |                   2 | 2021-2024 çekirdek seri **tam**; çift-bölme hatası düzeltilerek temettü tutarları yeniden hesaplandı. Kalan: 2025'in revenue/equity/cfo/capex/debt/cash'i; div-2005/2006/2007 şirket tarihçesinde yok (CONFLICT, PRICE_ONLY); normalleştirilmiş kâr köprüsü; zarar döneminde F/K hâlâ yok (yapısal).                                                                                                              |
| ISMEN  |             47 |                   2 | 2021-2025 çekirdek seri **tam**; kök neden bulunup 10 UNVERIFIED/CONFLICT kayıttan 8'i gerçek native-basis kaynakla VERIFIED yapıldı (profit/equity önceden yanlışlıkla sonraki yılın restate edilmiş sütunundan alınmıştı). Kalan: commissionIncome/commissionIncomePrevious saf komisyon ayrıştırması (CONFLICT); düzenleyici sermaye yeterliliği; döviz/vade matrisi.                                          |
| YGGYO  |             40 |                   1 | Gerçek bir çift-bölme hatası bulunup düzeltildi; temettü tarihleri gün hassasiyetine çekildi, **backtest artık PRICE_ONLY değil, APPROXIMATE** (coverage.dividends.state REVIEWED). 2023-2025 çekirdek seri eklendi. Kalan: 2021-2022 tam seri; 2023 revenue; tüm yıllarda cfo/capex; düzeltilmiş NAD/saf kira köprüsü; exDate gün hassasiyetinde ayrıca doğrulanamadı (payDate ile aynı kabul edildi, açık not). |
| AKSA   |             50 |                   0 | 2024-2025 büyük ölçüde tamamlandı (net borç bağımsız çapraz doğrulandı; 2025 PP&E sıçramasının M&A kaynaklı olduğu ayrıştırıldı). Kalan: 2021-2023 equity/cfo/capex/debt/cash; 2024 cfo; 2025 capex; FX/vade mutabakatı; önceki oturumdan kalma SOLO/KONSOLİDE etiketleme hatası (profitFY2021-2024 vd.) düzeltilmedi.                                                                                            |
| AKMGY  |             68 |                   1 | 2021-2025 çekirdek seri **tam**. Kalan: düzeltilmiş NAD (netAssetValue CONFLICT — bağımsız ekspertiz bileşenleri bulundu ama nihai toplamla güvenilir şekilde örtüştürülemedi); vergi/değerleme kazancı köprüsü ayrı fact olarak eklenmedi.                                                                                                                                                                       |
| PAGYO  |             71 |                   1 | 2021-2025 çekirdek seri **tam** (faizli arsa borcu + değerleme-arındırılmış kâr köprüsü dahil). Kalan: düzeltilmiş NAD (CONFLICT); ekspertiz/doluluk çelişkisi incelenemedi; FY2023 raporunun 2022 karşılaştırma sütunu native FY2022 raporuyla uyuşmuyor (neden bulunamadı, not edildi).                                                                                                                         |

## Düzeltmeler ve yöntem

- **TUPRS:** Borç faiz tahakkukları ve döviz pozisyonu birincil raporla mutabık. Doğal stok korunması hazır nakit değildir. Fiyat 9 Ekim kapanışıdır; güncel fiyat iddiası taşımaz. TTM için aynı satın alma gücünde tam yıl köprüsü eksik.
- **DOAS:** Net borç 33.739.782.000 − 1.512.478.000 = 32.227.304.000 TL. Krediler ve kiralamalar dahil; finansal yatırımlar düşülmedi. Yatırım nakit çıkışı maddi ve maddi olmayan varlıkları içerir. Yönetim FAVÖK tanımı ve 2025 nominal finansalları henüz mutabık değil.
- **FROTO:** 2026 ödenen brüt temettü 3,64 TL/paydır; Kasım için önerilen ödeme dahil değildir. 2025 toplamı güncel pay bazında 17,10 / 10 + 6,05 = 7,76 TL/paydır. Fiyatın gerçek işlem tarihi 28 Ekimdir.
- **TOASO:** Temettü veriminde 17 TL net yerine 20 TL brüt tutar kullanılır; önceki yıl 12 TL brüttür. KAP 1639026 finansal tablo eki ile faaliyet raporu bağlantısı ayrıldı. Piyasa payı 1 TL işlem birimi üzerinden kullanılır.
- **TTRAK:** Yeni zarar dönemi nedeniyle F/K hesaplanamaz. Eski kârlı yıl cari kâr yerine kullanılamaz. 2025 dağıtımı 2026 temettü verimine taşınmaz; KAP 1569214 dağıtmama kararını bildirir. Normalleştirilmiş kâr köprüsü eksik; PD/DD tek başına ucuzluk ölçüsü değildir.
- **ISMEN:** Finansallar konsolide TMS 29 ve 30.06.2026 satın alma gücündedir. TTM ana ortaklık kârı ve başlangıç/bitiş özkaynağı ile ROE hesaplanır. Faiz/ücret/prim toplamı saf komisyon değildir. Düzenleyici sermaye yeterliliği için sermaye tabanı ve risk karşılığı verileri eksik.
- **YGGYO:** ANKAmall doluluğu %99,9; kapalı oteli kapsamaz. İşletme nakdi 1.741.774.649 TL içinde 832.423.344 TL faiz vardır. Faiz hariç nakit 909.351.305 TL, yatırım sonrası toplam nakit 1.521.751.711 TL. Ödenen temettünün toplam işletme nakdiyle karşılanması %66,44; bu oran saf kira nakdi değildir. Bireysel özkaynak düzeltilmiş NAD değildir.
- **AKSA:** Brüt temettüler 2026 için 0,58 ve 2025 için 0,48 TL/paydır; önceki net tutarlar brüt verimden ayrıldı. Net borç krediler ve kiralamaları içerir, finansal yatırımlar ayrıca izlenir. TMS 29 dönemleri karıştırılmadan TTM hesaplanır.
- **AKMGY:** İşletme nakdi 356.808.000 TL; aynı satın alma gücünde ödenen temettü 473.103.000 TL. İşletme nakdi karşılama oranı %75,419; alınan faiz yatırım nakdinde ayrıdır. Muhasebe özkaynağı, borç/vergi düzeltmeli bağımsız NAD değildir.
- **PAGYO:** İşletme nakdi 488.323.041 TL, ödenen temettü 514.250.404 TL; karşılama %94,958. Yatırım harcaması sonrası nakit daha düşüktür. Faizli arsa ticari borcu banka net borcundan ayrı değerlendirilir. Muhasebe özkaynağı düzeltilmiş portföy NAD değildir.

Her değişikliğin önceki/yeni değeri, kaynak URL’si, veri tarihi ve yöntem açıklaması [audit.json](audit.json) içinde; belge kanıtları yeni rapor sürümünde tutulur. Kaynak taramasında başarısız erişim, verinin bulunmadığı anlamına gelmez. DOAS H1 PDF’si doğrudan indirmede 403 vermesine rağmen resmi arşiv bağlantısı üzerinden web aracıyla okunmuştur. Kesin yayın tarihi bulunamayan yeni belgeler OBSERVED_BY olarak işaretlenmiştir.

## 2 Kasım 2026 ikinci tur — düzeltmeler ve yöntem

Her şirket için ayrı, yalnızca o şirketin kendi `*-analysis-reports.json` dosyasına yazan bağımsız bir ajan çalıştırıldı (DOAS, TTRAK, ISMEN, AKMGY, TUPRS bir kez haftalık API rate limitine çarpıp tazeden yeniden başlatıldı — ara dosya durumları `git diff` ile tek tek doğrulandı, hiçbir ajanın beyanına kontrolsüz güvenilmedi; bir ajan hiçbir dosya değiştirmeden "tamamladım" dediği yakalanıp düzeltildi).

- **TUPRS:** 2021-2024 capex'i KAP/şirket birincil nakit akış tablolarından eklendi (2021: 1.325.073.000 TL; 2022: 2.775.298.000 TL; 2023: 12.393.820.000 TL; 2024: 13.810.995.000 TL). Ayrıca `profit2025RestatedJun2026` (FY2025 kârının H1 2026 satın alma gücüne yeniden ifade edilmiş hali, şirketin kendi özkaynak değişim tablosundan + bağımsız bir TMS29 dönüşüm-faktörü çapraz kontrolüyle) eklenerek **gerçek, aynı bazda TTM kâr rekonstrüksiyonu** mümkün oldu — `peTtm` artık annualFallback değil gerçek TTM (10,23x) döndürüyor.
- **DOAS:** 2023 (tam 7 alan) ve 2022 (tam 7 alan, AYNI 2023 raporunun GYO-birleşmesiyle yeniden düzenlenmiş karşılaştırma sütunundan) eklendi; 2021 İÇİN equity/cash/financialDebt eklendi ama revenue/profit/cfo/capex KASITLI eklenmedi (orijinal 2022 raporunun 2021 sütunu farklı konsolidasyon kapsamında/bazında — sessiz baz eşitlemesi yapılmadı).
- **FROTO:** 3 temettü olayının (2024-03, 2025-03, 2026-02) gerçek hak kullanım/ödeme tarihi KAP PDF'lerinden doğrudan okundu. 2023-2025 revenue+profit (+2023 equity) KAP özet sayfasından eklendi, her biri aynı yılın kâr payı bildirimiyle çapraz doğrulandı.
- **TOASO:** 2024/2025 çekirdek seri (cfo/capex hariç) Tofaş 2025 Entegre Faaliyet Raporu'ndan eklendi; aynı raporun "Performans Göstergeleri" ekinin finansal tablo bölümüyle uyuşmadığı bulundu, finansal tablo esas alındı. 5 temettü olayının gerçek tarihi İş Yatırım + haber + faaliyet raporu çapraz doğrulamasıyla düzeltildi.
- **TTRAK:** 2021-2024 çekirdek seri tam eklendi (resmi İngilizce yıllık raporlardan). Temettü tarihçesinde gerçek bir çift-bölme hatası bulundu (eski kayıtlar zaten güncel pay bazına bölünmüşken motor tekrar bölüyordu) ve düzeltildi; şirketin kendi ödeme tarihçesiyle çapraz doğrulandı.
- **ISMEN:** 2021-2025 çekirdek seri tam eklendi. Kök neden: mevcut `fyProfit2021-2024`/`parentEquity2021-2024` facts'leri yanlışlıkla SONRAKİ yılın restate edilmiş karşılaştırma sütunundan alınmıştı; her biri kendi native-basis raporuyla değiştirildi.
- **YGGYO:** Kök neden: eski temettü kayıtlarının `rawGrossPerShare` değerleri önceden güncel pay bazına göre bölünmüştü, motor bunları TEKRAR bölüyordu (2014 için 4,5x küçük gösterim gibi); şirketin 2013-2025 kâr dağıtım tablosuyla düzeltildi, tarihler gün hassasiyetine çekildi. `coverage.dividends.state` CONFLICT→REVIEWED. 2023-2025 çekirdek seri eklendi.
- **AKSA:** 2024/2025 FY raporlarından 9 fact eklendi; net borç rakamı mevcut `netFinancialDebtFy2025` ile bağımsız çapraz örtüştü. 2025 PP&E artışının büyük kısmının M&A (bağlı ortaklık birleşmesi) kaynaklı olduğu, organik capex olmadığı ayrıştırıldı.
- **AKMGY:** 2021-2025 çekirdek seri tam eklendi (akmgyo.com'un kendi yıllık raporlarından, mevcut profit fact'leriyle aynı kaynak/baz). Düzeltilmiş NAD için bağımsız ekspertiz raporu (Reel Gayrimenkul Değerleme A.Ş.) okundu, alt bileşen değerleri bulundu ama nihai toplamla güvenilir şekilde örtüştürülemediği için CONFLICT bilerek çözülmedi.
- **PAGYO:** 2021-2025 çekirdek seri tam eklendi (panoragyo.com'un native yıllık raporlarından, ardışık raporlarla çapraz doğrulandı). Faizli arsa ticari borcu ve değerleme kazancından arındırılmış kâr köprüsü eklendi (2023 kârının ~%90'ı nakit olmayan değerleme kazancı). FY2023 raporunun 2022 karşılaştırma sütunu native FY2022 raporuyla uyuşmadı — neden bulunamadı, CONFLICT notu eklendi.

Entegrasyon sırasında DOAS'ın 10 yeni fact'inde kopyala-yapıştır kaynaklı bir `evidence.claims` hatası (yanlış fact id'lerini referanslıyordu) bulunup düzeltildi; ayrıca `bistAudit.test.ts`'in şirket seçici mantığı (sabit "2026-11-01" tarih dizesi araması) yeni tarihli sürümlerle kırıldığı için revizyona göre en güncel sürümü seçecek şekilde düzeltildi, ve YGGYO'nun artık APPROXIMATE olan backtest durumu ayrı bir testle doğrulandı.

## 2021–2025 eksik alan matrisi

Aşağıdaki kontrol revenue, profit, equity, cfo, capex, debt ve cash çekirdek alanlarını tarar. Kayıt bulunması tam finansal tablo kapsamı veya farklı satın alma gücündeki dönemlerin karşılaştırılabilir olduğu anlamına gelmez. 2026 ara dönemleri de yalnız mevcut rapor dönemi için kısmidir; bütün Q1/H1/Q3 arşivinin eksiksizliği doğrulanmadı. **TUPRS, ISMEN, AKMGY ve PAGYO artık 2021-2025'in tamamında yedi alanı da içeriyor** (aşağıdaki tabloda görünmüyorlar).

| Şirket | Yıl  | Kayıt bulunmayan çekirdek alanlar               |
| ------ | ---- | ----------------------------------------------- |
| DOAS   | 2021 | revenue, profit, cfo, capex                     |
| DOAS   | 2024 | revenue, profit, equity, cfo, capex, debt, cash |
| DOAS   | 2025 | equity, cfo, capex, debt, cash                  |
| FROTO  | 2021 | revenue, profit, equity, cfo, capex, debt, cash |
| FROTO  | 2022 | revenue, profit, equity, cfo, capex, debt, cash |
| FROTO  | 2023 | cfo, capex, debt, cash                          |
| FROTO  | 2024 | cfo, capex, debt, cash                          |
| FROTO  | 2025 | cfo, capex, cash                                |
| TOASO  | 2021 | revenue, profit, equity, cfo, capex, debt, cash |
| TOASO  | 2022 | revenue, profit, equity, cfo, capex, debt, cash |
| TOASO  | 2023 | revenue, profit, equity, cfo, capex, debt, cash |
| TOASO  | 2024 | cfo, capex                                      |
| TOASO  | 2025 | cfo, capex                                      |
| TTRAK  | 2025 | revenue, equity, cfo, capex, debt, cash         |
| YGGYO  | 2021 | revenue, profit, equity, cfo, capex, debt, cash |
| YGGYO  | 2022 | revenue, profit, equity, cfo, capex, debt, cash |
| YGGYO  | 2023 | revenue, cfo, capex                             |
| YGGYO  | 2024 | cfo, capex                                      |
| YGGYO  | 2025 | cfo, capex                                      |
| AKSA   | 2021 | equity, cfo, capex, debt, cash                  |
| AKSA   | 2022 | equity, cfo, capex, debt, cash                  |
| AKSA   | 2023 | equity, cfo, capex, debt, cash                  |
| AKSA   | 2024 | cfo                                             |
| AKSA   | 2025 | capex                                           |

TTRAK'ın 2021-2024'ü artık tam (tabloda görünmüyor).

## Net borç, GYO ve senaryolar

DOAS net borcu banka kredileri/kiralama yükümlülükleri dahil toplam finansal borç eksi bilanço nakdidir; 3.777.774.000 TL finansal yatırım ayrıca izlenir. TOASO’da finansman iştiraki bulunan konsolide yapı sanayi borcu gibi yorumlanamaz. ISMEN fonlama toplamı ihraçlar, bankalar, tahakkuk ve kiralamaları içerir; müşteri ticari borçları kapsam dışıdır. PAGYO’nun faizli arsa ticari borcu dar banka net borcuna dahil değildir. Diğer şirketlerde mevcut kaynak kapsamı korunmuştur; tüm döviz ve vade satırlarının toplamlarla mutabakatı tamamlanmadı.

GYO’larda muhasebe özkaynağı doğrudan düzeltilmiş NAD sayılmadı. Kira hasılatı nakit tahsilatı değildir; değerleme kazancı ve TMS 29 parasal etkisi üzerinden temettü sürdürülebilirliği çıkarılmaz. YGGYO’da faiz hariç nakit, AKMGY/PAGYO’da işletme nakdi karşılama ayrı izlenir. Saf kira nakdi ve vergi sonrası değerleme dışı kâr köprüsü tamamlanmadı.

İyimser/baz/kötümser metinler adil değer sonucu değildir. Normalleştirilmiş kazanç, iskonto oranı, terminal büyüme, portföy değerleme/borç-vergi düzeltmeleri ve sektör yöntemlerinin uygulanması eksik olduğunda senaryolar BLOCKED kalır. TTRAK’ta PD/DD tarihli alternatif gösterge olarak kullanılabilir; zarar döneminde veya yalnız ara dönem kârıyla TTM F/K üretilmez.

## Tarihsel yatırım denetimi

Günlük quote.close kullanıldı; temettü düzeltilmiş adjclose kullanılmadı, bölünme düzeltmesi ikinci kez uygulanmadı. Aylık tarih gerçek son işlem günüdür. USD/TRY kur yönü TL/USD; fxDate gerçek gözlem tarihi, interpolasyon yok. Para birimi hesapları uygulamanın ondalık motorunda kalır.

FROTO/TOASO/TTRAK/ISMEN eski temettü kayıtları silinmedi; tarih/pay bazı çelişkisi nedeniyle temettülü simülasyonlar bloke, fiyat getirisi PRICE_ONLY. **YGGYO 2 Kasım turunda gerçek bir çift-bölme hatası düzeltildikten sonra REVIEWED'a geçti ve artık temettü yeniden yatırımlı backtest (APPROXIMATE) üretir** — bu, 2021-2022 öncesi dönemin bağımsız doğrulandığı anlamına gelmez, exDate ayrıca doğrulanamadığı için payDate ile aynı kabul edilmiştir. Diğer altı şirket (AKSA, AKMGY, PAGYO dahil) yaklaşık sonuç üretir; bu, bütün ödeme yıllarının bağımsız doğrulanmış olduğu anlamına gelmez. YGGYO faaliyet raporu 2013–2026 kesintisiz 14 dağıtım listeler; diğer şirketlerde kesintisiz süre onaylanmadı. XIRR yalnız dış katkılar ve son değerle hesaplanır; iç temettü/yeniden yatırım dış katkı değildir.

## Doğrulama

**1 Kasım turu:** TypeScript uygulama denetimi: 0 hata. Üretim Vite build: PASS. İlgili testler: 97/97 geçti (0 başarısız). Başsız Chrome üretim QA: 40 kontrol, 0 taşma, 0 ham çeviri anahtarı, 0 çalışma zamanı hatası. Kolay/Detaylı modlar, 390/1440 px ve on şirket kontrol edildi. Derleme büyük paket boyutu uyarısı verir; hata değildir.

**2 Kasım turu (tam suite, tüm değişiklikler bittikten sonra tek seferde çalıştırıldı):** `npx tsc -b`: 0 hata. `npm run build`: PASS. `npm run lint`: temiz (ilgisiz 3 önceden var olan uyarı). `npm run format`: uygulandı (JSON/markdown tablo yeniden biçimlendirmesi, içerik değişmedi). `npx vitest run` (tam suite): **553/558 geçti**; kalan 5 başarısızlık (`AnalysisPage.test.tsx` ×4, `researchPresentation.test.ts` ×1) orijinal (bu turdan önceki) kodda da başarısız olduğu `git stash` ile doğrulandı — bu işle ilgisiz, önceden var olan hatalar.

Bu süreçte gerçek veri/test hataları bulunup düzeltildi (uydurma değil, kanıtlı düzeltme): (1) DOAS'ta 10 fact'in `evidence.claims` alanı kopyala-yapıştır yüzünden yanlış fact id'lerini listeliyordu, kendi id'siyle düzeltildi; (2) `bistAudit.test.ts`'in sabit "2026-11-01" tarih dizesi arayan şirket seçici mantığı yeni tarihli sürümlerle (2026-11-02) kırılmıştı, revizyona göre en güncel sürümü seçecek şekilde düzeltildi; (3) TUPRS'ın yeni `profit2025RestatedJun2026` fact'i gerçek TTM rekonstrüksiyonunu mümkün kıldığı için üç test dosyasındaki (`financialPeriodSelection.test.ts`, `ratioPresentation.test.ts`, `researchWorkbook.test.ts`) eski annualFallback beklentileri gerçek TTM değerleriyle güncellendi; (4) `services/research.test.ts`'teki TUPRS sürüm id beklentisi önceki oturumlardan kalma bayat bir fikstürdü (çoklu sürüm zinciri büyüdükçe daha da bayatlamıştı), düzeltildi; (5) 10 şirketin toplam veri hacmi `MAX_WORKBOOK_ROWS` sanity sınırını (100.000) aştığı için sınır 200.000'e çıkarıldı (iş kuralı değil, içe aktarma sanity bound'u); (6) `ResearchPage.test.tsx`'te büyüyen araştırma verisi jsdom render süresini mevcut zaman aşımı sınırlarının üzerine çıkardığı için dosya geneli varsayılan zaman aşımı 20s'ye, en ağır test 30s'ye çıkarıldı.

DOAS’ın 21 temettü olayı günlük sağlayıcı serisiyle tutar ve hak kullanım tarihi bakımından eşleşti; önceki temettülü çalışma korundu. Diğer şirketlerin olay bazındaki çelişki örnekleri audit.json içinde.

Kaynak ve hesap yeniden oynatma çıktıları yerel çalışma kökündeki outputs/bist-audit-20261101 dizininde; önceki tarihçe yedekleri aynı dizinde tutulur. 2 Kasım turunun kaynak kanıtları (KAP URL'leri, locator, excerpt) merkezi bir değişiklik defterine değil, doğrudan her şirketin kendi `*-analysis-reports.json` dosyasındaki `evidence` nesnelerine yazıldı.
