# Kalan Veri Eksikleri — Bağımsız Denetim Sonrası Konsolide Liste

**Kesim tarihi:** 2026-11-10. Bu liste, ilk turun `docs/dividend-screening-20261110/DATA_GAPS.md`'sinin **güncellenmiş** hâlidir — kapatılan maddeler "KAPATILDI" olarak işaretlenir, hâlâ açık olanlar korunur, bu turda yeni bulunanlar eklenir. Hiçbir eksik veri uydurulmadı.

## Kapatılan maddeler (bu turda çözüldü)

| Madde | Önceki durum | Bu turda |
|---|---|---|
| AKMGY 2021-2025 CFO/CAPEX | Hiçbiri doğrulanamadı | **Tam 6 dönemlik birincil seri üretildi** (CASHFLOW.md) |
| AKMGY payout-to-CFO oranı | Hiç hesaplanamadı | **Hesaplandı** (FY2025: %118,7) |
| TOASO 2021-2022 CFO/CAPEX | Eksik | **Birincil kaynaktan (Tofaş 2022 FR) bulundu** |
| TOASO FY2024-2025 CFO/CAPEX | "Bulunamadı" (yanlış — zaten indirilmişti) | **Zaten indirilmiş dosyada bulundu, okundu** |
| TTRAK 2021-2024 CFO/CAPEX | İkincil, şişirilmiş | **Birincil kaynaktan düzeltildi** |
| TTRAK 08.11.2024 ödemesinin kâr yılı | Çıkarım, teyit değil | **KAP bildirim başlığıyla kesin teyitli** |
| AKSA net borç/FAVÖK "çelişkisi" (~2,8x vs ~3,70x) | Mutabık kılınamadı | **Zamanlama farkı olarak çözüldü** (9A2026: 2,84x) |
| FROTO 24.03.2021 temettü tutarı | "~13 TL, teyit edilemedi" | **6,42 TL/pay olarak düzeltildi** (IR sayfası) |
| ISMEN komisyon gelirinin ayrıştırılması | Hiç ayrıştırılamadı | **Kısmen ayrıştırıldı** (Aracılık/Portföy Yönetimi/Kurumsal Finansman kırılımı bulundu) |
| ISMEN 2025 %154 payout anomalisi | Tamamen açıklanamaz | **Kısmen açıklandı** (%5,1'i geçmiş yıl kârından) |

## Hâlâ açık olan maddeler (değişmedi)

| Şirket | Madde | Nasıl kapatılabilir |
|---|---|---|
| TUPRS | CAPEX 2021-2024 tam seri | KAP XBRL/iXBRL arşivi (ham PDF metin değil); bu ortamda poppler/pdftoppm yok, görsel doğrulama yapılamadı |
| TUPRS | Resmi temettü PDF arşivinin satır bazında teyidi | Excel-kaynaklı bozuk PDF; her yılın KAP GK kâr dağıtım tutanağının tek tek açılması gerekiyor |
| FROTO | 2021-2025 CFO/CAPEX'in birincil kaynaktan doğrulanması | Ford Otosan'ın finansal sonuç duyuru PDF'leri şifreli/sıkıştırılmış akış; farklı bir PDF aracı/OCR gerekiyor |
| FROTO | 2024 CFO/CAPEX çelişkisi (33,6 vs 43,99 mr; 25,9 vs 48,1 mr TL) | Birincil kaynak erişilemediği için çözülemedi |
| FROTO | Payout oranı / KAP kâr dağıtım tablosu | Bu turda da açılmadı |
| TOASO | FY2023 CFO/CAPEX/nakit akış tablosu | tofas.com.tr IR arşivinden elle indirilip aynı yöntemle okunmalı |
| TOASO | Koç Stellantis Finansman A.Ş. borcunun imalat borcundan ayrıştırılmış payı | Hâlâ bulunamadı |
| DOAS | FY2024 CFO (birincil kaynaktan) | `doas-fr2024-eng.pdf` gerçek bir PDF değil (Cloudflare koruması) — farklı erişim yöntemi gerekiyor |
| DOAS | 2022 dividend tutarı çelişkisi (2.150 mr iddia vs 1.935 mr birincil nakit akış tablosu) | Bu turda yeni bulunan çelişki, çözülemedi |
| DOAS | FY2025 tam yıl CAPEX | Hâlâ eksik |
| TTRAK | FY2025 tam yıl CFO/CAPEX'in birincil kaynaktan teyidi | `TurkTraktorFR25.pdf` OCR/binary engeline çarptı |
| TTRAK | FY2023 FAVÖK çelişkisi (13,193 vs 18,89 mr TL) | Çözülemedi, zayıf dolaylı sinyal 13,193'ü hafif destekliyor |
| TTRAK | CNH'nin elektrikleşme planının TTRAK/Türkiye'ye yansıması | CNH tarafı belgeli, TTRAK tarafı hâlâ belgesiz |
| ISMEN | Gerçek düzenleyici sermaye yeterliliği oranı | Muhtemelen hiçbir zaman kamuya açıklanmıyor (SPK'ya özel) |
| ISMEN | 8,5 mr ile 5,825 mr arasındaki ~2,67 mr TL'lik fark | Tam KAP GK kâr dağıtım tutanağı gerekiyor |
| AKMGY | NAD CONFLICT | Değişmedi |
| AKMGY | Gelir tablosu kira geliri/FAVÖK/değerleme kazancı ayrıştırması | Bu turda da yapılamadı |
| AKSA | 2016-2019 net kâr/CFO/CAPEX | Tamamen kapalı (FY2020 CFO'ya dair düşük-güvenli tek nokta dışında) |
| AKSA | FY2021-2022 CAPEX | OCR bozukluğu nedeniyle güvenilir çıkarılamadı |
| AKSA | 9A2026 segment bazlı FAVÖK/marj kırılımı | Bu turda bulunamadı |
| YGGYO | FY2017 temettü tutarı | OCR gerektiren PDF, hâlâ teyitsiz |
| YGGYO | 09.07.2024 olağanüstü ödemenin niteliği | Birincil KAP metni bu turda da açılamadı |
| YGGYO | NAD/net aktif değer çelişkisi | Değişmedi |
| PAGYO | 9A2026 net kâr çelişkisi (675,7M vs 681,9M TL) | Web taraması bu turda yapılmadı |
| PAGYO | Ortaklık yapısı yüzdeleri | Bu turda yeniden doğrulanmadı |
| Tümü (AKSA hariç) | Reel (TÜFE) ve USD bazlı temettü büyüme serisi | Sistematik olarak üretilmedi (zaman kısıtı) |

## Bu turda yeni bulunan eksikler/çelişkiler

| Şirket | Yeni madde | Durum |
|---|---|---|
| TUPRS | CAPEX için düşük-orta güvenli bir aday (2025 ≈19,12 mr TL) bulundu ama satır kayması nedeniyle kesinleştirilemedi | Açık |
| AKMGY | Pay sayısı (3.726.400.000) muhtemelen ~100x hatalı | MKK kayıt sorgusu gerekiyor |
| AKMGY | İkinci dava çifti (2026/334, 2026/335) + üçüncü/dördüncü dava ilişkisi netleştirilmedi | Açık |
| AKMGY | "14,21 TL brüt" (2026) rakamının kökeni, birincil KAP (12,36 TL) ile uyuşmuyor | Açık |
| YGGYO | FY2024 net zarar üç kaynakta üç farklı rakam (−364M / −249,45M / −523M) | Açık, önceki turdan daha büyük bir belirsizlik |
| YGGYO | PROEN'in gerçek sermaye büyüklüğü (750M TL iddiası muhtemelen YGGYO'nun kendi tavan sermayesiyle karışmış) | KAP'tan PROEN'e özel bildirim aranmalı |
| PAGYO | Doluluk oranı artık üç belgeli bir tutarsızlık (ekspertiz %91, FY2025 Not 6 %97-98, FY2024'ün kendi Not 6'sı %95-96) | Doğrudan PDF sayfası görsel incelemesi önerilir |
| PAGYO | Pay sayısı/toplam temettü nakdi küçük sapması (87,0M vs ~89,4M çıkarım, ~%2,7) | Açık |
| TOASO | Stellantis Otomotiv Pazarlama devralmasına bağlı 5,88 mr TL'lik, 8 yıla yayılı, %77,5 paylaşım oranlı şarta bağlı bedel yükümlülüğü | Önceki raporda yoktu; nicel nakit akış etkisi modellenmedi |
| DOAS | FY2024 net kâr/FAVÖK'ün yüksek rakamlarının (9,94 mr / 24,15 mr) kökeni | Hangi rapor/hangi TMS29 tarihi olduğu belirlenemedi |

## Bu denetimin kendi teknik sınırlılığı

Bu ortamda `poppler`/`pdftoppm` (veya eşdeğer bir PDF-görüntü render aracı) kurulu değildi; bu nedenle PDF metin çıkarımında satır/sütun kayması şüphesi olan kalemler (TUPRS CAPEX, PAGYO Not 6 tablosu) **görsel olarak doğrulanamadı**. Bir sonraki turda bu araç veya OCR ile tekrar denenmesi önerilir. Ayrıca YGGYO ve PAGYO denetimleri zaman kısıtı nedeniyle **web taraması yapmadan** tamamlandı — bu iki şirketin yeni bulunan açık maddeleri bir web doğrulama turu gerektiriyor.
