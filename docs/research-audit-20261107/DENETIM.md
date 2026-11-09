# 7 Kasım 2026 — bağımsız değerleme denetimi

İnceleyen: Codex. Kapsam: `dev` dalındaki 10 BIST şirketinin yeni değerleme senaryoları; önceki senaryoları yazan oturumdan ayrı inceleme. Bu, bütün araştırma raporlarının veya tarihsel yatırım simülasyonlarının yeniden onayı değildir. Denetim tarihi 07.11.2026; aşağıdaki değerleme tarihleri önceki modellerin tarihleridir. Yeni fiyat hedefi üretilmedi.

## Karar

**Mevcut fiyat hedeflerinden hiçbiri finansal güvenilirlik bakımından PASS alamadı.** Yedi şirketin önceden hesaplanan 19 sonucu bağımsız tam sayı/rasyonel yöntemle tekrar üretildi; aritmetik tutarlı. Ancak aritmetik PASS, emsal/normalizasyon/tarih kabulü değildir. PAGYO'nun 31.12.2025 NAD köprüsü tarihli varlık hesabı olarak doğrulanabildi; güncel fiyat hedefi olarak kabul edilmedi.

| Şirket | Yeniden üretilen BEAR / BASE / BULL (TL, hedef değildir) | Varsayım incelemesi                          | Veri nedeniyle bloke                        | Açılma koşulu                                                   |
| ------ | -------------------------------------------------------- | -------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- |
| TUPRS  | 159,07 / 171,92 / 227,70                                 | Üçü NEEDS_REVIEW                             | Güncel normalizasyon/borç köprüsü yok       | CCS/düzeltilmiş FAVÖK, emsal kapsamı, tarih ve satın alma gücü  |
| DOAS   | 372,01 / 412,55 / 547,69                                 | Üçü NEEDS_REVIEW                             | Karşılaştırılabilir emsal seti yok          | Distribütör emsali; stok finansmanı, kiralama ve iştirak ayrımı |
| FROTO  | 109,18 / 136,89 / 226,19                                 | Üçü NEEDS_REVIEW                             | Düzeltilmiş OEM emsal köprüsü yok           | Sanayi/finansman borcu ayrımı, büyüme ve ülke riski             |
| TOASO  | 58,60 / 102,60 / 168,60                                  | Üçü NEEDS_REVIEW                             | Normalleştirilmiş birleşme sonrası veri yok | Stellantis kapsamı, finansman iştiraki, hassas FAVÖK            |
| AKSA   | 2,56 / 7,91 / 19,79                                      | Üçü NEEDS_REVIEW                             | Segment ağırlıklı değerleme yok             | Akrilik/karbon elyaf ayrımı, satın alma etkileri                |
| ISMEN  | 10,73 / 11,87 / 20,73                                    | Üçü NEEDS_REVIEW                             | Gerçek düzenleyici sermaye yeterliliği yok  | Sürdürülebilir ROE, tutarlı Ke/g ve sermaye tabanı              |
| PAGYO  | — / 174,42 / —                                           | Baz NEEDS_REVIEW; tarihli NAD hesabı tutarlı | BEAR/BULL BLOCKED                           | Güncel ekspertiz/borç/temettü ve kaynaklı duyarlılık            |
| TTRAK  | — / — / —                                                | Sayısal senaryo yok                          | Üçü BLOCKED                                 | Çevrim ortası FAVÖK ve tutarlı TTM/net borç                     |
| AKMGY  | — / — / —                                                | Sayısal senaryo yok                          | Üçü BLOCKED                                 | Ekspertizden şirket payına, borç/vergiye NAD köprüsü            |
| YGGYO  | — / — / —                                                | Sayısal senaryo yok                          | Üçü BLOCKED                                 | AVM + otel bağımsız değerleri ve NAD mutabakatı                 |

`NEEDS_REVIEW` kararları da motorun fiyat hedefi üretmesini **BLOCKED / REVIEW_REQUIRED** ile durdurur. Eksik verili üç şirkette mevcut engeller korundu. PAGYO'nun boş BEAR/BULL varsayımlarına baz değer kopyalanmadı.

## Tarihler ve fiyat kontrolü

