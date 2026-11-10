# TUPRS (Türkiye Petrol Rafinerileri A.Ş. / Tüpraş) — Temettü Odaklı Eleme Araştırması

**Araştırma kesim tarihi:** 2026-11-10, Europe/Istanbul.
**Kapsam notu:** Bu çalışma bugünkü fiyattan alım tavsiyesi veya hedef fiyat üretimi DEĞİLDİR. Soru: TUPRS 10-15 yıllık temettü/temettü büyümesi odaklı bir BIST portföyünün çekirdek (A) ya da koşullu (B) adayı mı, (C) uygun değil mi, yoksa (D) veri yetersiz mi?
**Önceki Investulator verisi hakkında not:** `investulator-fe/src/data/research/tuprs-*` ve kök `TUPRS_GERCEK_VERI_DOGRULAMASI_20261022.md` / `FINANSAL_ANALIZ_KAYNAK_MUTABAKATI_20261022.md` dosyaları başlangıç/karşılaştırma referansı olarak okundu; bu dosyalardaki 159,07/171,92/227,70 TL adil değer senaryolarının üçü de 2026-11-07 denetiminde NEEDS_REVIEW bulunmuştu. Bu raporda o senaryolar tekrar üretilmedi veya doğrulanmadı — bağımsız bir eleme değerlendirmesi yapıldı, Investulator içi BLOCKED/NEEDS_REVIEW kararlarına dokunulmadı.

---

## 1. Şirketin iş modeli

Tüpraş, Türkiye'nin tek entegre petrol rafinaj şirketi; Kırıkkale, İzmir (Aliağa), Körfez (Kocaeli) ve Batman'da dört rafineriyle toplam ~28,1 milyon ton/yıl ham petrol işleme kapasitesine sahip, Avrupa'nın 7., dünyanın 36. büyük rafinerisi olarak tanıtılıyor (şirket kurumsal tanıtım materyali). Ürün yelpazesi benzin, motorin, jet yakıtı, LPG, baz yağ ve petrokimya ara ürünlerini kapsar; 2025'te ~29,4 milyon ton ürün satışı gerçekleşti, satışların yaklaşık %20'si uluslararası (ihracat) kanaldan.

İş modeli klasik "crack spread" (kırma marjı) ekonomisine dayanır: gelir ham petrol fiyatından çok, rafine ürün fiyatı ile ham petrol fiyatı arasındaki farktan (net rafineri marjı, USD/varil) ve kapasite kullanım oranından (şirket kurumsal materyalinde %90-95 bandı belirtiliyor) etkilenir. Koç Holding ana hissedar; şirket kamuya açık BIST şirketi olup halka açıklık oranı ve ortaklık yapısı yatırımcı ilişkileri sayfasında (`tupras.com.tr/tr/sermaye-yapisi`) yayımlanır — bu çalışmada ortaklık yapısı yüzdeleri bağımsız olarak tekrar doğrulanmadı (veri eksiği, bölüm 9).

Rafine ürün fiyatı küresel emtia piyasalarıyla (çoğunlukla USD) ilişkili olduğundan, Tüpraş'ın geliri fiilen dolarize bir yapı taşır; bu hem USD bazlı yatırımcı için doğal bir kur-telafi mekanizması hem de TL maliyet/temettü tarafında döngüsel oynaklık kaynağıdır. RUP (fuel-oil dönüşüm) tesisi 2015'te devreye girmiş olup düşük değerli ürünleri yüksek değerli ürüne çeviren kapasite, marj direncini artıran yapısal bir unsurdur (şirket faaliyet raporları ve yatırımcı sunumları).

## 2. 2016-2025 temettü geçmişi tablosu

