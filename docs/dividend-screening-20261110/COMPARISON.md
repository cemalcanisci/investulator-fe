# 10 BIST Şirketi — Temettü Eleme Karşılaştırma Matrisi

**Araştırma kesim tarihi:** 2026-11-10, Europe/Istanbul
**Kapsam:** TUPRS, DOAS, FROTO, TOASO, TTRAK, ISMEN, YGGYO, AKSA, AKMGY, PAGYO
**Bu çalışma bugünkü fiyattan alım önerisi veya hedef fiyat üretme çalışması DEĞİLDİR.** Amaç, önümüzdeki 3-4 ay içinde başlanacak ve en az 10-15 yıl sürdürülecek bir temettü/temettü büyümesi odaklı portföy için şirketlerin çekirdek (A), koşullu (B), uygun olmayan (C) veya veri yetersiz (D) adaylığını değerlendirmektir. Yöntem detayı [METHODOLOGY.md](METHODOLOGY.md)'de, kalan veri eksikleri [DATA_GAPS.md](DATA_GAPS.md)'de.

Her satırın ayrıntılı gerekçesi, kanıtları ve kaynakları kendi raporunda: [`companies/<SEMBOL>.md`](companies/) ve [`companies/<SEMBOL>.json`](companies/). Her rapor **bağımsız bir ajan oturumunda**, ayrı bağımsız kaynak taramasıyla üretildi; Investulator'ın mevcut uygulama-içi araştırma dosyaları (`investulator-fe/src/data/research/*.json`) yalnızca **başlangıç/karşılaştırma referansı** olarak kullanıldı, bağımsız doğrulama sayılmadı ve bu çalışma onların BLOCKED/NEEDS_REVIEW kararlarını değiştirmedi.

## Dikkat çeken genel sonuç

**10 şirketin 10'u da B (koşullu aday) kategorisine düştü — hiçbiri A (çekirdek) ya da C (uygun değil) olarak sınıflandırılmadı, D (veri yetersiz) de yoktu.** Bu, "eşit şekilde vasat" demek değildir: B kategorisi içinde güç dereceleri çok farklıdır (aşağıdaki tabloya bakın). Ortak payda, hiçbir şirketin şu ikisini **aynı anda** karşılayamamasıdır: (a) 10-15 yıllık pencerede hiç kesinti/anomali olmadan öngörülebilir büyüyen bir temettü **ve** (b) bu sürekliliğin çok yıllı, tutarlı bir FCF/CFO karşılama serisiyle bağımsız olarak doğrulanabilmesi. Çoğu şirkette (a) kısmi olarak var ama (b) ya hiç hesaplanamadı ya da yalnızca 1 yıl için hesaplanabildi.

## Karşılaştırma matrisi

