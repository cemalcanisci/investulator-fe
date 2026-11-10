# Çözülmemiş Kritik Sorunlar — Önceliklendirilmiş Liste

**Kesim tarihi:** 2026-11-10. Bu liste, iki araştırma turunun (`dividend-screening-20261110/DATA_GAPS.md` ve `dividend-screening-independent-audit-20261110/DATA_GAPS.md`) hâlâ açık bıraktığı maddelerin, portföy kararı açısından önceliklendirilmiş bir konsolidasyonudur. Hiçbir eksik veri bu listede doldurulmamıştır. Öncelik: **Kritik** (kararın kendisini bloke eder/büyük ölçüde değiştirebilir) → **Yüksek** → **Orta** → **Düşük**.

## Kritik öncelik

| # | Etkilenen şirket | Eksik veri / çelişki | Karara etkisi | Çözüm için gereken kaynak |
|---|---|---|---|---|
| 1 | **AKMGY** | İstinaf süreci sonucu (3,4 mr TL'ye kadar şarta bağlı ceza + yıkım kararı, ilk derece reddedilmiş, istinafta; özkaynağın ~%29'una kadar) | Tek bir pozisyonun büyüklük kararını doğrudan belirler — olumsuz kesinleşirse B→C baskısı, olumlu kesinleşirse B→A yönünde güçlü sinyal | İstanbul 3. İdare Mahkemesi istinaf kararı takibi; sonuç netleşene kadar bu pozisyon küçük/tamamlayıcı tutulmalı |
| 2 | **YGGYO** | FY2024 net zarar üç kaynakta üç farklı rakam (−364M / −249,45M / −523M) — ikisi şirketin KENDİ FY2025 faaliyet raporunun kendi içinde çelişkili | Dağıtılabilir kâr mekanizmasının (IFRS zararına rağmen nakit temettü) gerçek dayanağı doğrulanamıyor; veri kalitesi riski kategori gerekçesinin parçası | Şirketin GK kâr dağıtım tutanağının birincil KAP metninden (05.11.2026 KAP Bildirimi #1693463'ün orijinali) açılıp okunması |
| 3 | **DOAS** | FY2024 net kâr/FAVÖK çelişkisi (9,94 vs 7,5 mr TL; 16,7 vs 24,15 mr TL) — birincil kaynağa (`doas-fr2024-eng.pdf`) erişim bir Cloudflare bot-koruma sayfası olduğu için başarısız | "2021-2023 disiplinli dönem" tezinin çökmesiyle birlikte, FY2024'ün gerçek büyüklüğü hâlâ bilinmiyor; mevcut B/"en zayıf B" kararı bu çelişki çözülmeden sağlamlaştırılamıyor | Farklı bir erişim yöntemiyle (VPN/farklı ağ veya KAP'ın doğrudan arşivi) birincil finansal tablo PDF'ine ulaşma |
| 4 | **FROTO** | 2021-2025 CFO/CAPEX/FCF serisinin **tamamı** iki turda da birincil kaynaktan yok (şifreli/sıkıştırılmış PDF akışı) | Stratejinin ikinci koşulunun (çok yıllı FCF karşılaması) hiç test edilememesi — FROTO'yu "Koşullu" ile "Karar Ertelendi" sınırında tutan ana neden | Farklı bir PDF aracı veya OCR ile Ford Otosan'ın KAP'a yüklediği finansal tabloların yeniden denenmesi |

## Yüksek öncelik