On fiyatın tamamı Yahoo günlük `quote.close` uç noktasından yeniden çekildi; iki ondalıkta birebir eşleşti. Bu aynı sağlayıcıya karşı yeniden doğrulamadır, bağımsız ikinci piyasa sağlayıcısı değildir. İstek URL'leri ve ham kayan noktalı kapanışlar [price-checks.json](price-checks.json) içinde. Fiyatlar güncel fiyat diye yenilenmedi.

| Şirket | Model değerleme tarihi  | Referans fiyat / işlem günü | Modelin finansal dönemi ve stok tarihi | Raporda bulunan daha yeni dönem |
| ------ | ----------------------- | --------------------------- | -------------------------------------- | ------------------------------- |
| TUPRS  | 07.11.2026              | 386,25 / 09.10.2026         | FY2025; 31.12.2025                     | H1 2026                         |
| DOAS   | 06.11.2026              | 134,30 / 27.10.2026         | FY2025; 31.12.2025                     | H1 2026                         |
| FROTO  | 05.11.2026              | 69,20 / 28.10.2026          | TTM 01.07.2025–30.06.2026; 30.06.2026  | H1 2026                         |
| TOASO  | 05.11.2026              | 211,20 / 30.10.2026         | FY2025; 31.12.2025                     | H1 2026                         |
| AKSA   | 06.11.2026              | 9,99 / 30.10.2026           | FY2025; 31.12.2025                     | H1 2026                         |
| ISMEN  | 06.11.2026              | 25,22 / 30.10.2026          | TTM 01.07.2025–30.06.2026; 30.06.2026  | H1 2026                         |
| PAGYO  | 06.11.2026              | 113,00 / 30.10.2026         | NAD 31.12.2025                         | H1 2026                         |
| TTRAK  | Yok; denetim 07.11.2026 | 341,75 / 28.10.2026         | Sayısal model yok                      | 9A 2026                         |
| AKMGY  | Yok; denetim 07.11.2026 | 176,40 / 30.10.2026         | Sayısal model yok                      | H1 2026                         |
| YGGYO  | Yok; denetim 07.11.2026 | 189,20 / 28.10.2026         | Sayısal model yok                      | H1 2026                         |

TAS29 tutarlarının satın alma gücü tarihleri finansal dönemin sonudur (ISMEN/FROTO 30.06.2026, FY modelleri 31.12.2025). Emsal çarpanı boyutsuz olsa da geçmiş reel TL kazancıyla yeni nominal TL fiyatının karşılaştırılması kendiliğinden geçerli olmaz. Finansal dönem sonu, yayımlanma, erişim ve değerleme tarihleri ayrı alanlar olarak [arithmetic-and-dates.json](arithmetic-and-dates.json) dosyasında korunur. `publishedAt` kayıtlarının tamamı bu tur bildirim numarası düzeyinde yeniden doğrulanmadı; kaynakta okunan dönem doğrulandı, kesin yayın saati doğrulanmayanlar eski kanıt kaydıdır. Tüm şirketler için 7 Kasım itibarıyla en son KAP bildirimlerinin eksiksiz tarandığı iddia edilmez; güncellik kabulünün açık kalmasının nedenlerinden biri budur.

## TUPRS — major: normalize edilmemiş kazanç, emsal kapsamı ve tarih

Bağımsız hesap: `(56.272.759.000 × 5,15 + 41.455.028.000) / 1.926.795.598 = 171,92 TL`; 386,25 TL'ye göre −%55,5. Negatif net borç doğru biçimde **ekleniyor**; işaret hatası yok. Pay başına yaklaşık 150,40 TL işletme değeri ve 21,52 TL net nakit vardır.