| Sembol | Kategori | 2016-2025 kesinti (ödeme yılı) | Güncel finansal dayanıklılık yönü | En kritik olumlu kanıt | En kritik olumsuz kanıt / risk |
|---|---|---|---|---|---|
| **TUPRS** | B | 3 yıl art arda (2020-2022) | Net nakit (H1 2026, -102,2 mr TL); Fitch BB-/Pozitif, Moody's Ba2 | 2022'den itibaren kesintisiz, büyüyen, iki taksitli temettü; tek büyük entegre rafineri | Büyüme büyük ölçüde 2022 marj süper-döngüsünden; FCF karşılama yalnızca 2025 için var (0,87x CAPEX-sonrası) |
| **DOAS** | B | 2 yıl (2017, 2020) | Net nakitten (~2021) net borca (~31 mr TL, 2026) geçiş; kredi notu A+(tr)→A(tr) | Çok markalı/asset-light distribütörlük; 2021'de krizden hızlı dönüş | FY2025 CFO negatif iken temettü ödendi; 2026 ödemesi net kârın ~2,1 katı (geçmiş yıl kârından) |
| **FROTO** | B | Yok (≈20 yıl kesintisiz) | Net borç 2020'den (~sıfır) 2024'e (~101,4 mr TL) hızlı artış, 2025'te hafif gerileme | ~20 yıl kesintisiz temettü; KAP'a bildirilmiş asgari %50 politika; ihracat/Euro doğal hedge | Net kâr 2 yıl art arda düştü; 2025 payout tahmini (%90-100) KAP tablosuyla teyit edilemedi |
| **TOASO** | B | Yok (≥12 yıl kesintisiz, 2018/2020/2021 geçişleri dahil) | Net nakitten (~2022-23) +3,37x net borç/FAVÖK'e (FY2025); 9A2026'da büyümeye devam | 12+ yıl kriz-dayanıklı, hep artan temettü; borcun ~%96'sı TL | 3 çeyrektir derinleşen stok/nakit akışı sorunu; Stellantis Otomotiv Pazarlama devralımının (Nisan 2025) iş modelini henüz test edilmemiş şekilde değiştirmesi |
| **TTRAK** | B | 2 yıl (2019, 2026[FY2025]) | Net nakitten (~FY2021-23) ~8 mr TL net borca (FY2025-26) tek yılda sert geçiş | 19 yıl pazar liderliği (%38-46); 2018-2019 şokundan kanıtlı toparlanma | FY2025 net kâr -%94 + 9A2026 net zarar, art arda iki kötü yıl; elektrikleşme riski hiç araştırılamadı |
| **ISMEN** | B | Yok (11 yıl kesintisiz) | Özkaynak asgari eşiğin ~93 katı (dolaylı tampon); gerçek düzenleyici sermaye yeterliliği oranı bilinmiyor | 2018/2020 kriz yıllarında kâr artışı (volatilite-pozitif iş modeli); ROE %20,7-34,7 | Payout oranı %17,5-~154 arası aşırı oynak; 2025 ödemesi görünürde FY2024 kârını aşıyor (açıklanamadı) |
| **YGGYO** | B | 1 yıl net (2024[FY2023], ayrı bir "olağanüstü" ödeme var) | Net nakit (+2,48 mr TL, H1 2026), pratikte borçsuz (SPK borçlanma oranı %0,11) | %0 stopaj + %99,9 doluluk; 2025+ yasal asgari %50 dağıtım zorunluluğu | Tek varlık/tek şehir (Ankara); FY2024 IFRS zararına rağmen nakit temettü ödendi (mekanizma netleşmedi); PROEN üzerinden enerjiye büyük sermaye kayması |
| **AKSA** | B | Yok (11 yıl kesintisiz) | Finansal borç 2025'te ~3 katına çıktı (DowAksa/Aksa Carbon satın alımı); covenant ihlali riski doğup feragatle aşıldı | İleri Malzemeler (karbon elyaf) segmenti H1 2026'da %30,2 FAVÖK marjı | Reel/USD bazda 10 yılda net temettü büyümesi YOK; çekirdek akrilik elyaf yapısal arz fazlası baskısında; payout %22,8-%164 arası oynak |
| **AKMGY** | B | Yok (10 yıl, en az 1 ödeme/yıl) | Görünürde net nakde yakın (kaynaklar tutarsız) | %97,67 doluluk; Klepierre S.A. (%44,85) deneyimli ortak | Beşiktaş Belediyesi'nin 75,8M TL + şarta bağlı 3,4 mr TL'ye kadar idari ceza + yıkım kararı; ilk derece davada reddedildi, istinafta, sonuç belirsiz |
| **PAGYO** | B | Yok (10 yıl kesintisiz) | Net nakit (H1 2026: -278,3M TL net borç yani net nakit); pratikte sıfır banka borcu | Borçsuzluk + 2025+ yasal asgari %50 dağıtım zorunluluğu | Tek varlık/tek şehir (Panora AVM, Ankara); ekspertizin kendi içinde doluluk çelişkisi (%91 vs %97-98); kârın büyük kısmı nakit-dışı değerleme kazancı |

## B kategorisi içinde göreli sıralama (gerekçeli, keyfi puanlama değil)

Görev talimatı keyfi ağırlıklı puanlamayı yasakladığı için burada bir "1-10 sıra" verilmiyor; bunun yerine B içindeki şirketler üç alt gruba ayrılıyor, gerekçesiyle:

