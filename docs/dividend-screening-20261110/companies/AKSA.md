# AKSA (Aksa Akrilik Kimya Sanayii A.Ş.) — Temettü Elemesi

Kesim tarihi: **2026-11-10, Europe/Istanbul**. BIST kodu AKSA, KAP şirket kimliği 840, ISIN TRAAKSAW91E1, merkez Yalova, Yıldız Pazar, bağımsız denetçi PwC. Bu rapor **bugünkü fiyattan alım tavsiyesi veya hedef fiyat üretmez**; soru, AKSA'nın 10-15 yıllık temettü/temettü-büyümesi odaklı portföyde çekirdek (A), koşullu (B), uygun değil (C) ya da veri yetersiz (D) aday olup olmadığıdır.

Bu çalışma, `investulator-fe/src/data/research/aksa-*.json` ve `outputs/research-aksa-20261031/` altındaki 31 Ekim 2026 tarihli önceki Investulator araştırmasını **başlangıç referansı** olarak kullanmış, ancak kaynakları bağımsız olarak yeniden taramış, şirketin kendi yıllık finansal tablo PDF'lerini (2021-2025 ve 2026 H1, aynı klasörde önceden indirilmiş metin dökümleri) yeniden okumuş, şirketin kendi "Sermaye Temettü Bilgileri" sayfasını doğrudan HTML olarak çekmiş, KAP/şirket özel durum açıklamalarını taramış ve üçüncü taraf pazar/vergi kaynaklarıyla çapraz kontrol yapmıştır. Önceki rapordaki PARTIAL alanlardan özellikle **temettü stopaj oranı** (bkz. Bölüm 2) ve **segment bazlı FAVÖK marjı** (bkz. Bölüm 6) konularında bu çalışma yeni, bağımsız bulgular eklemiştir.

## 1. İş modeli

Aksa Akrilik, 1968'de kurulmuş, Yalova merkezli, dünyanın tek fabrikada en büyük akrilik elyaf üreticisi konumundaki bir kimya/elyaf şirketidir. Dört faaliyet bölümü raporlanır: **Elyaflar** (tekstil/teknik akrilik elyaf — FY2025 dış gelirin %82,1'i), **Enerji** (kojenerasyon/elektrik satışı — %7,2), **İleri Malzemeler** (karbon elyaf ve kompozitler, Aksa Carbon + Aksa Kompozit üzerinden — %7,5) ve **Diğer** (%3,1). (Kaynak: 31.12.2025 konsolide finansal tablolar, Not 4 — bölüm bazlı raporlama.)