[2025 finansal raporunda](https://www.tupras.com.tr/assets/uploads/financial-reports/tupras-consolidated-cmb-31122025.pdf) faaliyet kârı 41.646.897 ve amortisman 14.625.862 bin TL; toplamları 56.272.759 bin TL. Bu toplama, rafineri döngüsü/stok etkileri arındırılmış normalleştirilmiş FAVÖK olduğunu kanıtlamaz. Aynı belgede Not 29 net borç köprüsü 50.249.485 − 91.704.478 − 35 = −41.455.028 bin TL; kendi tanımı içinde tutarlı. Grup FAVÖK'ünden ana ortaklık değerine geçerken azınlık payları/işletme dışı varlıklar ayrıca mutabık değil.

[Nisan 2026 şirket sunumu, s.24–25](https://www.tupras.com.tr/assets/uploads/investor-relations/presentation/investor-presentation-april-2026.pdf) FY2025 FAVÖK 64.457 milyon, CCS FAVÖK 60.517 milyon TL ve farklı net nakit KPI'ı gösteriyor. Tanım farkı kapatılmadan bunlar eski girdinin yerine konamaz. Yalnız duyarlılık için eski net nakit ve 5,15x korunup bu FAVÖK'ler kullanılırsa 193,80 ve 183,27 TL çıkar: farkın tamamı FAVÖK tanımından açıklanmıyor. Bunlar düzeltilmiş hedef değildir.

Kaydedilen VLO 4,71x / MPC 5,15x / PSX 7,06x, erişilen [VLO](https://stockanalysis.com/stocks/vlo/statistics/), [MPC](https://stockanalysis.com/stocks/mpc/statistics/), [PSX](https://stockanalysis.com/stocks/psx/statistics/) sayfalarında aynı. Fiyat gözlemleri 6 Kasım ABD kapanışı, erişim 7 Kasım; çarpanlar TTM. Rafineri/pazarlama/midstream/kimya karışımı ve konsolide borç/azınlık kapsamları eşitlenmemiş. MPC ortancasını baz seçmek ekonomik normalizasyon değildir. Düşük çarpan yüksek çevrimsel kazançtan da kaynaklanabilir; ülke riski için otomatik iskontonun miktarı uydurulamaz.

Ters hesap: mevcut FY2025 girdileriyle 386,25 TL'nin ima ettiği çarpan **12,49x**; 5,15x sabitken gereken FAVÖK **136,46 milyar TL**. Bu aralık bir varsayım uyuşmazlığı teşhisidir, piyasanın yanlış fiyatladığının kanıtı değildir.

## DOAS — critical: genel perakende çarpanından güvenilir hedef çıkarılması

`(14.864.838.000 × 7,8 − 25.184.576.000) / 220.000.000 = 412,55 TL`; 134,30'a göre +%207,2 aritmetik olarak doğru. [Siblis perakende tablosu](https://siblisresearch.com/valuation-multiples-by-industry/retail/) gerçekten 30.09.2026 için 7,2 / 7,8 / 9,8x verir; sorun rakamın varlığı değil, distribütöre uygunluğu. Sektör alt grupları, ülke riski, stok kredileri ve kiralamalar eşitlenmemiştir.

[DOAS faaliyet raporu](https://www.dogusotomotiv.com.tr/newdogusotomotiv_files/2026227203658243_DOAS_FR_2025_TR.pdf) arama indeksinde 14.864.838 bin TL FAVÖK'ü doğruluyor; tam dosya web boyut sınırı ve doğrudan indirmede 403 verdi. [Dipnotlu finansal raporun](https://www.dogusotomotiv.com.tr/newdogusotomotiv_files/2026227202929827_DOAS_31_12_2025_Finansal_Rapor.pdf) indekslenen sermaye yönetimi tablosu 30.740.328 borç − 5.555.752 nakit = 25.184.576 bin TL net borcu açıklıyor. Önceki “borç tanımı açıklanmamış” iddiası bu kapsamda doğru değil; tam kredi/kiralama/iştirak mutabakatı yine açık. FY2025 ham FAVÖK'ü üç senaryoda sabit tutmak normalizasyon değildir. H1 borcunun nominal farkı da TAS29 tarih köprüsü olmadan ekonomik borç artışı diye yorumlanamaz.

Doğrudan faaliyet emsali olarak [Inchcape](https://www.inchcape.com/en/news-and-insights/2026/full-year-2025-results) incelendi: otomotiv dağıtımı, FY2025 %6,2 faaliyet marjı, kiralama hariç 0,4x borç/FAVÖK. [H1 2026](https://www.inchcape.com/en/investors) kiralama hariç net borç 329 milyon GBP ve 0,5x kaldıraç bildiriyor. [Stock Analysis](https://stockanalysis.com/quote/lon/INCH/statistics/) ise 6,83x FD/FAVÖK ve 4,70x **brüt** borç/FAVÖK gösteriyor. Net/brüt, kiralama ve stok finansmanı farkları çözülmeden bu oranlar aynı seri sayılamaz.

Yalnız teşhis amaçlı 6,83x'i eski DOAS girdilerine uygulamak 347,01 TL verir; hâlâ yüksek olması hedefi doğrulamaz. Eski fiyatın ima ettiği çarpan 3,68x. Tek, daha yakın emsal bulmak yeterli değildir: aynı tarihli EV, borç/kira/stok finansmanı, TTM FAVÖK, iştirak/GYO payları ve coğrafya farkları için köprü gerekir. Bu yüzden 412,55 TL geri çekildi; yerine kaynaksız daha düşük hedef konmadı.

## FROTO / TOASO / AKSA — major: emsal seçimi

**FROTO:** Şirket H1 2026 PDF'si sistem sertifika deposuyla indirildi; Not 2.3, 63.557.627 bin TL son dört çeyrek düzeltilmiş VAFÖK ve 111.981.980 bin TL net borcu (1,76x) doğruluyor. Yerel metin: çalışma kökü `outputs/valuation-froto.txt`. Kaynak URL'si matriste. Emsaller VW/Renault/Hyundai, sırasıyla 7,79/9,32/14,25x olarak kaydedilmiş; bu tur dinamik sayfalarda 7,77/9,33/14,02x görüldü. Sonraki fiyat hareketi eski gözlemi tek başına yanlışlamaz; eski tarihli EV/FAVÖK dökümü yoktur. [Renault resmi verileri](https://www.renaultgroup.com/en/finance/key-figures/) otomotiv net nakdini satış finansmanından ayrı sunar. Grup borcunu üretim borcu gibi aktarmak yanıltıcıdır. FROTO'nun ticari araç/ihracat sözleşmeleri, Ford/VW müşteri yoğunlaşması, Romanya yatırımı, kapasite devreye alma ve döviz/Türkiye riskleri için açık düzeltme yok; daha yüksek çarpan daha iyi senaryo kanıtı değildir.

**TOASO:** [2025 raporunda](https://storage.fintables.com/media/uploads/kap-attachments/TOFAS%20Faaliyet%20Raporu%202025.pdf) net borç 53.669.002 − 19.967.321 = 33.701.681 bin TL. Aynı raporda tüketici finansmanı alacakları bulunur; bu yüzden konsolide net borç tümüyle sanayi borcu değildir. FAVÖK girdisi 10,0 milyar TL yuvarlak. [Siblis](https://siblisresearch.com/valuation-multiples-by-industry/automobiles-components/) 6,3/8,5/11,8x değerleri 30.09.2026 tarihli geniş otomotiv+parça evrenine ait; “gelişen Asya” büyümesi Tofaş büyümesi değildir. Stellantis Türkiye devralması, kısmi/tam yıl konsolidasyon etkisi, ürün geçişi, yatırım ve işletme sermayesi normalize edilmeli; gerekirse sanayi ve finansman iştiraki ayrı değerlenmeli.

**AKSA:** [FY2025 Not 4](https://asset.aksa.com/media-data/docs/2026/02/20/aksa-akrilik-1225-spk-gdc0wqxw.pdf) 6.986.847 − 1.257.217 = 5.729.630 bin TL FVAÖK'ü doğrular. Düzeltilmiş bölüm FVAÖK'ünün 6.072.436'sı elyaf, yalnız 351.220'si ileri malzemedir. Aksa Carbon satın almasının kısmi yıl etkisi de açıklanır. Dolayısıyla [Hexcel'in havacılık ağırlığı](https://investors.hexcel.com/investor-relations/news/news-details/2026/Hexcel-Reports-2025-Fourth-Quarter-and-Full-Year-Results/default.aspx) için ödenen çarpanı bütün AKSA'ya uygulamak desteklenmez. SGL'nin grafit/karbon, Toray'ın çok segmentli kimya/elyaf karması da ayrı incelenmeli. Kaydedilen 5,44/9,07/17,12x bu tur 5,34/9,13/17,08x; tarihli arşiv eksik. Net borç/FVAÖK yaklaşık 3,70x; yüksek borç, ülke/kur riski ve yatırım gereksinimi tek bir yabancı büyüme primiyle örtülemez.

## ISMEN — major: ROE, Ke ve sermaye kapısı

[H1 2026 raporundaki](https://www.isyatirim.com.tr/tr-tr/bizi-taniyin/yatirimci-iliskileri/Yatirimci_Iliskileri_Belgeler/finansal-raporlar/2026/ISMEN_Finansal%20Tablolar_30Haziran2026.pdf) aynı satın alma gücü bazlı verilerle TTM kâr = 2.616.705 + 8.767.593 − 4.037.753 = 7.346.545 bin TL; ortalama ana ortaklık özkaynağı 34.359.982,5 bin TL; ROE %21,38. Aritmetik tutarlı; bu gelecekte sürdürülebilir ROE değildir. BEAR %20,69 ve BULL %34,68 kapanış özkaynağını, BASE ortalamayı kullanıyor. Ticaret/komisyon/faiz/tek seferlik kazançlar ve dağıtılabilir kâr normalizasyonu gerekli.

Ke = %33,02 TL devlet tahvili + %9,30 toplam ülke ERP, beta=1 ve ±3 puan tampon varsayımı. [Damodaran sayfası](https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/ctryprem.html) bu erişimde Türkiye için Şubat 2026 güncellemesi, %8,89 toplam ERP gösteriyor; kayıtlı Temmuz %9,30 sürümü doğrulanamadı. Bu farklı güncelleme dönemidir; %9,30'un kesin yanlışlığı değil doğrulama eksikliğidir. Devlet tahvilindeki temerrüt riskini risksiz oran diye alıp ülke primi eklemek çift sayım riski taşır. Nominal TL Ke, TAS29 kârlılığı ve beklenen enflasyon aynı bazda kurulmalıdır.

`P/B = ROE/Ke`, sıfır büyüme ve kazançların dağıtılabilirliği gibi kısıtlı varsayımların özel halidir; genel sürdürülebilir büyümede `(ROE−g)/(Ke−g)` ve yeniden yatırım ilişkisi gerekir. 92,77x = konsolide ana ortaklık özkaynağı / 380 milyon TL asgari sermaye eşiği; düzenleyici sermaye tabanı/risk karşılığı oranı değildir, solo/konsolide kapsam da eşit değildir. Kaynaklı bir sayının zorunlu kapıyı karşılaması ekonomik anlamını doğrulamaz. Üç hedef bu nedenle bloke.

## PAGYO — tarihli NAD doğrulanabilir, güncel hedef değil

[Bilanço](https://www.panoragyo.com/storage/pages/March2026/panora-gyo-31-12-2025-konsolide-rapor-final-g.pdf): 13.978.400.000 AVM + 2.296.320.000 arsa + 424.875.054 diğer varlık − 1.525.367.166 yükümlülük = 15.174.227.888 TL. Yükümlülüklere arsa ticari borcu ve ertelenmiş vergi dahil; tekrar düşülmez. 87 milyon paya bölünce **31.12.2025 için 174,42 TL**.

Yalnız bazın çalışmasının teknik nedeni BEAR/BULL `assumptions` dizilerinin boş olmasıdır; motor `ASSUMPTIONS` ile engeller. [AVM ekspertizinin](https://www.panoragyo.com/storage/pages/December2025/pagyo-2510089-panora-avm-2025.pdf) s.62 metninde %28 yanında %30 iskonto duyarlılığı da bulunuyor; “hiç kaynaklı alternatif yok” fazla kesin. Bunun net nakit akımları, terminal değeri ve dolulukla mutabakatı tamamlanmadan şirket bazlı BEAR üretilemez. [Arsa ekspertizi](https://www.panoragyo.com/storage/pages/December2025/16128-ada-22-parsel-degerleme-raporu-2025-e1.pdf) pazar yaklaşımında 2.296.320.000, gelir yaklaşımında 2.292.000.000 TL verir; önceki anlatımdaki yöntem sırası PDF metin akışından etkilenmiş, aynı değer farklı yöntem diye karıştırılmamalı. İki ekspertiz aynı kuruluş kökenlidir; üç bağımsız kaynak sayılmaz.

Kasım hedefi için 2026 kira/doluluk, capex, borç-vergi, temettü ve varlık hareketleriyle güncelleme gerekir. H1 muhasebe NAD vekili hâlâ CONFLICT; tarihli baz köprüsünü güncel diye sunmak bunu çözmez.

## TTRAK / AKMGY / YGGYO — açılma için gerekli gerçek veriler

- **TTRAK:** FY2025 ve 9A2025/9A2026 aynı satın alma gücünde faaliyet kârı, faaliyet giderlerine ait amortisman/itfa, tek seferlik kalemler; buradan TTM ve çevrim ortası normalizasyon köprüsü. Satış adedi, kapasite kullanımı, bayi stokları ve sürdürülebilir marj; aynı tarihli banka/kiralama borcu, kullanılabilir nakit ve pay sayısı. CNH/AGCO/Deere gibi tarım makinesi emsallerinde finansman iştiraki borcu ayrıştırılmalı. 9 aylığı 4/3 ile çarpmak veya zarar yılını eski kârlı yılla ikame etmek yeterli değildir. Bu tur eksik normalizasyonu sağlayan tam belge seti bulunmadı.
- **AKMGY:** Şirketin sahip olduğu bağımsız bölümler ve mülkiyet oranlarını kapsayan tarihli ekspertiz; kira, doluluk, kapitalizasyon/iskonto, hukuki takyidat ve değer aralığı. [H1 bilançosundaki](https://www.akmgyo.com/media/2553/2026-2-ceyrek.pdf) enflasyonla taşınmış gayrimenkul, yeni ekspertiz değildir. Ekspertiz değeri − defter değeri düzeltmesi + diğer net varlıklar − borç/vergi/kiralama ve bilanço dışı taahhütler; toplam yükümlülük ikinci kez düşülmemeli.
- **YGGYO:** ANKAmall ve CP Ankara Oteli için güncel ayrı ekspertizler, mülkiyet ve konsolidasyon kapsamı; özellikle maliyetle taşınan otelin gerçeğe uygun değer farkı. [H1 raporu](https://belgeler.yenigimatgyo.com.tr/1gz_udSVqghB/Yeni%20Gimat%20Konsolide%2030.06.2026.pdf) yeni bağımsız otel değerinin yerini tutmaz. Kira/otel nakit akımları, doluluk, borç, vergi ve diğer net varlıklarla aynı tarihli NAD köprüsü gerekir. Eski ekspertize enflasyon eklemek eksik gerçek değeri kanıtlamaz.

## Uygulama ve kanıt

Yedi yeni rapor revizyonu eklendi; eski rapor nesnelerinin tamamı `git HEAD` ile içerik bazında karşılaştırılıp aynı kaldığı doğrulandı. SHA256 ve sürümler matriste. Portföy, geçmiş yatırım serileri ve kullanıcı sunucusu değiştirilmedi. Yeni senaryo `review` alanı şemada korunur; NEEDS_REVIEW/BLOCKED durumunda sayısal hedef ve getiri üretilmez. Sayfa metinleri yeni i18n anahtarlarında; eski anlatımlar arşiv sürümlerinde korunur.

Testlerde üretim `decimal.ts` fonksiyonları beklenen değer üretmek için kullanılmadı: bağımsız tam sayı kesri ve tek son yuvarlama uygulandı. PAGYO bileşenleri ayrı toplandı, ISMEN TTM yeniden kuruldu. Eski şirket testleri açıkça tarihsel aritmetik regresyonu olarak sabitlendi; yeni testler güncel on şirketin engelini, ham verilerin korunmasını ve inceleme alanının parse edilmesini kontrol eder. Tarihsel PASS testleri güncel hedef onayı değildir.

Doğrulama: 93 dosyada **641/641 test PASS** (`npm run test:coverage -- --maxWorkers=2`); satır %92,03, dal %86,63, ifade %92,20, fonksiyon %94,65. `%80` kapısı geçti. TypeScript + üretim build PASS; lint 0 hata, önceki transfer testlerinden 3 uyarı. Büyük paket boyutu uyarısı sürüyor. İlk test turundaki test-kodu tip/lint sorunları düzeltildi; finansal kabul kapısı gevşetilmedi.

Üretim çıktısı ayrı 5251 portunda izole başsız Chrome ile doğrulandı: 10 şirket × Kolay/Detaylı × 390/640/768/1024/1440 px = **100 kontrol**, sıfır yatay taşma, sıfır ham çeviri anahtarı, sıfır sayısal güncel hedef başlığı, sıfır çalışma zamanı hatası. Koyu tema ve TRY tercihi kullanıldı. Çıktı çalışma kökünde `outputs/valuation-browser/results.json`; yalnız açılan test sunucusu/tarayıcısı kapatıldı, 5173 korunuyor. `git diff --check` temiz. Commit/push yapılmadı.

## 9 Kasım 2026 — içerik kalitesi denetimi (Kolay Anlatım / Detaylı Görünüm)

İnceleyen: Claude. Kapsam: yukarıdaki fiyat hedefi/BLOCKED kararları **değiştirilmeden**, 10 şirketin araştırma ekranlarındaki metin katmanı — Kolay Anlatım anlaşılırlığı, temettü değerlendirmesi, sektöre özgü derinlik, Detaylı Görünüm izlenebilirliği, TR/EN tutarlılığı. Her şirket ayrı bir ajanla, sırayla (paralel değil, queue) denetlendi; her ajan önceki ajanların bulgularını biliyordu. Aynı ajan incelemesi bağımsız denetim sayılmaz; bu bir takip turudur, yeni kaynak taraması yapılmadı.

### Sistematik bulgu: 10 şirketin 10'unda da TR/EN anlatım metni bayatlamış

`presentation.narrativeStale: true` bayrağı taşıyan tüm şirketlerde aynı kök sorun vardı: 07.11.2026 değerleme denetimi (yukarıdaki bölüm) rakamsal girdileri/senaryoları güncellerken, serbest metin alanlarının (`summary`, `accounting`, `cashBridge`, `cashQuality`, `dividend`, `sustainability`, `technical`, `review`, `debtMeaning`, `fxMeaning` — şirkete göre 8-11 alan) bir kısmı **hiç elden geçirilmemişti**. Sonuç: bu alanların TR sürümü konusuyla ilgisiz tek bir kalıp metni (ör. "net borç köprüsü" veya "temettü dipnotu") tekrarlıyor, EN sürümü ise TR'den tamamen farklı ve kendi başına da ilgisiz başka bir kalıp metni ("The 1 November 2026 source audit supersedes…") tekrarlıyordu. Yani TR/EN hem birbirinden hem de kendi alan konusundan kopuktu — `researchDoasAudit.test.ts` tarzı anahtar-eşleşme testleri bunu yakalayamaz çünkü iki dilde de geçerli, dolu metin vardı, sadece yanlış metindi.

FROTO'da ayrıca gerçek bir **veri çelişkisi** bulundu: TR `headline` "net nakde yakın" derken aynı raporun `strengths`/`debtMeaning`/EN `headline` alanları 111,98 milyar TL net borç (1,76x Net Borç/FAVÖK) gösteriyordu; TR headline hataydı, düzeltildi.

Her şirkette ilgili alanlar, **yeni kaynak taraması yapılmadan**, raporun kendi `facts`/`calculations`/`sources` alanlarından yeniden türetilerek TR/EN eşleşecek şekilde yeniden yazıldı. Codex'in fiyat hedefi/BLOCKED/NEEDS_REVIEW kararları hiçbirinde gevşetilmedi; BEAR/BULL'a sayısal değer eklenmedi (özellikle PAGYO). Eski rapor revizyonları silinmedi/değiştirilmedi.

| Şirket | Düzeltilen alan sayısı | Ek bulgu | `narrativeStale` |
| ------ | ---------------------- | -------- | ----------------- |
| TUPRS  | 2 (dividend/sustainability) + EN'de 8 alan daha | TR zaten kısmen güncellenmişti, sadece EN geride kalmıştı | **true kaldı** — yalnız hedeflenen alanlar düzeltildi, tam alan taraması yapılmadı |
| DOAS   | 8                      | —        | **true kaldı** |
| FROTO  | 9 + headline           | Net borç/net nakit çelişkisi (veri hatası) | **true kaldı** |
| TOASO  | 10                     | Sürdürülebilirlik için payout oranı hesabı eklendi (mevcut fact'lerden) | **true kaldı** |
| AKSA   | 10                     | —        | **true kaldı** |
| ISMEN  | 8                      | BROKER profili (BOOK_ROE, EV/FAVÖK yok) doğru seçilmiş, bozulmamış | **true kaldı** |
| PAGYO  | 10 (bir kısmı eski doğru metinden restore edildi) | NAD/BLOCKED ayrımı zaten doğruydu | **true kaldı** |
| TTRAK  | 11                     | —        | **false'a çekildi** |
| AKMGY  | 11                     | —        | **false'a çekildi** |
| YGGYO  | 11 + `education.occupancy` tarih hatası | Doluluk tarihi "31.12.2025" yazıyordu, kaynak 30.06.2026 gösteriyordu | **false'a çekildi** |

**Bilinçli tutarsızlık — devam eden iş:** Desen TTRAK'ta fark edilip sonraki ajanlara "tam alan taraması yaptıysan `narrativeStale`'i `false` yap" talimatı eklendiğinden, bu bayrak yalnızca TTRAK/AKMGY/YGGYO'da `false`'a çekildi. İlk yedi şirkette (TUPRS, DOAS, FROTO, TOASO, AKSA, ISMEN, PAGYO) bayrak hâlâ `true`: bu, o yedi şirkette **hedeflenen alan listesi dışında** kalan başka bir anlatım alanının da bayatlamış olabileceği ihtimalini açık bırakır — ben (koordinatör) bu yedi dosyada bayrağı kontrol etmeden kendiliğimden `false`'a çekmedim, çünkü bu, her alanın tek tek yeniden doğrulanmasını gerektirir ve bu denetim turunun kapsamı dışında kalır. **Açık kalan iş:** bu yedi şirkette tam alan taraması (TTRAK/AKMGY/YGGYO'daki gibi) yapılıp bayrak doğru değere çekilmeli.

### Diğer bulgular (şirkete özel)

- **ISMEN:** Aracı kurum (BROKER) profili doğru — EV/FAVÖK zorlanmamış, ROE/P-D-D/sermaye yeterliliği kullanılıyor; Damodaran ERP sürüm doğrulaması (%9,30 vs. Şubat 2026 %8,89) hâlâ açık.
- **TUPRS, DOAS:** Legacy `.ts` rapor dosyaları (`tuprs-2026-10-11*.ts`, `doas-2026-10-27.ts`) `services/research.ts`'teki `REPORTS` dizisine giriyor ama `analysisRepository.list()` her zaman önce geldiği için **UI'da hiç görünmüyor** — doğrulandı, ölü kod. Silme kararı kullanıcıya bırakıldı.
- **TTRAK:** Tek hesaplanabilir gösterge PD/DD ≈1,71x; üç senaryo da dürüstçe BLOCKED, sahte kesinlik yok.
- **PAGYO, AKMGY, YGGYO (GYO üçlüsü):** NAD'ın P&L bazlı değerlemeden farklı bir yöntem olduğu ve doğrudan sıralanamayacağı metinlerde açık; AKMGY'de toplam yükümlülüğün NAD'dan iki kez düşülmediği doğrulandı; YGGYO'da AVM+otel iki ayrı varlık sınıfı olarak ayrıştırıldığı ve otelin maliyet yöntemiyle taşındığı açık.

### Karşılaştırılabilirlik

On şirket artık ortak bir metin kalitesi standardına (TR/EN eşdeğerliği, konu-alan uyumu, facts/calculations izlenebilirliği) sahip. Sektörler arası ekonomik anlamı farklı oranlar (TUPRS'ın FD/FAVÖK'ü ile ISMEN'in P/D-D'si, GYO'ların NAD'ı) doğrudan sıralanmadı; TAS29/konsolidasyon/satın alma gücü farkları (FROTO/ISMEN'in TTM 01.07.2025-30.06.2026 dönemi diğerlerinin FY 31.12.2025'inden ayrı) her şirketin kendi metninde korundu.

### Doğrulama

`npx tsc -b` temiz; `npm run lint` 0 hata (3 önceden var olan, ilgisiz transfer-test uyarısı); `npx prettier --check` değişen tüm dosyalar için temiz; `npx vitest run` (coverage'sız, kullanıcı talimatıyla) **93 dosya / 641 test PASS**; `npm run build` PASS (büyük paket boyutu uyarısı önceden vardı, sürüyor). Değişen dosyalar: `src/i18n/locales/tr.json`, `src/i18n/locales/en.json`, `src/data/research/ttrak-analysis-reports.json`, `src/data/research/akmgy-analysis-reports.json`, `src/data/research/yggyo-analysis-reports.json`. Commit/push yapılmadı.