Birincil kaynak: Tüpraş'ın kendi resmi "Temettü Ödeme Tarihçesi" PDF'i (`tupras.com.tr/assets/all-pdfs/temettu-odeme-tarihcesi.pdf`, erişim 2026-11-10) — sol sütun **kârın ait olduğu yıl**, sağ sütun 1 TL nominal değerli paya isabet eden **net** kâr payı yüzdesi. Bu, şirketin kendi arşividir; tabloda 2025 kâr yılı (2026'da ödenen) yoktu, bu satır için KAP/MKK birincil bildirimleri (`FINANSAL_ANALIZ_KAYNAK_MUTABAKATI_20261022.md`'de mutabık kılınan MKK #1671443 ve KAP kaynaklı değerler) kullanıldı. Brüt/net oranı (stopaj etkisi) 2023-2024 ödemelerinde ~%90 net/brüt (yani ~%10 stopaj), 2025 ödemelerinde ~%85 net/brüt (~%15 stopaj) olarak gözlemlendi — bu, vergi mevzuatından bağımsız doğrulanmış bir oran değil, iki farklı kaynaktaki (şirket net-% arşivi ile KAP/MKK brüt tutarları) rakamların çapraz bölünmesinden çıkan **gözlemdir**; resmi stopaj mevzuatı ayrıca doğrulanmadı (veri eksiği, bölüm 9).

Pay başına tutarlar **nominal (dönemin kendi TL'si), split-ayarlanmamış** basılmıştır — yani 2023 öncesi satırlar, Nisan 2023'teki %600 bedelsiz pay dağıtımından (1 eski paya 7 yeni pay; KAP/MKK #1132302) ÖNCEKİ eski pay birimindedir. 2023 sonrası satırlar yeni (post-split) pay birimindedir. Aynı tabloda iki birimi doğrudan karşılaştırmak (ör. 2022 öncesi "pay başına" ile 2023 sonrası "pay başına") split etkisini görmezden gelir; büyüme yorumu bölüm 3'te bu ayrım gözetilerek yapılmıştır.

| Ödeme yılı | Kârın ait olduğu yıl | Ödendi mi | Taksit | Ödeme tarihi | Brüt TL/pay | Net TL/pay | Kaynak / not |
|---|---|---|---|---|---:|---:|---|
| 2016 | 2015 | Evet | Tek | 2016-04-06 | 6,50 | 5,5250 | Şirket arşivi (net %552,50) + ikincil haber kaynağı (brüt); split öncesi pay birimi |
| 2017 | 2016 | Evet | Tek | 2017-04-04 | 6,22 | 5,2853 | Şirket arşivi (net %528,53) + ikincil haber kaynağı (brüt); split öncesi |
| 2018 | 2017 | Evet | Tek | 2018-03-29 | 13,60 | 11,5626 | Şirket arşivi (net %1.156,26) + ikincil haber kaynağı (brüt); split öncesi |
| 2019 | 2018 | Evet | Tek | 2019-03-28 | 15,15 | 12,8775 | Şirket arşivi (net %1.287,75) + ikincil haber kaynağı (brüt); split öncesi |
| 2020 | 2019 | **Hayır** | — | — | 0,00 | 0,00 | Şirket arşivi: net %0,00 |
| 2021 | 2020 | **Hayır** | — | — | 0,00 | 0,00 | Şirket arşivi: net %0,00 (COVID-19 talep şoku, rafineri marjı çöküşü) |
| 2022 | 2021 | **Hayır** | — | — | 0,00 | 0,00 | Şirket arşivi: net %0,00 |
| 2023 | 2022 | Evet | 2 taksit | 2023-03-10 | ~45,41 (tahmini) | 40,8710 | Şirket arşivi (net %4.087,10); split öncesi pay birimi, ~%10 stopaj varsayımıyla brüt geri türetildi (dolaylı, doğrulanmamış) |
| 2023 | 2022 | Evet | 2. taksit | 2023-09-29 | 7,5254479 | 6,7729 | KAP kaynaklı (annual2024 kaynağı); **Nisan 2023 bedelsiz sonrası yeni pay birimi** (split sonrası) |
| 2024 | 2023 | Evet | 1. taksit | 2024-04-03 | 10,379928 | 9,3419 | Şirket arşivi net % + KAP kaynaklı brüt, tutarlı (~%90) |
| 2024 | 2023 | Evet | 2. taksit | 2024-09-27 | 11,9369175 | 10,7432 | Şirket arşivi net % + KAP kaynaklı brüt, tutarlı (~%90) |
| 2025 | 2024 | Evet | 1. taksit | 2025-03-28 | 7,7849461 | 6,6172 | Şirket arşivi net % + KAP kaynaklı brüt; net/brüt oranı ~%85, önceki yıldan farklı (stopaj değişikliği olabilir, doğrulanmadı) |
| 2025 | 2024 | Evet | 2. taksit | 2025-09-30 | 7,4216486 | 6,3084 | Şirket arşivi net % + KAP kaynaklı brüt; aynı not |
| 2026 | 2025 | Evet | 1. taksit | 2026-03-16 | 10,3799282 | ~8,82 (tahmini, ~%85 varsayımıyla) | KAP kaynaklı brüt; toplam taksit gruplandırmasına göre %51,19 pay |
| 2026 | 2025 | Evet | 2. taksit | 2026-09-30 (KAP'ta 2026-10-02 gerçekleşme) | 6,7469533 | — | **MKK #1671443** (gerçekleşen ödeme, %674,69533 brüt) — bu çalışmanın tek doğrudan MKK ile teyitli satırı |

**Toplam nakit temettü (TL):** 2025 kâr yılı (2026'da ödenen) için ikincil haber kaynaklarında (Forbes Türkiye, Investing.com Türkiye — aynı KAP/GK açıklamasının kopyaları, birbirinden bağımsız sayılmadı) toplam **~29,3 milyar TL** (1. taksit 15,0 milyar TL + 2. taksit 14,3 milyar TL) rakamı geçiyor; pay başına toplam brüt 17,1268815 TL ile (tahmini ~1,71-1,75 milyar pay) çarpıldığında ~29,3-30,0 milyar TL bandı tutarlı çıkıyor ama KAP'ın birincil genel kurul kâr dağıtım tutanağı bu çalışmada doğrudan indirilip teyit edilmedi — **bu toplam TL rakamı ikincil kaynaklıdır, birincil KAP belgesiyle bire bir doğrulanmamıştır** (veri eksiği, bölüm 9). Diğer yılların toplam nakit tutarı (pay sayısı × pay başına tutar) bu çalışmada hesaplanmadı çünkü her dönemin tam pay sayısı (treasury pay düşülmüş/düşülmemiş) teyit edilmedi.

**Süreklilik özeti (son 10 ödeme yılı, 2016-2025):** 10 yıldan **7'sinde ödeme yapıldı, 3'ünde yapılmadı** (2020, 2021, 2022 ödeme yılları — sırasıyla 2019, 2020, 2021 kâr yıllarına karşılık gelir). Art arda ödemesizlik dönemi **3 yıl** (2020-2022 ödemeleri). 2023'ten itibaren (2022 kâr yılından başlayarak) kesintisiz ödeme ve ayrıca **yılda iki taksite geçiş** gözleniyor. Nominal TL bazında pay başına brüt temettü 2016'dan 2019'a (split öncesi birim) 6,50 → 15,15 TL'ye çıktı (yaklaşık 2,3 kat, 3 yılda); 2023-2025 arası (split sonrası birim, kendi içinde tutarlı) toplam yıllık brüt pay başına (iki taksit toplamı) 2023: ~13,98 TL (tahmini, split sonrası taksit) + split öncesi taksit ayrı; 2024: 10,38+11,94=22,32 TL; 2025: 7,78+7,42=15,21 TL; 2026 (2025 kârından): 17,13 TL. **Reel TL ve USD bazında büyüme bu raporda hesaplanmadı** — TÜFE endeksi/baz tarih seçimi ve ödeme günü TCMB kuru çifti sistematik olarak derlenmediği için (veri eksiği, bölüm 9); yalnızca nominal TL tutarlar ve yön (artış/azalış) burada raporlanıyor, tek bir "büyüme oranı" uydurulmadı.

## 3. Temettü sürekliliği ve büyümesi

- **Kesinti dönemi:** 2019-2021 kâr yıllarına karşılık gelen üç art arda ödemesiz yıl, rafineri marjlarındaki zayıflama (2019 düşük marj, 2020 COVID-19 talep şoku) ve muhtemelen ilgili dönemdeki zarar/düşük kâr ile örtüşüyor (bkz. bölüm 5, 2020 faaliyet zararı). Bu, "tek yıllık zarar otomatik C değildir" ilkesiyle birlikte okunmalı: kesinti BİR yıl değil ÜÇ yıl sürdü, ama kriz sonrası (2022 kâr yılından itibaren) tam ve büyüyen biçimde geri döndü.
- **2014 kâr yılı da ödemesizdi** (şirket arşivinde net %0,00), yani 2014-2022 arası kâr yıllarının **üçü (2014, 2019, 2020, 2021 — dört yıl)** ödemesiz kaldı; bu TUPRS'ın temettü politikasının rafineri döngüsüne karşı "kesin/istikrarlı" değil **döngüsel ve kâr-bağımlı** olduğunu gösteriyor.
- **2023'ten itibaren yapısal değişim:** Yıllık tek taksitten iki taksite (Mart + Eylül) geçiş, aynı zamanda nominal tutarların kat kat artışıyla (Rusya-Ukrayna sonrası küresel rafineri marjı süper-döngüsünün 2022 kârına yansıması) çakışıyor. Bu büyümenin ne kadarının kalıcı/yapısal (RUP sonrası marj direnci, kapasite kullanımı) ne kadarının döngüsel (2022 marj şokunun tekrarlanmayacak olması) olduğu bu raporda ayrıştırılmadı — normalize edilmiş FAVÖK/marj analizi bölüm 5'te ele alınıyor.
- **10-15 yıllık bir portföy için kritik soru:** Geçmiş 10 yılda temettü "her yıl kesintisiz büyüyen" bir model DEĞİL, "döngüye bağlı, bazı yıllar sıfır, art arda zayıf yıllarda 2-3 yıl ödemesiz, güçlü döngüde iki taksitli ve hızlı büyüyen" bir model sergiledi. Bu, klasik "temettü aristokratı" (her yıl kesintisiz artan) profiliyle **uyuşmuyor**; sektörün doğası (rafineri marjı döngüselliği) gereği beklenebilir bir davranış.

## 4. 2021-2025 nakit akışı ve payout analizi

Kaynak: `FINANSAL_ANALIZ_KAYNAK_MUTABAKATI_20261022.md`'de birincil belge (KAP + şirketin kendi konsolide CMB raporları) ile mutabık kılınmış 5 yıllık seri; bu çalışma bu rakamları tekrar üretmedi, olduğu gibi aldı ve payout/kapsam oranlarını buradan türetti. **Önemli kısıt:** 2021 ve 2022 nominal; 2023-2025 her yıl kendi yıl sonu satın alma gücündedir (TMS 29) — bu yüzden yıllar arası yüzde değişim DOĞRUDAN BÖLME ile hesaplanmadı, yalnızca aynı rapordaki karşılaştırmalı (bir önceki yıl, aynı baz) sütunlar kullanıldı.

| Yıl | Hasılat (milyar TL) | Ana ortaklık net kârı (milyar TL) | Ana ortaklık özkaynağı (milyar TL) | İşletme nakit akışı — CFO (milyar TL) | Yatırım harcaması — CAPEX (milyar TL) |
|---|---:|---:|---:|---:|---:|
| 2021 | 152,492019 | 3,494837 | 18,808958 | **-1,429088** | n/a (veri eksiği) |
| 2022 | 481,764656 | 41,044621 | 66,743279 | 43,913911 | n/a (veri eksiği) |
| 2023 | 686,528507 | 53,577336 | 200,763253 | 85,276324 | n/a (veri eksiği) |
| 2024 | 810,385588 | 18,315157 | 282,215289 | 35,271031 | n/a (veri eksiği) |
| 2025 | 830,356131 | 29,523183 | 364,099258 | 49,464734 | 19,118339 |

(Kaynak: `annual2022`/`annual2023`/`annual2024`/`annual2025` konsolide CMB raporları, KAP ile çift belge mutabakatı yapılmış; detay `outputs/tuprs-verification-20261022/reconciliation.json`.)

**2025 kapsam oranı (tek doğrulanmış yıl):** CFO 49,464734 milyar TL − CAPEX 19,118339 milyar TL = serbest nakit (yaklaşık, işletme sermayesi tek seferlik etkileri ayrıştırılmadı) 30,346395 milyar TL. Aynı yıl ödenen nakit temettü (2025 kâr yılı DEĞİL, 2025 takvim yılında fiilen ödenen — yani 2024 kârından, ayrıca 2026-10-02 MKK ödemesinin bir kısmı da 2025 dönemine düşebilir, bu ayrım tam netleştirilmedi) 34,844882 milyar TL olarak önceki mutabakatta notlandı. **Nakit (CFO) karşılama oranı = 49,464734 / 34,844882 ≈ 1,42 kat.** CAPEX sonrası (serbest nakit) karşılama oranı 30,346395 / 34,844882 ≈ **0,87 kat** — yani 2025'te nakit temettü, CAPEX sonrası serbest nakit akışını aşıyor; fark ya nakit tamponundan (şirket net nakit pozisyonunda, bkz. bölüm 5) ya da zamanlama farkından (ödenen temettü ile aynı yılın kârı farklı dönemlere ait) karşılanmış olabilir. **Bu TEK yıllık bir gözlemdir, 5 yıllık ortalama payout oranı bu raporda hesaplanmadı** çünkü 2021-2024 CAPEX rakamları güvenilir birincil kaynaktan derlenemedi (veri eksiği, bölüm 9) ve "ödenen temettü" ile "o yılın kârı" arasındaki taksit kayması (bir taksit bir takvim yılında, ikinci taksit sonraki yılda) payout oranını kâr yılı bazında hesaplamayı bu veri setiyle güvenilir kılmıyor.

**2021 dikkat çekici nokta:** CFO **negatif** (-1,429088 milyar TL) iken net kâr pozitif (3,494837 milyar TL) — işletme sermayesi/stok etkisi muhtemel neden (rafineri şirketlerinde stok değerleme kârı nakit akışına yansımaz); bu yıl zaten temettü ödenmedi (bölüm 3), dolayısıyla "kâr var ama nakit yok" durumu temettü kararıyla tutarlı davranış sergilemiş.

**Olağanüstü dağıtım / borç veya varlık satışıyla desteklenen dağıtım testi:** 2025 verisiyle şirket aynı yıl net nakit pozisyonunda (bkz. bölüm 5) olduğundan, temettünün borçlanmayla finanse edildiğine dair bir bulgu YOK. Ancak CAPEX sonrası serbest nakit akışının altında kalan bir dağıtım (0,87 kat) net nakit tamponunu eritme potansiyeli taşır; bu tek yıl için "kırmızı bayrak" değil ama çok yıllı ortalamayla (eksik veri nedeniyle hesaplanamadı) doğrulanmadıkça "sürdürülebilir" de denemez.

## 5. Finansal dayanıklılık

**Net borç / net nakit (H1 2026, en güncel mutabık rakam):** Finansal borç 68,200679 milyar TL; toplam nakit 195,840940 milyar TL (bloke olmayan nakit 167,355286 milyar TL); finansal yatırımlar 3,077642 milyar TL. Şirket tanımıyla net borç = 68,200679 − 167,355286 − 3,077642 = **−102,232249 milyar TL (net nakit).** Bu, 30.06.2026 tarihli konsolide ara dönem rapor bazındadır (KAP #1643116 ile şirket PDF'i çift mutabakatlı).

**Bağımsız çapraz kontrol (kredi derecelendirme kuruluşları, USD bazında, farklı tarih):** Fitch Ratings (Mart 2026 rapor aksiyonu, uzun vadeli yabancı/yerel para notu **BB- (Pozitif görünüm)**, ulusal ölçek **AAA(tur)**) 2025 yıl sonu için ~1,4 milyar USD FAVÖK, brüt kaldıraç **<1,0x**, nakit ~2,1 milyar USD'ye karşı toplam borç ~1,3 milyar USD (yani net nakit pozisyonu, USD bazında da) hesapladığını bildiriyor; Fitch 2026-2029 için kaldıracın düşük kalmasını bekliyor. Moody's Temmuz 2025'te notu Ba3'ten **Ba2 (Durağan)**'ye yükseltti. Bu iki derecelendirme kuruluşu kaynağı (ikisi de kendi bağımsız metodolojisiyle ayrı tarihte ayrı para biriminde) TL bazlı net nakit sonucunu YÖN olarak destekliyor (ikisi de net nakit/düşük kaldıraç diyor), ama TL rakamı (−102,2 milyar TL, 30.06.2026) ile USD rakamı (net nakit ~0,8 milyar USD, YE2025) **aynı tarih değil, doğrudan karşılaştırılabilir değil** — çapraz kontrol olarak yön tutarlılığı için kullanıldı, sayısal mutabakat iddiası yapılmadı.

**Net borç/FAVÖK, faiz karşılama oranı, borcun döviz/vade kompozisyonu:** Bu çalışmada güvenilir birincil kaynaktan (dipnot bazında döviz/vade kırılımı) doğrulanamadı — Fitch'in "brüt kaldıraç <1,0x" ifadesi dolaylı bir gösterge ama hangi FAVÖK tanımı/normalizasyon kullanıldığı açıklanmadığından bu raporda ayrı bir "Net borç/FAVÖK = X" rakamı ÜRETİLMEDİ (veri eksiği, bölüm 9).

**Kriz davranışı (2015-2016, 2020):** 2015-2016'da rafineri marjları aslında TOPARLANDI (Akdeniz marjı 5,95 USD/varil'e, Tüpraş net rafineri marjı 3,21'den 6,47 USD/varil'e yükseldi — RUP tesisinin 2015'te devreye girmesiyle çakışan bir dönem) ve bu dönemde temettü kesintisi YAŞANMADI (2015 ve 2016 kâr yılları ödendi). Asıl kesinti dönemi 2019-2021 kâr yıllarıydı (COVID-19 ve öncesi zayıf marj dönemi) — bölüm 3'te detaylandırıldı. 2020 yılında faaliyet zararı (-619 milyon TL, ikincil kaynaklı, birincil belgeyle bu çalışmada tekrar doğrulanmadı) bildiriliyor.

## 6. Büyüme ve rekabet avantajları

- **Yapısal konum:** Türkiye'nin TEK entegre büyük ölçekli rafinaj şirketi olması (coğrafi/regülasyon bariyeri yüksek bir sektörde) doğal bir yurt içi pazar gücü sağlıyor; ayrıca Avrupa'nın 7. büyük rafinerisi ölçeği bölgesel ihracat/arbitraj esnekliği veriyor (kurumsal tanıtım materyali, bağımsız doğrulanmadı).
- **Gelir/kâr büyümesi (nominal TL, 2021→2025):** Hasılat 152,5 → 830,4 milyar TL (~5,4 kat, 4 yılda); ana ortaklık net kârı 3,49 → 29,52 milyar TL (~8,5 kat) ama bu dönem içinde 2022'de marj süper-döngüsü (41,04 milyar TL kâr, tek yılda) ve 2024'te belirgin düşüş (18,32 milyar TL) var — **düz çizgi bir büyüme değil, yüksek döngüsellik.** Reel (TÜFE'ye göre düzeltilmiş) büyüme bu raporda hesaplanmadı (TMS 29 farklı baz yılları nedeniyle, bölüm 4'teki kısıt burada da geçerli).
- **CAPEX ve stratejik dönüşüm:** Şirketin kendi stratejik sunumlarında (2022-2035 dönemi için) belirtilen hedefler: Sürdürülebilir Havacılık Yakıtı (SAF) için ~800 milyon USD yatırım (şirketin kendi projeksiyonuyla kümülatif ~1,9 milyar USD FAVÖK beklentisi, 400 kton/yıl SAF kapasitesi, 2026'da ilk ko-process blended SAF piyasaya çıkışı hedefi) ve Yeşil Hidrojen için ~2,8 milyar USD yatırım (kümülatif ~2,0 milyar USD FAVÖK beklentisi). **Bunlar şirketin kendi ileriye dönük hedefleridir, gerçekleşmiş sonuç değildir** — "yönetim hedefi" ile "gerçekleşmiş olgu" ayrımı burada açıkça korunuyor.
- **Kapasite kullanımı:** Kurumsal materyalde %90-95 bandı belirtiliyor (26 milyon ton üretim / 30 milyon ton satış kapasitesi); bu yüksek kapasite kullanımı sabit maliyetlerin düşük birim maliyete yayılmasını sağlayan bir avantaj, ama aynı zamanda ek kapasite artış alanının sınırlı olduğunu da gösteriyor (büyüme CAPEX'i daha çok verim/dönüşüm odaklı olabilir — bu çıkarım bu raporda doğrulanmadı).
- **İhracat/çeşitlilik:** 2025'te satışların ~%20'si uluslararası; bu oran tek başına düşük-orta seviyede coğrafi çeşitlilik sağlıyor, asıl gelir hâlâ yurt içi pazara (Türkiye talebine) bağlı.

## 7. 10-15 yıllık yapısal riskler

- **Rafineri marjı döngüselliği:** Geçmiş 10 yıl, marjın (ve dolayısıyla kârın/temettünün) 3-8 kat aralığında dalgalandığını gösterdi (bölüm 4-6). 10-15 yıllık bir ufukta en az 1-2 döngüsel düşüş dönemi (temettü kesintisi dahil) beklenmelidir; bu geçmişte zaten gerçekleşti.
- **Enerji dönüşümü / karbon regülasyonu:** Uzun vadede küresel benzin/motorin talebinin elektrikli araç penetrasyonu ve AB sınır karbon düzenlemeleri (CBAM) gibi mekanizmalarla baskı altında kalması olası bir yapısal risk; şirketin SAF/yeşil hidrojen yatırımları bu riske karşı bir hedge stratejisi olarak sunuluyor ama bu yatırımların hedeflenen FAVÖK katkısını (toplam ~3,9 milyar USD kümülatif, iki proje birlikte) ne zaman ve ne ölçüde gerçekleştireceği belirsiz; proje bazlı gecikme/maliyet aşımı riski CAPEX yükünü artırabilir ve temettü kapasitesini daraltabilir.
- **Ham petrol tedarik riski:** Türkiye'nin ham petrol ithalatçısı konumu, jeopolitik arz şokları (bölgesel çatışma, yaptırımlar, OPEC+ kararları) karşısında girdi maliyeti ve tedarik sürekliliği riski taşıyor; bu çalışmada spesifik tedarikçi/ülke yoğunlaşması verisi doğrulanmadı (veri eksiği).
- **Döviz/borç yapısı riski:** Gelir büyük ölçüde dolarize (ürün fiyatları) olsa da, maliyet tarafında (personel, yerel hizmetler, vergi) TL kalemleri var; borcun döviz kompozisyonu bu raporda doğrulanamadı (bölüm 5) ama rafineri sektöründe tipik olarak borç da dolar/euro ağırlıklı olur — bu "doğal korunma" sağlar ama TL'nin reel değer kaybı/kazanımı döngüleri temettünün TL ve USD bazındaki büyümesini FARKLI hikayelere dönüştürebilir (USD yatırımcı için kur etkisi ayrıca izlenmeli).
- **Regülasyon/vergi riski:** Dividend stopaj oranının 2023-2024 döneminde ~%10'dan 2025'te ~%15'e çıkmış görünmesi (bölüm 2'deki gözlem, doğrulanmamış) net temettü getirisini etkileyebilecek bir vergi politikası değişkenliği sinyali; bu konuda birincil mevzuat kaynağı bu raporda taranmadı.

## 8. Olumlu ve olumsuz kanıtlar

**Olumlu:**
- Türkiye'nin tek büyük ölçekli entegre rafinaj şirketi, yüksek kapasite kullanımı (%90-95) ile yapısal pazar gücü.
- 2022 kâr yılından itibaren kesintisiz ve iki taksitli, nominal olarak büyüyen temettü ödemesi (2023-2026 arası 4 art arda ödeme yılı).
- H1 2026 itibarıyla güçlü net nakit pozisyonu (−102,2 milyar TL net borç, yani net nakit) ve iki bağımsız kredi derecelendirme kuruluşunun (Fitch, Moody's) düşük kaldıraç/pozitif görünüm teyidi.
- 2025'te nakit temettü, aynı yılın işletme nakit akışının 1,42 katı karşılanabilir düzeyde (CAPEX öncesi).
- SAF ve yeşil hidrojen gibi somut, bütçelenmiş (toplam ~3,6 milyar USD) dönüşüm yatırımlarıyla uzun vadeli yapısal riske karşı aktif pozisyon alma.

**Olumsuz:**
- Son 10 ödeme yılının 3'ünde (art arda) hiç temettü ödenmedi (2020-2022 ödeme yılları); temettü politikası "istikrarlı artan" değil "döngüye bağlı" bir modeldir.
- Kâr ve temettü büyümesi son 5 yılda yüksek oynaklık gösterdi (2022 kârı 2021'in ~12 katı, 2024 kârı 2023'ün ~1/3'ü); büyük kısmı 2022 marj süper-döngüsünden kaynaklanıyor olabilir, kalıcılığı belirsiz.
- 2021'de pozitif kâra rağmen negatif işletme nakit akışı gözlendi; 2025'te CAPEX sonrası serbest nakit akışı dağıtılan temettüyü tam karşılamıyor (0,87 kat) — tek yıllık gözlem olsa da izlenmesi gereken bir sinyal.
- Dividend stopaj oranının yıllar arası değişken görünmesi net getiri öngörülebilirliğini azaltabilir.
- Enerji dönüşümü ve karbonsuzlaşma baskısı, 10-15 yıllık ufukta iş modelinin çekirdeğini (fosil yakıt rafinajı) yapısal olarak zayıflatma potansiyeli taşıyor; şirketin buna karşı yatırımları henüz gerçekleşmiş sonuç üretmedi.

## 9. Veri eksikleri ve çelişkiler

1. **2021-2024 CAPEX ve çok yıllı FCF/payout serisi eksik.** Yalnızca 2025 (ve H1 2026) için güvenilir CAPEX rakamı derlenebildi. Bu, bölüm 4'teki "ortalama payout/FCF karşılama" sonucunun 5 yıllık değil tek yıllık kalmasına neden oldu. Kararı etkiler: 5 yıllık ortalama karşılama oranı A/B ayrımında kullanılamadı. Olası kaynak: Tüpraş'ın 2021-2024 konsolide nakit akış tablolarının doğrudan indirilip "annual2022/2023/2024" belgelerindeki CAPEX satırının ayrıca çıkarılması (bu oturumda zaman kısıtı nedeniyle tamamlanmadı).
2. **Toplam nakit temettü tutarları (TL) çoğu yıl için doğrudan KAP genel kurul tutanağıyla teyit edilmedi**, yalnızca pay başına tutar × tahmini pay sayısı ile çapraz kontrol edildi (2025/2026 ödemesi için ikincil haber kaynaklarıyla yaklaşık tutarlılık bulundu, ~29,3-30,0 milyar TL bandı). Kararı etkiler: payout oranının TL cinsinden kesin büyüklüğü belirsiz. Olası kaynak: KAP'ın ilgili genel kurul kâr dağıtım tablosu bildirimlerinin (her yıl için ayrı bildirim ID) tek tek indirilmesi.
3. **Borcun döviz/vade kompozisyonu ve net borç/FAVÖK, faiz karşılama oranı birincil dipnot kaynağından doğrulanmadı.** Yalnızca toplam finansal borç/nakit/net nakit (H1 2026) ve kredi derecelendirme kuruluşlarının dolaylı USD bazlı kaldıraç yorumu var. Kararı etkiler: finansal dayanıklılığın "ne kadar sağlam" olduğu yönü (net nakit) netken büyüklüğü (kaldıraç oranı, döviz riski büyüklüğü) tam nicelleştirilemedi. Olası kaynak: yıllık faaliyet raporlarının borç dipnotları.
4. **Pay sayısı/sermaye yapısının güncel ve tarihsel kesin değeri teyit edilmedi** — bir web araması Tüpraş'a ait olduğu şüpheli, muhtemelen hatalı/başka şirkete ait bir "1 Kuruş nominal, 192 milyar pay" rakamı döndürdü; bu rakam KULLANILMADI, güvenilmez olarak işaretlendi. 250.419.100-250.419.200 TL (split öncesi) ve 7 kat (split sonrası, ~1,75 milyar pay) tahmini kullanıldı ama birincil KAP/MKK sermaye yapısı bildirimiyle bu oturumda teyit edilmedi.
5. **Dividend stopaj oranının yıllar arası görünen değişimi (%10'dan %15'e, 2025 ödemelerinde) mevzuat kaynağıyla doğrulanmadı**, yalnızca iki farklı veri setinin (net % arşivi vs. brüt KAP/MKK tutarı) bölünmesinden çıkan dolaylı bir gözlemdir.
6. **2016-2020 hasılat/kâr rakamları ikincil (haber/analiz) kaynaklıdır**, bu oturumda birincil CMB/KAP raporlarıyla çift mutabakat yapılmadı (yalnızca 2021-2025 birincil mutabakatlıdır, önceki Investulator çalışmasından devralındı). Kararı etkiler: 2016-2020 dönemi için bölüm 4 tarzı kesin FCF/payout hesaplaması yapılamadı, yalnızca temettü ödeme/ödememe olgusu (bölüm 2-3, birincil şirket arşivinden) güvenilir.
7. **Pay başına toplam brüt/net karşılaştırmasında 2023'ün ilk taksiti (2023-03-10, split öncesi) için brüt tutar dolaylı/tahmini olarak geri türetildi** (net %4.087,10'dan %10 stopaj varsayımıyla); bu satır KESİN değil, tahminidir ve öyle işaretlendi.

**Çelişki:** Bir ikincil kaynak (WebSearch sentezi) "2025 hesap dönemi için ... 28 Mart 2025 ... 30 Eylül 2025" ifadesiyle FY2025 kârının 2025 içinde dağıtıldığını ima etti; bu KRONOLOJİK OLARAK İMKANSIZDIR (FY2025 kârı ancak 2026 başında kesinleşip dağıtılabilir) ve muhtemelen 2026 tarihlerinin yanlış yazılmasından kaynaklanıyor. Bu çalışmada bu tarihler KAP/MKK ile çapraz kontrol edilerek (2026-03-16 ve 2026-09-30/10-02) düzeltildi; toplam tutar (29,3 milyar TL) ve pay başına brüt (17,1268815 TL) rakamları kendi içinde tutarlı olduğundan korundu, yalnızca tarih etiketi düzeltildi.

## 10. A/B/C/D ön sınıflandırması ve gerekçesi

### Kategori: **B — Koşullu aday**

**Gerekçe:**
- **A (çekirdek) için yeterli değil** çünkü: (i) son 10 yılda 3 art arda ödemesiz yıl var — "her yıl kesintisiz ödeyen/büyüyen" bir çekirdek temettü hissesi profiline uymuyor; (ii) kâr ve temettü büyümesi büyük ölçüde 2022 marj süper-döngüsünden besleniyor, normalize/sürdürülebilir büyüme oranı bu raporda ayrıştırılamadı; (iii) çok yıllı FCF/payout karşılama oranı (yalnızca tek yıl var) sürdürülebilirliği kanıtlamıyor.
- **C (uygun değil) için de yeterli değil** çünkü: (i) geçmişteki ödemesizlik dönemleri her zaman sonradan tam ve büyüyerek telafi edildi (ödeme şirketin iflası/temelli bozulması değil, döngüsel bir duraklamaydı); (ii) H1 2026 itibarıyla güçlü net nakit pozisyonu ve iki bağımsız derecelendirme kuruluşunun düşük kaldıraç teyidi var — finansal yapı kırılgan değil; (iii) yapısal konum (ülkenin tek büyük rafinerisi) ve somut dönüşüm yatırım planı mevcut; tek yıllık zarar/kesinti otomatik C saymama ilkesi burada açıkça geçerli.
- **D (veri yetersiz) için de tam uymuyor** çünkü karar için gereken ANA sorular (temettü tarihi, süreklilik olgusu, net borç yönü, kredi notu, yapısal risk haritası) güvenilir birincil/yarı-bağımsız kaynaklarla cevaplanabildi; eksik olan (CAPEX çok yıllı seri, kesin toplam TL tutarları, borç FX kompozisyonu) kararı A/B arasında değil, B içinde "ne kadar güçlü B" sorusunu etkiliyor — eksiklik kararı tamamen engellemiyor.

**Sonuç:** TUPRS, sektörel döngüselliği (rafineri marjı, enerji dönüşümü riski) nedeniyle 10-15 yıllık bir temettü portföyünde **tek başına çekirdek/ağırlıklı pozisyon olarak değil**, döngüsel bir **tamamlayıcı/koşullu** pozisyon olarak değerlendirilebilir — "koşul" burada: (a) çok yıllı payout/FCF karşılama oranının gelecek 2-3 yılda sürdürülebilir kalması, (b) temettü kesinti riskinin portföy genelinde diğer, daha az döngüsel adaylarla dengelenmesi.

## 11. Kararı değiştirebilecek gelişmeler

- 2021-2024 CAPEX/FCF serisinin tam derlenmesi ve çok yıllı payout/FCF karşılama oranının (yalnızca 2025 değil) hesaplanması — eğer ortalama karşılama oranı istikrarlı biçimde 1,0 katın üzerinde çıkarsa B→A yönünde güçlendirici; 1,0 altına düşerse sürdürülebilirlik endişesini pekiştirir.
- Borcun döviz/vade kompozisyonunun dipnot bazında doğrulanması — eğer borç ağırlıklı dolar/euro ise "doğal korunma" tezi güçlenir; TL ağırlıklıysa kur riski endişesi artar.
- SAF/yeşil hidrojen yatırımlarının ilk somut FAVÖK katkısının 2026-2027'de gerçekleşip gerçekleşmediği — gecikme/maliyet aşımı B kategorisini zayıflatabilir, zamanında ve bütçe içinde gerçekleşme uzun vadeli tez için pozitif.
- Önümüzdeki 1-2 döngüsel düşüş döneminde (marj daralması) temettü politikasının nasıl davrandığı (yine tam kesinti mi, yoksa kısmi/azaltılmış ödeme mi) — davranış değişikliği (kısmi ödeme) B→A güçlendirici bir sinyal olurdu.
- Stopaj/vergi mevzuatındaki değişikliklerin net temettü getirisine etkisinin netleşmesi.
- Enerji dönüşümü/CBAM gibi düzenlemelerin somut, tarihli bir etki tahmini ile netleşmesi (şu an yalnızca niteliksel risk olarak işaretli).

## 12. Kaynak bağlantıları, erişim tarihi ve doğrulama durumu

Tüm erişim tarihleri **2026-11-10**'dur (aksi belirtilmedikçe).

| Kaynak | URL | Yayın tarihi | Bağımsız mı | Not |
|---|---|---|---|---|
| Tüpraş — Temettü Ödeme Tarihçesi (resmi PDF) | https://www.tupras.com.tr/assets/all-pdfs/temettu-odeme-tarihcesi.pdf | Belirsiz (PDF meta "Haziran 2025" ama 2024 kâr yılı verisi içeriyor, muhtemelen sonradan güncellendi) | Birincil (şirketin kendi arşivi) | Bu raporun temettü tablosunun ANA kaynağı; 2025 kâr yılını içermiyor |
| TUPRS_GERCEK_VERI_DOGRULAMASI_20261022.md (Investulator iç belgesi) | (yerel dosya, repo köku) | 2026-10-22 | Birincil belge mutabakatı (KAP+şirket PDF çift kontrollü) | 2021-2025 finansal seri, H1 2026 borç/nakit mutabakatı buradan alındı |
| KAP #1643116 ile Tüpraş H1 2026 konsolide raporu | https://www.kap.org.tr/tr/Bildirim/1643116 | 2026 (H1) | KAP birincil + şirket birincil, çift belge mutabakatlı | 14 ana satır eşleşti (önceki mutabakat çalışmasında) |
| MKK #1671443 | https://www.kap.org.tr/tr/Bildirim/1671443 | 2026-10 (gerçekleşme 2026-10-02) | Birincil (saklama kuruluşu) | %674,69533 brüt = 6,7469533 TL/pay gerçekleşen ödeme |
| MKK #1132302 (bedelsiz pay) | https://kap.org.tr/tr/api/BildirimPdf/1132302 | 2023-04 | Birincil | %600 bedelsiz, 1 eski paya 7 yeni pay |
| Fitch Ratings — Tüpraş kredi notu haberleri | (ikincil haber siteleri: capital.com.tr, paratic.com, ekoturk.com) | 2026-03 (rapor aksiyonu) | **Bağımsız değil** — üçü de aynı Fitch basın açıklamasının kopyası/özeti | BB- (Pozitif), AAA(tur), FAVÖK/kaldıraç rakamları bu ikincil özetlerden; Fitch'in kendi orijinal rapor PDF'i bu oturumda indirilmedi |
| Moody's kredi notu haberleri | (ikincil: capital.com.tr, paratic.com, hisse.net, borsamatik.com.tr) | 2025-07 (yükseltme) | **Bağımsız değil** — aynı Moody's açıklamasının kopyaları | Ba3→Ba2 (Durağan) |
| Tüpraş yatırımcı sunumu, Kasım 2026 ve stratejik dönüşüm planı | https://www.tupras.com.tr/assets/all-pdfs/tupras-strateji-yatirimci-sunumu-guncelleme-2025.pdf (ve aylık sunum PDF'leri) | 2025-2026 | Birincil (şirket) | SAF/yeşil hidrojen CAPEX ve kümülatif FAVÖK hedefleri; bu belgelerin içeriği bu oturumda satır satır indirilip okunmadı, yalnızca arama motoru özeti kullanıldı — **tam doğrulanmadı, ikincil düzeyde güven** |
| Tüpraş sermaye yapısı sayfası | https://tupras.com.tr/tr/sermaye-yapisi | — | Birincil (sayfa linki bulundu ama içerik bu oturumda indirilip okunmadı) | Pay sayısı/ortaklık yüzdeleri TEYİT EDİLMEDİ |
| 2016-2020 hasılat/kâr verisi (ikincil arama sentezi) | Çeşitli (uzmanpara.milliyet.com.tr, aydinlik.com.tr vb., tam URL'ler kaydedilmedi) | Çeşitli | **Bağımsız değil / birincil belge yok** | Bölüm 2016-2020 için düşük güven; yalnızca "ödeme olgusu" (şirket arşivinden) yüksek güvenle kullanıldı, TL rakamları düşük güvenle |
| 2025 kâr yılı toplam temettü (29,3 milyar TL) haberleri | forbes.com.tr, tr.investing.com | 2026 (muhtemelen) | **Bağımsız değil** — ikisi de aynı KAP/GK açıklamasının haber kopyası | Toplam TL tutarı ve taksit yüzdeleri burada; birincil KAP genel kurul tutanağı bu oturumda ayrıca indirilmedi |

**Genel doğrulama durumu:** PARTIAL. Temettü ödeme/ödememe OLGUSU (2016-2026, hangi yıl ödendi/ödenmedi) ve 2021-2025 ana finansal büyüklükler (hasılat, kâr, özkaynak, CFO) ile H1 2026 net nakit pozisyonu **birincil kaynaklarla sağlam** (çoğu çift belge mutabakatlı). Toplam TL temettü tutarları, çok yıllı CAPEX/FCF serisi, borç FX/vade kompozisyonu ve kredi notu detayları **ikincil kaynaklı veya kısmen doğrulanmamış**. Bu çalışma bağımsız bir denetim incelemesinden geçmedi (aynı ajan/oturum tarafından hazırlandı); Investulator'ın genel standardına göre bu **bağımsız inceleme sayılmaz**.