| # | Etkilenen şirket | Eksik veri / çelişki | Karara etkisi | Çözüm için gereken kaynak |
|---|---|---|---|---|
| 5 | **TOASO** | FY2023 CFO/CAPEX/nakit akış tablosu eksik; Stellantis Otomotiv Pazarlama devralımına bağlı 5,88 mr TL'lik, 8 yıla yayılı şarta bağlı bedel yükümlülüğünün gerçek ödeme takvimi modellenmedi | FY2023 verisi olmadan 2021-2025 FCF serisi tam kurulamıyor; şarta bağlı yükümlülük 2033'e kadar potansiyel nakit çıkışı, nicel etkisi bilinmiyor | tofas.com.tr IR arşivinden FY2023 faaliyet raporunun elle indirilmesi; devralma sözleşmesinin ödeme tetikleyici maddelerinin okunması |
| 6 | **TTRAK** | FY2025 tam yıl CFO/CAPEX'in birincil kaynaktan teyidi (`TurkTraktorFR25.pdf` OCR/binary engeline çarptı); CNH'nin elektrikleşme planının TTRAK/Türkiye'ye yansımasına dair hiçbir kamuya açık bilgi yok | FY2025 krizinin tam büyüklüğü teyitsiz; 10-15 yıllık en kritik yapısal risk (elektrikleşme) tamamen karanlık | Farklı bir PDF/OCR aracı; TTRAK'ın yatırımcı ilişkileri/KAP'tan elektrikleşme stratejisine dair özel durum açıklaması araştırması |
| 7 | **ISMEN** | Gerçek düzenleyici sermaye yeterliliği oranı (SPK Seri V No:34) hiçbir kaynaktan bulunamadı; 8,5 mr ile 5,825 mr arasındaki ~2,67 mr TL'lik fark tam çözülemedi | Muhtemelen **kalıcı** bir şeffaflık riski (geçici veri eksikliği değil) — B kategorisinde kalmanın yapısal nedeni | SPK'nın kamuya açık bir disclosure zorunluluğu getirmesi veya şirketin gönüllü açıklaması (dış gelişmeye bağlı, araştırmayla kapatılamayabilir) |
| 8 | **Bu denetimin kendisi** | İkinci tur (bağımsız denetim) kendi ajanları tarafından yazıldı, üçüncü bağımsız bir turdan geçmedi; bu sentez de dördüncü bağımsız bir doğrulama değil, üçüncü bir okuma | CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralı — mevcut B kararları sağlam ama nihai/kesin değil | Farklı bir oturum/ajanla, mümkünse doğrudan KAP XBRL/birincil belge erişimiyle üçüncü bağımsız bir tur |

## Orta öncelik

| # | Etkilenen şirket | Eksik veri / çelişki | Karara etkisi | Çözüm için gereken kaynak |
|---|---|---|---|---|
| 9 | **PAGYO** | Doluluk oranı üç belgede üç farklı rakam (ekspertiz DCF %91, FY2025 Not 6 %97-98, FY2024'ün kendi Not 6'sı %95-96) | Portföy değeri/NAD güvenilirliğine ihtiyat notu; tek başına C gerektirmiyor | Ekspertiz PDF'inin ilgili sayfalarının doğrudan görsel incelemesi |
| 10 | **AKMGY** | Pay sayısı (3.726.400.000) muhtemelen ~100 kat hatalı; ikinci dava çifti (2026/334, 2026/335) + üçüncü/dördüncü dava ilişkisi netleşmedi | Pay başına metrik hesapları (temettü/pay) güvenilirliği zayıflıyor; hukuki riskin tam kapsamı belirsiz | MKK kayıt sorgusu; şirketin üç ayrı dava açıklaması PDF'inin (görüntü/kodlu içerik) OCR ile okunması |
| 11 | **TUPRS** | 2021-2024 CAPEX tam serisi (bu ortamda poppler/pdftoppm yokluğu nedeniyle PDF satır kayması görsel doğrulanamadı) | 5 yıllık ortalama FCF karşılama oranı hesaplanamıyor, yalnızca 2025 var | KAP XBRL/iXBRL arşivi (ham PDF metin değil) veya farklı bir PDF render aracı |
| 12 | **YGGYO / PAGYO** | İkinci tur bu iki şirkette zaman kısıtı nedeniyle **web taraması yapmadı**, yalnızca yerel dosyaları madenledi | Yeni bulunan açık maddeler (PAGYO 9A2026 net kâr çelişkisi, YGGYO PROEN sermaye büyüklüğü) hâlâ web doğrulaması bekliyor | Ayrı bir web tarama turu, özellikle bu iki şirkete odaklı |
| 13 | **Tümü (AKSA hariç)** | Reel (TÜFE) ve USD bazlı temettü büyüme serisi sistematik olarak üretilmedi | Nominal büyüme rakamlarının yanıltıcı okunma riski (AKSA'nın kendi bulgusu bunun önemini kanıtlıyor: nominal +%1.333 reel/USD'de büyüme göstermiyor) | TÜİK TÜFE serisi + TCMB günlük USD/TRY kuru ile sistematik bir ek hesaplama turu |
| 14 | **DOAS** | 2022 dividend tutarı çelişkisi (2.150 mr iddia vs 1.935 mr birincil nakit akış tablosu); FY2025 tam yıl CAPEX | Payout/FCF oranının kesinliğini düşürüyor | Birincil KAP genel kurul kâr dağıtım tutanağının tek tek açılması |
| 15 | **AKSA** | 2016-2019 net kâr/CFO/CAPEX tamamen kapalı; 9A2026 segment bazlı FAVÖK/marj kırılımı bulunamadı | İleri Malzemeler segmentinin kalıcı marj profili (tek yarı yıllık veri) hâlâ belirsiz | KAP'ın eski dönem finansal rapor arşivi; sonraki çeyrek finansal tabloları |