Şirket, 2012'de Dow Chemical ile kurulan **DowAksa** ortak girişimi aracılığıyla karbon elyafa girmiş; 2024 Haziran'da imzalanan ve yaklaşık Q3 2025'te tamamlanan anlaşmayla Dow'un %50 payını **125 milyon ABD Doları nakit** karşılığında satın alarak işi tamamen kendi altına almış ve **Aksa Carbon** adını vermiştir (işlem, DowAksa'nın toplam değerini yaklaşık 450 milyon ABD Doları olarak ima eder). Bu nedenle karbon elyaf/ileri malzemeler segmenti **2025'in ikinci yarısından itibaren tam konsolide** olmaya başlamıştır; öncesinde özkaynak yöntemiyle (JV, %50) değerlenen bir yatırımdı ve grup hasılatına/FAVÖK'üne dahil değildi. Bu, 2021-2025 arası büyüme/karşılaştırma rakamlarının önemli bir kapsam kırılması olduğu anlamına gelir (bkz. Bölüm 9).

Ayrıca 2023'te Mısır'daki bağlı ortaklık (Aksa Egypt Acrylic Fiber Industry S.A.E.) %100 satılarak konsolidasyon dışına çıkarılmış (16.03.2023), bu da FY2022-FY2023 karşılaştırmasını etkileyen ayrı bir kapsam değişikliğidir. 2026'da ileri kompozit alanında yeni bir büyüme adımı atılmış: %54 iştirak **Aksa Kompozit** üzerinden Tunus'ta "Aksa Tunisie Aéronautique" kurulmuş, havacılık sektörüne yönelik kompozit parça üretimi için ~5 milyon ABD Doları yatırımla 3.000 m² tesis planlanmış, 2028'de faaliyete geçmesi öngörülmüştür (KAP bildirim 1667893, 24.09.2026).

**Ortaklık yapısı** (30.09.2026 itibarıyla, şirketin kendi genel kurul/pay dağılım açıklamaları): Akkök Holding A.Ş. %40,34 (18.09.2026'da %40,337'ye yükseldi — Akkök'ün son dönemde borsadan ek pay aldığı gözlemlenmiştir), Emniyet Ticaret A.Ş. %25,86, halka açık/diğer ~%33,80. Yönetim Kurulu Başkanı Raif Ali Dinçkök; şirket, Dinçkök ailesinin kontrolündeki Akkök Holding'in hakim ortak olduğu bir aile grubu şirketidir. İncelenen kamuya açık belgelerden doğrulanmış bir siyasi bağlantı bulgusu çıkarılmamıştır; bu, bağlantı olmadığı anlamına gelmez, sadece bu taramanın kapsamı dışındadır.

Kredi derecelendirmesi: JCR Avrasya ulusal uzun vadeli notu **AA+ (tr)**, görünüm **Durağan**; uluslararası yabancı/yerel para notu **BB**, görünüm **Durağan** (2026 Haziran yatırımcı sunumu).

## 2. 2016-2025 temettü tablosu

Kaynak: Aksa Akrilik'in kendi "Sermaye Temettü Bilgileri" sayfası (https://www.aksa.com/yatirimci-iliskileri/hisse-verileri/sermaye-temettu-bilgileri, bu oturumda ham HTML olarak çekilip tablo satır satır doğrulandı) ve KAP'ın 2026 kâr payı dağıtım bildirimi (1581038). Sayfadaki "Yıl" sütunu **kâr yılı**dır; ödeme bir sonraki takvim yılında (çoğunlukla Nisan, 2024 kârı istisnai olarak Mayıs 2025'te) yapılmıştır. Toplam nakit tutarları ve oranlar ("Brüt Temettü Oranı" = nominal sermayeye göre %) şirketin kendi sayfasından alınmış, pay başına tutarlar ve kesin ödeme tarihleri Investulator'ın önceki araştırmasındaki `aksa-approximate-history.json` dosyasındaki olay tarihleriyle (aynı kaynağa, "sermaye" arşivine dayanan) çapraz kontrol edilip **tam uyumlu** bulunmuştur (toplam tutar ÷ dönemin nominal sermayesi = pay başına brüt tutar, her yıl için ayrıca doğrulandı).

**Bağımsız yeni bulgu — stopaj oranı:** Önceki Investulator araştırması (31.10.2026) net temettüyü sabit **%15 stopaj** varsayımıyla hesaplamıştı. Bu oturumda PwC Türkiye, Lebib Yalkın ve ilgili hukuk bültenlerinden doğrulandığı üzere, kâr payı stopajı **22.12.2021'den 21.12.2024'e kadar %10**, bu aralığın dışında (2021 öncesi ve 22.12.2024'ten sonra) **%15** olarak uygulanmıştır. Bu, 2022-2025 arası ödemelerin (2021-2024 kâr yıllarına ait) net tutarlarını %15 varsayımına göre **gerçekte daha yüksek** gösterir (bkz. tablo).

| Ödeme yılı | Kâr yılı | Ödendi mi | Brüt (TL/pay) | Stopaj | Net (TL/pay) | Toplam nakit (TL) | Hak/ödeme tarihi | Not |
|---|---|---|---:|---:|---:|---:|---|---|
| 2016 | 2015 | Evet | 0,85 | %15 | 0,7225 | 157.250.000 | 06.04.2016 / 08.04.2016 | Nominal sermaye 185.000.000 TL |
| 2017 | 2016 | Evet | 1,00 | %15 | 0,85 | 185.000.000 | 05.04.2017 / 07.04.2017 | — |
| 2018 | 2017 | Evet | 1,12 | %15 | 0,952 | 207.200.000 | 04.04.2018 / 06.04.2018 | — |
| 2019 | 2018 | Evet | 1,1065 | %15 | 0,940525 | 204.702.500 | 09.04.2019 / 11.04.2019 | — |
| 2020 | 2019 | Evet | 0,74 | %15 | 0,629 | 239.575.000 | 07.04.2020 / 09.04.2020 | — |
| 2021 | 2020 | Evet | 0,87 | %15 | 0,7395 | 281.662.500 | 13.04.2021 / 15.04.2021 | 2020 bedelsiz (×1,75) sonrası sermaye 323.750.000 TL bazında |
| 2022 | 2021 | Evet | 1,85 | **%10** | **1,665** | 598.937.500 | 21.04.2022 / 25.04.2022 | Stopaj 22.12.2021'den itibaren %10'a düştü |
| 2023 | 2022 | Evet | 2,41 | %10 | 2,169 | 780.237.500 | 11.04.2023 / 13.04.2023 | 2023'te Mısır iştiraki satışı (konsolidasyon kapsam değişikliği, kâr etkisi değil) |
| 2024 | 2023 | Evet | 5,00 | %10 | 4,50 | 1.618.750.000 | 03.04.2024 / 05.04.2024 | — |
| 2025 | 2024 | Evet | 0,48 | %10 | 0,432 | 1.864.800.000 | 21.05.2025 / 23.05.2025 | Olağan Nisan takviminden sapma (Mayıs); 2024 bedelsiz (×12) sonrası sermaye 3.885.000.000 TL bazında |
| 2026 | 2025 | Evet | 0,58 | **%15** | **0,493** | 2.253.300.000 | 03.04.2026 / 07.04.2026 | Stopaj 22.12.2024'ten itibaren tekrar %15'e çıktı (KAP 1581038) |

Taksit yok (tek ödeme); bedelsiz pay/bölünme nakit temettüyle karışmamıştır (ayrı bonus olayları: 2006 ×4,0506, 2009 ×1,681754, 2020-02-12 ×1,75, 2024-07-24 ×12 — hepsi bedelsiz sermaye artırımı, rüçhanlı/bedelli değil).

**Nominal, reel (TL) ve USD büyüme — toplam nakit temettü bazında (pay sayısı değişiminden bağımsız, en sağlam ölçü):**

- **Nominal TL:** 2015 kâr yılı 157,25 milyon TL → 2025 kâr yılı 2.253,3 milyon TL (+%1.333). Büyük ölçüde TL'nin değer kaybını yansıtır, satın alma gücünü değil.
- **Reel TL (TÜİK TÜFE yıl-sonu endeksiyle 2025 TL'sine deflate edilmiş, yöntem: her yılın endeksi önceki yılın endeksi × (1+o yılın TÜFE'si), taban 2015=100):** 2015 ≈ 2.052 milyon, 2016 ≈ 2.225 milyon, 2017 ≈ 2.226 milyon, 2018 ≈ 1.826 milyon, 2019 ≈ 1.911 milyon, 2020 ≈ 1.961 milyon, 2021 ≈ 3.065 milyon, 2022 ≈ 2.430 milyon, 2023 ≈ 3.058 milyon, 2024 ≈ 2.441 milyon, 2025 ≈ 2.253 milyon (2025 TL, milyon). **2025'in reel değeri, 2021 ve 2023 zirvelerinin yaklaşık %74'ü ve 2016-2017 seviyesine yakındır** — nominal +%1.333 büyüme görüntüsünün aksine, reel temettü on yılda net bir büyüme trendi göstermemiş, dalgalı/yatay kalmıştır.
- **USD (ödeme günü Yahoo Finance USD/TRY kapanışıyla, kur tarihleri yukarıdaki tabloda):** 2015→$54,9M, 2016→$49,9M, 2017→$51,3M, 2018→$36,0M, 2019→$35,4M, 2020→$34,9M, 2021→$40,6M, 2022→$40,4M, 2023→$50,7M, 2024→$47,8M, 2025→$50,5M. USD bazında da **belirgin bir büyüme yoktur**; seri $35-55 milyon bandında dalgalanmış, 2025 değeri 2015'in altındadır.

Kimya/akrilik sektörünün döngüselliği bu tabloda görülebilir: 2018-2020 (küresel ticaret gerginlikleri + 2020 pandemisi) reel/USD temettüde bir çöküş değil ama **kademeli erime** dönemidir; dağıtım hiçbir yıl kesilmemiştir (süreklilik korunmuş), ancak büyüme de kesilmemiştir — düz çizgiye yakın bir dalgalanma söz konusudur.

## 3. Süreklilik ve büyüme

İncelenen 2015-2025 kâr yılı penceresinde **11 yılın tamamında nakit temettü ödenmiştir**, hiçbir yıl atlanmamıştır — bu, uzun vadeli temettü stratejisi için güçlü bir süreklilik kanıtıdır. 2020 pandemi yılının kârından yapılan dağıtım (Nisan 2021 ödemesi) önceki yıla göre **artmıştır** (0,74→0,87 TL/pay brüt), yani şirket pandemi döneminde temettüyü kesmemiştir.

Ancak Bölüm 2'deki reel/USD analiz, "süreklilik" ile "büyüme"nin ayrı kavramlar olduğunu gösterir: ödeme hiç kesilmemiş olsa da, gerçek satın alma gücü ya da dolar bazında **net bir büyüme trendi yoktur**; son 10 yıl bir yatay/dalgalı bant içinde kalmıştır. Nominal TL rakamlarına bakıp "temettü 14 katına çıktı" demek yanıltıcıdır.

Payout oranı (o kâr yılının dağıtımı ÷ o yılın **kendi** finansal tablosundaki ana ortaklığa ait net dönem kârı, aynı muhasebe bazında, bkz. Bölüm 4 kaynakları) da son beş yılda son derece oynaktır: 2021 ≈ %51,3; 2022 ≈ %22,8; 2023 ≈ %98,0; **2024 ≈ %164,1 (dağıtım, o yılın muhasebe kârını aşmıştır)**; 2025 ≈ %56,1. Bu oynaklık büyük ölçüde TMS 29 enflasyon muhasebesinin ve parasal kazanç/kayıp kaleminin raporlanan muhasebe kârını nakit ekonomisinden koparmasından kaynaklanır (bkz. Bölüm 4); disiplinli, öngörülebilir bir payout politikasının kanıtı değildir.

## 4. 2021-2025 nakit akışı ve payout (SOLO/KONSOLİDE ve TMS 29 bazı ayrı ayrı belirtilmiştir)

Tüm rakamlar şirketin kendi konsolide finansal tablolarından, **her yılın kendi raporundaki satın alma gücü bazında** (bin TL), bu oturumda doğrudan PDF metin dökümlerinden okunmuştur. 2021-2022 nominal (henüz TMS 29 zorunlu değildi), 2023-2025 TMS 29 bazındadır; farklı raporlardaki aynı yılın karşılaştırmalı sütunu **farklı tarihli satın alma gücüne** yeniden ifade edilmiş olabilir — bu yüzden her hücrenin hangi raporun hangi sütunundan geldiği ayrıca not edilmiştir, doğrudan yıllar arası bölme yapılmamıştır.

| Kalem (bin TL) | FY2021 | FY2022 | FY2023 | FY2024 | FY2025 |
|---|---:|---:|---:|---:|---:|
| Dönem kârı (toplam, kendi raporu) | 1.167.208 (nominal) | 3.422.038 (nominal) | 1.651.981 (TMS29@2023) | 1.136.625 (TMS29@2024) | 3.921.703 (TMS29@2025) |
| Ana ortaklığa ait pay | ~tamamı (NCI yok) | ~tamamı (NCI yok) | ~tamamı (NCI yok) | ~tamamı (NCI yok) | 4.016.418 (NCI: −94.715) |
| Aynı kalemin bir sonraki yılın raporunda karşılaştırmalı (farklı TMS29 bazı) | — | 4.563.874 (FY2023 raporunda, TMS29@2023) | 2.385.110 (FY2024 raporunda, TMS29@2024) | 1.487.755 (FY2025 raporunda, TMS29@2025) | — |
| İşletme faaliyetlerinden nakit akışı (CFO) | 2.910.752 (nominal) | 1.346.171 (nominal, kendi raporu) | 1.481.877 (TMS29@2023) | veri bu oturumda net okunamadı (OCR) | 5.064.708 (TMS29@2025) |
| Aynı CFO'nun bir sonraki yılın raporundaki karşılaştırmalı değeri | — | **−3.021.587** (FY2023 raporunda, TMS29@2023 — pozitiften negatife döndü) | — | 2.684.546 (FY2025 raporunda, TMS29@2025) | — |
| CAPEX (maddi+maddi olmayan duran varlık alımı, segment notu) | veri yok (bu oturumda okunmadı) | veri yok | veri yok | 4.425.055 (FY2025 raporunda, TMS29@2025, segment toplamı) | 3.114.154 (kendi raporu, TMS29@2025) |
| FAVÖK (düzeltilmiş, segment notu toplamı) | veri yok | veri yok | veri yok | 5.868.613 | 5.729.630 |

**Dikkat çeken bulgu:** FY2022'nin kendi raporundaki CFO'su (1.346.171 bin TL, nominal, pozitif) FY2023 raporunun karşılaştırmalı sütununda TMS29 bazına çevrilince **−3.021.587 bin TL**'ye (negatife) dönmüştür. Bu, aynı dönemin nakit akışı tablosunun farklı enflasyon muhasebesi bazlarında **işaret değiştirecek kadar** farklı görünebileceğini kanıtlar; "pozitif işletme nakdi" iddiası hangi raporun hangi sütunundan alındığına bağlı olarak tamamen tersine çıkabilir. Bu nedenle sürdürülebilirlik değerlendirmesi, mümkün olduğunca her yılın **kendi** raporundaki rakamlarla (yukarıdaki tablodaki "kendi raporu" sütunları) yapılmalı, çapraz yıl karşılaştırmaları ihtiyatla okunmalıdır.

**FCF ve temettü karşılama (yalnız güvenilir hücrelerle):** FY2025 kendi raporuna göre FCF vekili = CFO 5.064.708 − CAPEX 3.114.154 = **1.950.554 bin TL**. 2025 takvim yılında **nakden ödenen** temettü (2024 kârından, Mayıs 2025) 1.864.800 bin TL idi → kaba karşılama ≈ **%104,6** (dar bir şekilde karşılanmış). H1 2026 için (önceki Investulator araştırmasından, aynı kaynak belgeden, bu oturumda ayrıca doğrulanmamış ama tutarlı bulunmuş): CFO 3.261 milyon − CAPEX 1.249 milyon = 2.012 milyon TL FCF vekili; finansman net faizi (1.455−0,754=0,701 milyar) düşülünce ≈1.311 milyon TL kalır. Nisan 2026'da ödenen temettü (2.411 milyon TL, 30.06.2026 bazında) bu FCF'yi **aşar**: kaba FCF'ye göre karşılama ≈%83,4, faiz-sonrası nakde göre ≈%54,4. Yani en güncel dönemde temettü, faiz yükü düşüldükten sonra üretilen serbest nakitten **daha büyüktür**; ödeme kısmen borçlanma/işletme sermayesi hareketleriyle finanse edilmiş olabilir.

CAPEX'in segment dağılımı (FY2025, bin TL): Elyaflar 869.265, Enerji 160.168, **İleri Malzemeler 922.115**, Diğer 1.162.606. İleri Malzemeler, gelirin yalnızca %7,5'ini oluşturduğu halde grup CAPEX'inin **%29,6'sını** almıştır — sermaye, açıkça karbon elyaf/kompozit büyüme bahsine yönlendirilmektedir (bkz. Bölüm 6).

## 5. Finansal dayanıklılık

Kaynak: 30.06.2026 ve 31.12.2025 konsolide finansal tablolar (Not 5 — Finansal Borçlanmalar), bu oturumda PDF metninden doğrudan okunup toplamlar teyit edilmiştir.

**Borç seyri ve satın alma bağlantısı (bin TL, grup toplam finansal borç):**
- 01.01.2025 (=31.12.2024): **9.924.327**
- 30.06.2025: 15.492.808 (H1 2025 içinde "bağlı ortaklık edinimi sebebiyle girişler" +628.526 — DowAksa işleminin ilk kısmi etkisi)
- 31.12.2025: **30.833.074** — yani 2025 takvim yılında grup finansal borcu **yaklaşık 3,1 kat**a çıkmıştır
- 30.06.2026: **28.438.396** (H1 2026'da 7.870.952 bin TL anapara ödemesiyle borç hafifçe gerilemiştir)

Bu üç kata yakın artış, zamanlama ve tutar olarak doğrudan **Aksa Carbon'un (DowAksa) 125 milyon USD'lik tam satın alımı ve tam konsolidasyonuna** denk gelir: hem satın alma finansmanı hem de daha önce özkaynak yöntemiyle değerlenip bilanço dışı kalan Aksa Carbon'un **kendi banka kredilerinin** konsolide bilançoya girmesi bu artışı açıklar. Bu, tam olarak görevin işaret ettiği "satın almalardan kaynaklanan borç artışı"nın doğrudan kanıtıdır.

**Covenant riski — doğrudan Aksa Carbon'a bağlı:** H1 2026 raporu, bağlı ortaklık Aksa Carbon'un banka kredilerinde her 12 ayda bir hesaplanan **Geriye Dönük Borç Servisi Karşılama Oranı** ve **Kaldıraç Oranı** taahhütleri bulunduğunu; grubun 31.12.2025 itibarıyla bu taahhütleri yerine getirememe **riski doğunca** 30.12.2025 tarihli bir **feragatname (waiver)** temin ettiğini ve ödeme planına göre ödemelerin sürdüğünü açıklamaktadır. Rapor tarihinde (30.06.2026) mevcut bir ihlal bildirilmemiştir; yönetim, artan kârlılık ve büyümeyle taahhütlere uyulacağını öngörmektedir — ama bu bir gelecek taahhüdü/beklentisidir, gerçekleşmiş sonuç değildir.

**Vade yapısı (30.06.2026, bin TL):** <3 ay 5.892.316; 3-12 ay 13.093.168 (toplam 1 yıl içi ≈18.985.484, borcun ≈%66,8'i); 1-2 yıl 3.619.987; 3+ yıl 5.832.925. **Cari oran 0,91** (1'in altı — kısa vadeli likidite gerginliği işareti).

**Döviz pozisyonu:** Borcun büyük kısmı USD/EUR ağırlıklıdır (H1 2026 dipnotu: USD kredi TL karşılığı ≈6.934 kısa + 2.526 uzun-vade-kısa-kısım + 5.853 uzun = ~15,3 milyar TL; EUR ≈2.432+0.372+3.449=~6,25 milyar TL; TL kredi brüt ≈7,395 milyar TL). Net bilanço döviz açığı ≈13,53 milyar TL; türev net yükümlülük eklenince ≈15,65 milyar TL; şirketin doğal korunma saydığı stok (≈7,87 milyar TL) düşülünce **≈7,78-7,79 milyar TL net döviz açığı** kalmaktadır (31 Ekim 2026 araştırmasının bu oturumda yeniden kontrol edilen, aynı birincil dipnottan türetilen hesabı — stok nakit değildir, fiyat aktarımı garanti değildir).

**Net borç/FAVÖK:** Şirketin kendi Haziran 2026 yatırımcı sunumu net finansal borcun "yıllık FAVÖK'ün yaklaşık **2,8 katı**" olduğunu, mevcut borcun yaklaşık 3 yılda karşılanabileceğini belirtir. Bağımsız olarak (FY2025 net borç ≈21,23 milyar TL ÷ FY2025 FAVÖK 5,73 milyar TL) ≈**3,70x** çıkmaktadır. İki rakam arasındaki fark (hangi tarihli net borç, hangi dönemli FAVÖK, kontrol gücü olmayan pay dahil/hariç) şirketin sunumunda açıklanmamıştır; bu nedenle **tam mutabakat sağlanamamıştır** — kullanıcıya her iki rakam da kaynağıyla sunulmuş, biri diğerinin yerine "doğru" kabul edilmemiştir.

JCR Avrasya kredi notu (AA+(tr) ulusal / BB uluslararası, Durağan görünüm) satın alma sonrası dönemde de korunmuştur; bu, derecelendirme kuruluşunun borç artışını not indirimini gerektirecek düzeyde görmediğine işaret eder, ama tek kaynaktan gelen bir veridir ve bağımsız kredi analizi değildir.

## 6. Büyüme ve rekabet avantajı

**Segment ekonomisi (dış gelir ve düzeltilmiş FAVÖK marjı, bin TL, şirketin kendi segment notundan):**

| Dönem | Elyaflar gelir / marj | Enerji gelir / marj | İleri Malzemeler gelir / marj | Diğer gelir / marj |
|---|---|---|---|---|
| FY2025 (tam yıl, İleri Malzemeler **yalnızca kısmi dönem** tam konsolide) | 26.641.940 / %22,8 | 2.345.463 / %17,5 | 2.442.471 / **%14,4** | 1.014.349 / %8,3 |
| H1 2026 (ilk **tam** 6 aylık dönem, İleri Malzemeler tam konsolide) | 16.870.320 / %19,8 | 533.014 / %33,6 | 4.532.672 / **%30,2** | 720.608 / %15,4 |

FY2025'teki görece düşük İleri Malzemeler marjı (%14,4), bu segmentin yıl içinde yalnızca kısmi bir döneme (H2 2025'in bir kısmına) ait olmasından ve muhtemel entegrasyon/geçiş maliyetlerinden kaynaklanabilir; H1 2026'da marj **iki kattan fazla artarak %30,2'ye** çıkmıştır ve artık Elyaflar segmentinin üzerindedir. Bu, karbon elyaf/ileri kompozit işinin olgunlaştığında gerçekten daha yüksek marjlı olabileceğine işaret eder — ancak **tek bir temiz altı aylık veri noktası**, güvenilir bir ileriye dönük marj varsayımı için yeterli değildir (bkz. Bölüm 9).

İhracat payı yaklaşık %64 (2026 dönemine ait şirket açıklaması), kapasite kullanımı 2026 için %85 (±5 puan) hedeflenmektedir; 2026 yönetim beklentisi ~1 milyar ABD Doları ciro, %15-18 FAVÖK marjı, ~65 milyon ABD Doları (±10 milyon) yatırım — bunlar **gerçekleşmiş sonuç değil, yönetim öngörüsüdür**.

**Sermaye tahsisi değerlendirmesi:** Son 3 yılda şirket (a) düşük marjlı/stratejik olmayan Mısır iştirakini satmış (2023), (b) 125 milyon USD nakitle karbon elyaf JV'sinin tamamını satın almış (2025), (c) Tunus'ta küçük ölçekli (~5 milyon USD) havacılık kompoziti yatırımına başlamış (2026). Bu, akrilik elyafın yapısal olarak daralan bir pazardan (bkz. Bölüm 7) daha yüksek katma değerli, havacılık/savunma/kompozit pazarlarına bilinçli bir sermaye kaydırmasıdır. Stratejinin **başarılı olup olmadığı** henüz kanıtlanamaz: tam konsolidasyon bir yıldan az süredir yürürlükte, borç belirgin şekilde artmış ve bir covenant riski doğmuştur; H1 2026'nın güçlü marj verisi cesaret verici ama tek başına yeterli kanıt değildir.

## 7. Yapısal riskler

1. **Akrilik elyaf talebinde yapısal daralma (gelirin ~%82'si):** Üçüncü taraf pazar araştırmaları (bu oturumda taranan), küresel akrilik elyaf talebinin tekstilde polyestere pay kaybettiğini, Çin kaynaklı arz fazlasının fiyatları bastırdığını ve 2024-2025'te fiyatlarda %15-20 aralığında oynaklık yaşandığını bildirmektedir. Bu, Aksa'nın ana gelir kaynağı için uzun vadeli (10-15 yıllık ufuk) bir yapısal risktir.
2. **Karbon elyafta Çin kaynaklı aşırı kapasite ve fiyat çöküşü:** Üçüncü taraf kaynaklar, Çin'in endüstriyel sınıf karbon elyaf kapasitesinin 2020'den (~30 bin ton) 2025'e (~95 bin ton tahmini) sıçradığını, T300-12K sınıfı fiyatların 2022'deki ~33 USD/kg'dan 2024 sonunda ~12 USD/kg'a (**-%64**) düştüğünü ve küresel beş büyük üreticinin (Toray, Hexcel, SGL, Mitsubishi, Teijin) birleşik pazar payının 2010'daki ~%80'den 2025'te %50'nin altına indiğini bildirmektedir. Aksa, tam da bu segmentte 125 milyon USD'lik bir büyüme bahsi yapmıştır; H1 2026 marjı güçlü görünse de (muhtemelen havacılık/savunma sınıfı ürün karması endüstriyel sınıf Çin rekabetinden daha korunaklı olduğu için), bu küresel fiyat baskısının Aksa Carbon'un orta-uzun vadeli kârlılığına ne ölçüde sirayet edeceği **doğrulanabilir bir veriyle gösterilememiştir**.
3. **Kaldıraç ve covenant riski:** Borcun bir yılda ~3 katına çıkması ve Aksa Carbon kredilerinde doğan covenant ihlali riski (feragatname ile aşılmış), ilave satın alma veya kârlılıkta gerileme senaryosunda temettü kapasitesini kısıtlayabilir.
4. **Döviz riski:** Borcun büyük kısmı USD/EUR, gelirin bir kısmı TL; doğal korunma sonrası dahi ~7,8 milyar TL net döviz açığı taşınmaktadır; TL'de ani değer kaybı faiz/anapara yükünü TL bazında şişirebilir (geçmişte 2018, 2021-2023 TL şoklarında benzer dinamik yaşanmıştır).
5. **Enerji/girdi maliyeti ve jeopolitik talep:** Akrilonitril (ACN)/petrokimya fiyatları ve enerji maliyetleri marjı doğrudan etkiler; şirket sunumu Orta Doğu talebindeki jeopolitik dalgalanmaya işaret eder, sayısal etki bu oturumda doğrulanamamıştır.
6. **Yönetişim/azınlık pay riski:** Dinçkök ailesi kontrolündeki Akkök Holding + Emniyet Ticaret birlikte sermayenin ~%66'sına yakınını kontrol etmektedir; halka açıklık oranı ~%34 ile sınırlıdır. Bu, BIST'teki aile holdingi yapılarında yaygın bir özellik olup tek başına diskalifiye edici değildir, ama azınlık pay sahibi için temettü politikası üzerindeki etki gücünün sınırlı olduğu anlamına gelir.
7. **TMS 29 ölçüm riski:** Bölüm 4'te gösterildiği gibi, raporlanan kâr ve işletme nakdi, hangi yılın hangi satın alma gücü bazında sunulduğuna göre işaret değiştirebilecek kadar oynak olabilir; bu, dışarıdan "sürdürülebilirlik" değerlendirmesini zorlaştıran kalıcı bir ölçüm riskidir (muhasebe tercihi değil, Türkiye'deki zorunlu uygulamanın sonucu).
8. **Tunus yatırımı erken aşamada:** 2028 başlangıç hedefli, küçük ölçekli (~5 milyon USD) bir proje; yürütme riski taşır, kısa-orta vadede temettüye etkisi ihmal edilebilir düzeydedir.

## 8. Olumlu ve olumsuz kanıtlar

**Olumlu:**
- 2015-2025 kâr yıllarının **tamamında** kesintisiz nakit temettü ödenmiştir (2020 pandemi yılı dahil, dağıtım o yıl düşmemiş, artmıştır).
- İleri Malzemeler (karbon elyaf/kompozit) segmenti H1 2026'da %30,2 düzeltilmiş FAVÖK marjıyla, çekirdek Elyaflar segmentinin üzerine çıkmıştır; sermaye bilinçli olarak bu segmente yönlendirilmektedir (CAPEX'in %29,6'sı, gelirin yalnızca %7,5'i).
- İhracat payı yüksek (~%64), bu TL devalüasyonuna karşı kısmi doğal gelir koruması sağlar.
- Akkök Holding son dönemde borsadan ek pay almıştır (içerden güven sinyali).
- Kredi derecelendirmesi (JCR AA+(tr), Durağan) satın alma sonrası dönemde de korunmuştur.
- Havacılık/savunma odaklı kompozit genişlemesi (Tunus), karbon elyafın döngüsel/emtia sınıfı rekabetten nispeten korunaklı, yüksek katma değerli bir büyüme alanına erken konumlanma olabilir.

**Olumsuz:**
- Reel (TÜİK TÜFE ile deflate) ve USD bazında son 10 yılda **net bir temettü büyüme trendi yoktur**; 2025 reel/USD değeri 2021/2023 zirvelerinin altında, 2015-2017 seviyesine yakındır.
- Payout oranı son 5 yılda son derece oynak, 2024'te muhasebe kârını **aşmıştır** (%164).
- Finansal borç bir yılda (2025) ~3 katına çıkmış, doğrudan karbon elyaf satın almasına bağlı; Aksa Carbon kredilerinde covenant ihlali **riski** doğmuş, feragatname ile aşılmıştır.
- Cari oran 0,91 (1'in altı); net döviz açığı doğal korunma sonrası dahi ~7,8 milyar TL.
- Çekirdek akrilik elyaf pazarı yapısal talep daralması ve Çin kaynaklı arz fazlasıyla karşı karşıya; karbon elyafta da benzer bir Çin kaynaklı fiyat baskısı küresel ölçekte gözlenmektedir.
- Aile holdingi kontrolü yüksek (~%66 birleşik pay), halka açıklık sınırlı (~%34).

## 9. Veri eksikleri ve çelişkiler

1. **2016-2020 net kâr/işletme nakdi bu oturumda birincil kaynaktan doğrulanamadı.** O yılların yıllık finansal tablo PDF'leri bu araştırma oturumunda indirilip okunmadı; yalnızca temettü tutarları (şirketin kendi arşiv sayfası) ve stopaj oranı geçmişi doğrulandı. Bu, 2016-2020 payout oranlarının hesaplanmasını engellemektedir — blocker: tam finansal tablo erişimi; olası kaynak: KAP'ın eski dönem finansal rapor arşivi veya şirketin faaliyet raporu arşivi (`asset.aksa.com/.../faaliyet-raporu-2017...` gibi bağlantılar arama sonuçlarında görülmüştür ama bu oturumda açılıp okunmamıştır).
2. **İleri Malzemeler (karbon elyaf) segmentinin "temiz" (tam konsolide, tam dönem) ekonomisi bir yıldan kısa bir geçmişe sahiptir** (tek tam yarı yıl: H1 2026). FY2025'teki kısmi dönem verisi ile H1 2026'nın marj farkı (%14,4 → %30,2) büyük ölçüde geçiş/entegrasyon etkisi mi, kalıcı marj profili mi, ayırt edilemiyor. Blocker: en az 4-6 çeyreklik tam konsolide veri; olası kaynak: sonraki çeyrek/yıl finansal tabloları.
3. **Şirketin "net borç/FAVÖK ≈2,8x" ifadesi ile bu oturumun bağımsız hesabı (≈3,70x, FY2025) mutabık kılınamadı.** Şirket sunumu net borç tarihini/FAVÖK dönemini (TTM mi, yıl sonu mu) açıklamamaktadır. Blocker: şirketin hesap metodolojisi notu; olası kaynak: yatırımcı ilişkileri ile doğrudan iletişim veya daha ayrıntılı bir sunum/rapor dipnotu.
4. **Aksa Carbon'un gerçekleştirdiği fiyatların havacılık/savunma sınıfı mı yoksa endüstriyel sınıf mı olduğu, ve bunun küresel Çin kaynaklı fiyat çöküşünden ne kadar korunaklı olduğu doğrulanamadı.** Blocker: ürün/müşteri segmenti bazında fiyat veya sözleşme açıklaması; şirket bu düzeyde detay yayımlamamaktadır (rekabetçi hassasiyet nedeniyle beklenir).
5. **9 aylık 2026 finansal tabloları bu oturumda birincil kaynaktan bulunamadı** (KAP'ın beklenen penceresi ~01.10-09.11.2026 içinde); yalnızca ikincil bir kaynağın (borsatek.com) "2026 9 aylık kapasite %85" ifadesine rastlanmıştır, bu bağımsız doğrulanmamıştır ve rapora dahil edilmemiştir.
6. **KAP detaylı sorgusunun tam sayfalaması bu oturumda da doğrulanamadı** (önceki araştırmanın PARTIAL bulgusu değişmedi); "başka önemli bildirim yok" iddiası yapılmamaktadır.
7. **FY2021-2023 için düzeltilmiş FAVÖK (segment notu formatında) bu oturumda bulunamadı**; o yıllarda "Esas faaliyet kârı" (faaliyet kârı, FAVÖK değil) rakamları mevcuttur ama amortisman geri eklenmediği için doğrudan FAVÖK ile karşılaştırılamaz — bu nedenle Bölüm 4 tablosunda bu hücreler boş bırakılmıştır, sıfır ya da tahmini değer yazılmamıştır.
8. **Çelişki (giderilmiş):** Önceki araştırmanın %15 sabit stopaj varsayımı, bu oturumda 2021-2024 ödemeleri için **yanlış** bulunmuş ve %10 olarak düzeltilmiştir (bkz. Bölüm 2); 2025/2026 ödemesi için önceki varsayım (%15) doğru çıkmıştır (tesadüfen, çünkü o ödeme zaten 22.12.2024 sonrasına denk gelmektedir).

## 10. A/B/C/D ve gerekçe

### Kategori: **B — Koşullu aday**

**Gerekçe:**
- AKSA, **A (çekirdek aday)** seviyesine çıkamaz çünkü: (i) son bir yılda finansal borç ~3 katına çıkmış ve doğrudan satın almaya bağlı bir covenant ihlali **riski** doğmuştur (feragatname ile aşılmış olsa da, bu bir dayanıklılık zafiyetidir); (ii) çekirdek gelir kaynağı (akrilik elyaf, ~%82) yapısal/döngüsel talep daralmasıyla karşı karşıyadır; (iii) reel/USD bazında on yıllık temettü büyümesi **yoktur** — nominal büyüme TL enflasyonunun bir yansımasıdır; (iv) payout oranı son 5 yılda son derece oynak ve bir yıl muhasebe kârını aşmıştır; bunlar 10-15 yıllık bir çekirdek pozisyon için istenen öngörülebilirlik/dayanıklılık standardını karşılamaz.
- AKSA, **C (uygun değil)** olarak da elenemez çünkü: (i) 11 yıl kesintisiz temettü (2020 dahil) **güçlü bir süreklilik** kanıtıdır — tek yıllık zayıflık değil, uzun bir geçmiş söz konusudur; (ii) şirket, çekirdek işin yapısal risklerine karşı bilinçli bir şekilde daha yüksek katma değerli, havacılık/savunma odaklı karbon elyaf/kompozit alanına geçiş yapmakta ve bu geçişin ilk tam dönem verisi (H1 2026, %30,2 marj) **cesaret vericidir**; (iii) ihracat ağırlığı ve kredi derecelendirmesinin korunması ek olumlu sinyallerdir; yüksek verim/düşük F/K tartışması bu kararın bir parçası değildir (zaten hedef fiyat üretilmemiştir) ve tek başına C için yeterli olumsuzluk yoktur.
- **D (veri yetersiz)** de uygun değildir: bu oturumda birincil kaynaklardan (şirketin kendi finansal tabloları, KAP bildirimleri, IR sayfası) temettü tutarı/tarihi, borç yapısı, segment ekonomisi ve ortaklık yapısı hakkında **yeterli, çapraz doğrulanmış** veri elde edilmiştir; eksikler (Bölüm 9) kararı bloke eden değil, kararı **koşullu** kılan niteliktedir (yani B'nin kendisinin gerekçesidir, D'nin değil).
- **B seçiminin özü:** AKSA, mevcut temettü sürekliliği ve stratejik yeniden konumlanma potansiyeli nedeniyle izlenmeye değer, ama (a) satın alma sonrası borç/covenant riskinin 1-2 yıl içinde net bir şekilde azaldığının, (b) İleri Malzemeler segment marjının H1 2026 seviyesinde (veya üstünde) kalıcılaştığının ve (c) çekirdek elyaf işinin marj/talep baskısı altında temettüyü tehdit etmediğinin **sonraki 2-3 finansal dönemde doğrulanması** koşuluyla çekirdek adaylığa yükseltilebilir bir pozisyondur.

## 11. Kararı değiştirebilecek gelişmeler

- Aksa Carbon kredilerindeki covenant taahhütlerinin 31.12.2026 veya sonraki test tarihlerinde **gerçekten** karşılanması ya da tekrar ihlal riski doğması (ilk somut sınav).
- 2026 tam yıl ve 2027 sonrası İleri Malzemeler segment marjının H1 2026 seviyesinde (~%30) kalıcılaşması ya da Çin kaynaklı fiyat baskısıyla gerilemesi.
- Net borç/FAVÖK'ün (hangi tanımla hesaplanırsa hesaplansın) 2026-2027'de belirgin şekilde düşmesi ya da yükselmesi.
- 2026 kâr yılı (2027'de ödenecek) temettünün reel/USD bazda önceki 10 yıl bandının üstüne çıkıp çıkmaması — bu, "artık gerçek bir büyüme trendi var" tezini destekler ya da çürütür.
- Tunus yatırımının 2028 hedefine göre zamanında/bütçe içinde ilerlemesi veya ertelenmesi.
- Akrilik elyaf segmentinde FAVÖK marjının (FY2025: %22,8) Çin kaynaklı arz fazlası nedeniyle kademeli erimesi.
- Akkök Holding'in pay alım/satım davranışındaki yön değişiklikleri (içerden güven sinyali takibi).
- Kâr payı stopaj oranında yeni bir Cumhurbaşkanlığı Kararı ile değişiklik (son 5 yılda iki kez değişmiştir; bu yapısal bir belirsizlik kaynağıdır).

## 12. Kaynaklar, tarih ve doğrulama

**Birincil kaynaklar (bu oturumda doğrudan okunmuş/çekilmiş):**
- Aksa Akrilik "Sermaye Temettü Bilgileri" sayfası — https://www.aksa.com/yatirimci-iliskileri/hisse-verileri/sermaye-temettu-bilgileri — gözlem 2026-11-10; ham HTML tablo doğrudan çekildi, 2008-2025 kâr yılı satırları tek tek doğrulandı.
- Aksa Akrilik 31.12.2025 konsolide finansal tablolar (`outputs/research-aksa-20261031/fy.txt`, kaynak PDF: asset.aksa.com, yayın 2026-02-19/20) — gelir tablosu, Not 4 (segment), nakit akış tablosu.
- Aksa Akrilik 31.12.2024 konsolide finansal tablolar (`fy2024.txt`) — gelir tablosu, Not 4.
- Aksa Akrilik 31.12.2023 konsolide finansal tablolar (`fy2023.txt`) — gelir tablosu (Mısır iştiraki satışı dipnotu dahil).
- Aksa Akrilik 31.12.2022 konsolide finansal tablolar (`fy2022.txt`) — gelir tablosu.
- Aksa Akrilik 31.12.2021 konsolide finansal tablolar (`fy2021.txt`) — gelir tablosu, nakit akış tablosu.
- Aksa Akrilik 30.06.2026 ara dönem özet konsolide finansal tablolar (`h1.txt`, kaynak PDF yayın 2026-09-17) — Not 3 (segment), Not 5 (finansal borçlanmalar, vade/covenant).
- KAP 1581038 — 2026 kâr payı dağıtımına ilişkin kesinleşen bildirim — https://www.kap.org.tr/tr/Bildirim/1581038 — yayın 2026-03-31, gözlem 2026-11-10.
- KAP 1667893 — Tunus üretim tesisi yatırımı özel durum açıklaması — https://www.kap.org.tr/tr/Bildirim/1667893 — yayın 2026-09-24, gözlem 2026-11-10 (`outputs/research-aksa-20261031/tunisia.txt`).
- KAP şirket profili 840 — https://www.kap.org.tr/tr/sirket-bilgileri/ozet/840-aksa-akrilik-kimya-sanayii-a-s — gözlem 2026-11-10.
- Aksa Akrilik 2026 Haziran yatırımcı sunumu (`presentation.txt`, kaynak PDF yayın tarihi kesin saptanmadı, muhtemelen 2026-09) — kapasite/ihracat/2026 beklentisi, JCR notu, net borç/FAVÖK ifadesi.

**Bağımsız/çapraz kontrol kaynakları (bu oturumda yeni taranmış):**
- PwC Türkiye — "Kâr Payı Stopaj Oranını %15'e Çıkartan Cumhurbaşkanı Kararı" — https://www.pwc.com.tr/tr/hizmetlerimiz/vergi/bultenler/2024/kar-payi-stopaj-oranini-15e-cikartan-cumhurbaskani-karari.html — 22.12.2024 kararı.
- Lebib Yalkın — "Kâr Paylarında Stopaj Oranı Yüzde 10'dan Yüzde 15'e Yükseltildi" — https://lebibyalkin.com.tr/haber/kar-paylarinda-stopaj-orani-yuzde-10dan-yuzde-15e-yukseltildi
- Andersen Türkiye — "2021-87 Kar Dağıtım Stopajları Düşürüldü" — https://tr.andersen.com/tr/mevzuat-sirkulerleri/detay/2021-87-Kar-Dagitim-Stopajlari-Dusuruldu/12/326/0 — 22.12.2021'den itibaren %10.
- Addleshaw Goddard — "AG advises Aksa Akrilik on $125 million acquisition of Dow's stake in DowAksa joint venture" — https://www.addleshawgoddard.com/en/news/2025/ag-advises-aksa-akrilik-$125-million-acquisition-dows-stake-dowaksa-joint-venture/
- Türkiye Today — "Turkish Aksa Akrilik takes full control of carbon fiber venture in $125M deal with Dow" — https://www.turkiyetoday.com/business/turkish-aksa-akrilik-takes-full-control-of-carbon-fiber-venture-in-125m-deal-with-dow-3202323
- JEC Composites — "DowAksa will continue its operations under the name Aksa Carbon" — https://www.jeccomposites.com/news/spotted-by-jec/dowaksa-will-continue-its-operations-under-the-name-aksa-carbon/
- Rota Borsa — "Akkök Holding'den Aksa Akrilik'te (AKSA) hisse alış açıklaması" — https://rotaborsa.com/akkok-holdingden-aksa-akrilikte-aksa-hisse-alis-aciklamasi-13/ — ortaklık payı güncellemesi.
- TÜİK TÜFE yıllık enflasyon oranları (2015-2025), ikincil derleme — alomaliye.com "Yıllara Göre Enflasyon Oranları 1965-2026" — https://www.alomaliye.com/2025/07/04/yillara-gore-enflasyon-oranlari/ — reel temettü hesaplamasında kullanıldı; resmi TÜİK portalından birincil doğrulama bu oturumda yapılamadı (bağımsız ikincil derleme, çoklu kaynakta tutarlı rakamlar).
- Yahoo Finance USD/TRY (TRY=X) günlük kapanış serisi (`outputs/research-aksa-20261031/fx.json`) — USD bazlı temettü hesaplamasında kullanıldı; TCMB resmi kuru bu oturumda çapraz kontrol edilmedi (açık karar, kök CLAUDE.md).
- S&P Global, Mordor Intelligence, Persistence Market Research ve benzeri pazar araştırması özetleri (WebSearch sonucu, birincil rapor satın alınmadı) — akrilik/karbon elyaf küresel arz-talep bağlamı için.
- carbonfibermaterial.com, faxiangongchang.com (China Carbon Fiber 2026) — karbon elyaf fiyat/kapasite verisi, ikincil sektör analizi.

**Doğrulama notu:** Bu rapor, aynı ajan tarafından araştırılıp aynı oturumda gözden geçirilmiştir — **bağımsız bir ikinci inceleme değildir**. Şirketin kendi birincil belgeleri (finansal tablolar, KAP, IR sayfası) ile elde edilen sayılar bu oturumda en az bir kez başka bir birincil belgeyle veya iç tutarlılık kontrolüyle (toplam ÷ pay sayısı = pay başı tutar; segment toplamları = konsolide toplam; borç rollforward açılış/kapanışı) çapraz doğrulanmıştır. Stopaj oranı bulgusu, bağımsız hukuk/vergi kaynaklarıyla doğrulanmış ve önceki Investulator araştırmasındaki hatayı düzeltmiştir. Üçüncü taraf pazar araştırması özetleri (akrilik/karbon elyaf küresel arz-talep) WebSearch'ün kendi özetlediği ikincil veriler olup birincil raporların kendisi satın alınıp okunmamıştır; bu nedenle bu rakamlar (fiyat seviyeleri, kapasite tonajı) **gösterge niteliğinde** kabul edilmeli, kesin istatistik olarak kullanılmamalıdır.