### Göreli olarak daha güçlü B (çekirdeğe en yakın, ama hâlâ A eşiğini karşılamıyor)
- **TOASO** — en uzun (12+ yıl), hiç kesilmeyen ve her kriz döneminde artan temettü geçmişi; ama güncel kaldıraç/nakit akışı bozulması ve Stellantis Otomotiv entegrasyonunun test süresi kısa.
- **FROTO** — ~20 yıllık süreklilik ve resmî asgari dağıtım politikası; ama net borç artışı ve payout oranının teyit edilememesi.
- **PAGYO** ve **YGGYO** — yasal asgari dağıtım zorunluluğu (2025+) ve net nakit pozisyonu süreklilik güvencesini artırıyor; ama tek-varlık yoğunlaşması ve (YGGYO'da) kâr/temettü mekanizması netliği eksikliği bunları çekirdekten ayırıyor.

### Orta güçte B (temel sağlam ama belirgin, çözülmemiş bir risk/çelişki taşıyan)
- **TUPRS** — güçlü bilanço ama çok yıllı FCF karşılaması eksik ve kâr büyümesi döngüsel bir süper-döngüye bağımlı.
- **AKSA** — güçlü süreklilik ama kaldıraç bir yılda 3 katına çıktı ve reel/USD temettü büyümesi yok.
- **ISMEN** — güçlü süreklilik ve ROE ama payout oranı öngörülemez ve düzenleyici sermaye yeterliliği şeffaf değil.

### Zayıf B (ciddi, henüz sonuçlanmamış bir risk veya tekrarlayan kesinti taşıyan)
- **DOAS** — 2 kesinti + güncel dönemde kâr/nakit akışını aşan temettü ödemesi + kredi notu indirimi.
- **TTRAK** — art arda iki kötü yıl (FY2025 sıfır temettü, 9A2026 net zarar) ve bilançoda tek yılda sert kötüleşme.
- **AKMGY** — sonuçlanmamış, büyüklüğü özkaynağın ~%29'una kadar çıkabilen bir idari ceza/yıkım davası istinafta.

## Kategori kararı nasıl okunmalı

- **B kategorisi "kötü şirket" anlamına gelmez.** Görev talimatının kurallarına göre (yüksek verim tek başına A için yeterli değil; tek yıllık zarar/kesinti otomatik C değil; eksik veri otomatik olumsuz değil) hiçbir şirket bu çalışmada otomatik olarak C'ye düşürülmedi — her B kararı, çekirdek (A) standardının gerektirdiği **çok yıllı, bağımsız doğrulanmış FCF/CFO karşılama + kesintisiz süreklilik** ikilisinin tam karşılanamamasından kaynaklanıyor.
- Hiçbir şirket **C (uygun değil)** almadı; bu, 10 şirketin tamamının somut ve yeterli kanıtla "stratejinin temel kriterlerini karşılamadığı" gösterilemediği anlamına gelir — sektörel döngüsellik (TTRAK, DOAS, TOASO) veya tek seferlik hukuki risk (AKMGY) gibi sorunlar, görev talimatının "tek yıllık zarar/kesinti otomatik C değildir" kuralı çerçevesinde değerlendirildi.
- Hiçbir şirket **D (veri yetersiz)** almadı; her şirket için karar üretmeye yetecek çok yıllı temettü geçmişi ve en azından kısmi finansal doğrulama toplanabildi — ama hiçbiri **A (çekirdek)** eşiğini (tam çok yıllı FCF karşılama + sıfır çözülmemiş büyük risk) geçemedi.

## Metodolojik uyarılar (ayrıntı: METHODOLOGY.md)

- Her rapor **kendi ajanı tarafından incelendi, bağımsız bir ikinci ajan/oturum tarafından denetlenmedi** — CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralına göre bu açıkça not edilmiştir.
- TMS 29 bazları, kâr yılı/ödeme yılı ayrımı ve reel/USD büyüme hesapları şirketten şirkete farklı derecede tamamlanabildi (bkz. her raporun kendi "Veri eksikleri" bölümü ve DATA_GAPS.md).
- Investulator'ın mevcut uygulama-içi BLOCKED/NEEDS_REVIEW fiyat hedefi kararları bu çalışmada **değiştirilmedi**; bu çalışma ayrı bir, fiyat hedefinden bağımsız elim kararı üretir.