## Düşük öncelik

| # | Etkilenen şirket | Eksik veri / çelişki | Karara etkisi | Çözüm için gereken kaynak |
|---|---|---|---|---|
| 16 | **TUPRS** | Dividend stopaj oranının yıllar arası değişken görünmesi (%10→%15, 2025); pay sayısı/sermaye yapısının kesin teyidi | Net getiri öngörülebilirliğini hafifçe etkiliyor, kategori kararını değiştirmiyor | Tüpraş sermaye yapısı sayfasının içeriğinin indirilip okunması |
| 17 | **TTRAK** | FY2022-2024 FAVÖK çelişkisi (FY2023 için 13,193 vs 18,89 mr TL); ilişkili taraf (Not 23: CNH royalti) tutarları | Normalize FAVÖK/net borç-FAVÖK oranının kesinliğini düşürüyor | Dipnotun (Not 23) içeriğinin tek tek okunması |
| 18 | **AKMGY** | Net borç/net nakit serisinde (2024-2026) birim/ölçek tutarsızlığı (bir kaynakta "milyar" muhtemelen hata); kira artış/endeksleme mekanizması bulunamadı | Finansal dayanıklılık yönü hafif olumlu ama düşük güvenle sunuldu | Birincil bilanço dipnotlarının tek tek okunması |
| 19 | **PAGYO** | Pay sayısı/toplam temettü nakdi küçük sapması (87,0M beyan vs ~89,4M çıkarım, ~%2,7 fark); ortaklık yapısı yüzdeleri teyitsiz | Küçük ölçekli, kategori kararını değiştirmiyor | KAP'ın resmi "Ortaklık Yapısı" sayfasının yeniden denenmesi |
| 20 | **ISMEN** | Segment bazlı gelir payları (yatırım ortaklığı/portföy yönetimi/girişim sermayesi/varlık yönetimi) tam ayrıştırılamadı; pazar payı verisi tek kaynaklı (şirketin kendi sunumu) | Gelir çeşitliliğinin tam resmi eksik ama ana sonuç değişmiyor | TSPB/BIST bağımsız sıralama verisiyle çapraz doğrulama |

## Not — kapatılan maddeler

İkinci turun kapattığı önemli maddeler (AKMGY'nin tam CFO/CAPEX serisi, TOASO/TTRAK'ın birincil kaynaklı düzeltilmiş CFO verisi, AKSA'nın stopaj oranı düzeltmesi, FROTO'nun 24.03.2021 temettü tutarı düzeltmesi, ISMEN'in komisyon kısmi ayrıştırması) bu listede **tekrarlanmamıştır** — tam liste `dividend-screening-independent-audit-20261110/DATA_GAPS.md`'nin "Kapatılan maddeler" bölümündedir. Bu kapanmaların çoğu, ilginç biçimde, şirket kalitesi yargısını **olumsuz yönde** etkilemiştir (veri netleşmesi = şirket iyi demek değildir, bkz. `METHODOLOGY.md` madde 3B).
