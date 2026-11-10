# Çok Yıllı Nakit Akışı ve Temettü Karşılama — Şirket Bazında (Bağımsız Denetim)

**Kesim tarihi:** 2026-11-10. Tüm rakamlar TL, bin TL olarak belirtilmemişse aksi not edilir. **TMS 29 bazı her satırda belirtilir; farklı satın alma gücü bazındaki yıllar doğrudan bölünerek büyüme hesaplanmamıştır** (METHODOLOGY.md kuralı korunmuştur). Kaynak: ilgili şirketin `audit-<SEMBOL>.md` dosyası (scratchpad); orijinal kaynak dosya yolları oradan takip edilebilir.

---

## TUPRS

| Yıl | CFO (bin TL) | Basis | CAPEX | FCF | Temettü | Karşılama |
|---|---:|---|---|---|---|---|
| 2021 | −1.429.088 | Nominal | — | — | 0 (kesinti) | — |
| 2022 | 43.913.911 | Nominal | ~240-170M (şüpheli, muhtemelen yanlış) | — | — | — |
| 2023 | 85.276.324 | 31.12.2023 PP | güvenilir çıkarılamadı | — | — | — |
| 2024 | 35.271.031 | 31.12.2024 PP | güvenilir çıkarılamadı | — | — | — |
| 2025 | 49.464.734 | 31.12.2025 PP | ~19,12 mr (düşük-orta güven, doğrulanmamış) | ~0,87x FCF (önceki rapordan, değişmedi) | — | 1,42x CFO / 0,87x FCF |
| H1 2026 | — | — | 11.858.044 (KAP XBRL, yüksek güven) | — | — | — |

**Durum:** CFO serisi 2021-2025 **tam ve birincil kaynaktan doğrulandı** (yüksek güven). CAPEX 2021-2024 hâlâ güvenilir çıkarılamadı — belge indirilmiş ama PDF metin çıkarımında satır kayması var (poppler/pdftoppm bu ortamda yok, görsel doğrulama yapılamadı). **Normalize gözlem:** 2022 süper-döngüsü hariç CFO ortalaması ~28 mr TL/yıl — temettü kapasitesi döngüsel, 2022-2023 zirvesine göre çok daha mütevazı.

## FROTO

| Yıl | CFO (milyon TL, 3. taraf, DOĞRULANMAMIŞ) | CAPEX (milyon TL, 3. taraf) | FCF |
|---|---:|---:|---:|
| 2021 | 8.702,45 | 1.613,86 | 7.088,59 |
| 2022 | 34.249,07 | 11.437,88 | 22.811,19 |
| 2023 | 72.268,43 | 38.611,94 | 33.656,49 |
| 2024 | 43.990,40 (haber kaynağı: 33,6 mr — %24 çelişki) | 48.107,68 (şirket guidance 739M EUR≈25,9 mr TL ile %85 çelişki) | **−4.117,28** |
| 2025 | 105.099,90 | 25.366,72 | 79.733,18 |

**Durum:** Hiçbir yıl birincil kaynaktan doğrulanamadı — Ford Otosan'ın kendi finansal sonuç duyuru PDF'leri şifreli/sıkıştırılmış akış içeriyor, bu ortamda okunamadı (FROTO için `bist-audit-20261101`'de hiç finansal PDF indirilmemişti). Yukarıdaki seri **yalnızca üçüncü taraf (investing.com)**, kendi içinde 2024'te iki yerde (~%24 ve ~%85) çelişkili. **FCF/temettü karşılama hesaplanamaz durumda kalıyor** — kaynak var ama proje standardına göre kullanılamaz güvenilirlikte.

## TOASO

| Dönem | Basis | CFO (bin TL) | CAPEX (brüt) | FCF | Nakit temettü | Karşılama |
|---|---|---:|---:|---:|---:|---:|
| 2021 | Nominal | 2.679.899 | 1.122.191 | 1.557.708 | 1.500.000 | **1,04x** |
| 2022 | Nominal | 3.789.856 | 962.470 | 2.827.386 | 3.200.000 | **0,88x** |
| 2023 | — | MISSING_DATA | MISSING_DATA | — | 3.000.000 | hesaplanamadı |
| 2024 | TMS29@Dec2025 | **(9.629.971)** NEGATİF | 8.973.350 | **(18.603.321)** NEGATİF | 16.424.021 | **Negatif** |
| 2025 | TMS29@Dec2025 | 2.655.374 | 8.723.589 | **(6.068.215)** NEGATİF | 7.135.514 | **Negatif** |
| H1 2025 | TMS29@Jun2026 | 17.094.892 | 5.054.496 | 12.040.396 | 8.402.669 | 1,43x |
| H1 2026 | TMS29@Jun2026 | **(7.202.222)** NEGATİF | 4.427.515 | **(11.629.737)** NEGATİF | 10.700.960 | Negatif |

**Durum:** 2021-2022 ve 2024-2025 artık birincil kaynaktan doğrulanmış (FY2023 hâlâ eksik). **Kritik bulgu: kaldıraç/nakit akışı bozulması FY2024'te başlamış** (−18,6 mr TL FCF), "son 2-3 çeyrekte başladı" anlatımı yanıltıcı. 2021-2022'de FCF pozitif ve temettüyü ~1x karşılıyordu; 2024-2025'te temettü tamamen borç/nakit rezervinden finanse edilmiş. Ayrıca Stellantis Otomotiv Pazarlama devralmasına bağlı **5,88 mr TL'lik, 8 yıla yayılı şarta bağlı bedel yükümlülüğü** (RISK_REVIEW.md'de ayrıntılı) yeni bulundu.

## DOAS

| Dönem | Basis | CFO (final, bin TL) | CAPEX (brüt) | FCF | Nakit temettü | Karşılama |
|---|---|---:|---:|---:|---:|---:|
| 2021 | Nominal | 3.268.796 | 403.754 | 2.865.042 | 600.000 | **4,78x** |
| 2022 | Nominal | 3.789.856 | 1.219.317 | 2.570.539 | 1.935.000 | **1,33x** |
| 2022 | TMS29@Dec2023 | 1.995.524 | 2.422.343 | **(426.819)** NEGATİF | 3.988.445 | **Negatif** |
| 2023 | TMS29@Dec2023 | 2.610.116 | 1.888.678 | 721.438 | 6.641.454 | **%10,9** |
| 2024 | — | MISSING_DATA (birincil erişilemedi) | ~1,1-1,3 mr (tahmini) | — | 11.200.000 (iddia) | hesaplanamadı |
| 2025 | — | (12.810.000) NEGATİF (ikincil) | H1: 1,1755 mr | — | 6.000.000 | Negatif |

**Durum:** Önceki rapor **ara toplam ile final CFO toplamını karıştırmıştı** — gerçek final CFO rakamları çok daha düşük. 2021 gerçekten güçlü (4,78x); ama 2022 (TMS29-tutarlı bazda) FCF **negatif**, 2023 temettünün yalnızca **%11'ini** karşılıyor. "2021-2023 disiplinli dönem" anlatımı **düzeltilmeli**: bozulma muhtemelen 2022'den itibaren başlamış, 2024-2025 bunun şiddetlenmiş hali, tek başına yeni bir olgu değil.

## TTRAK

| Kâr yılı | Net kâr | CFO (birincil) | CAPEX (birincil) | FCF | Ertesi yıl ödenen temettü | Temettü/FCF |
|---|---:|---:|---:|---:|---:|---:|
| 2021 | 1.322,2M | 886,0M | 322,9M | 563,2M | 1.200M | **%213,1** |
| 2022 | 2.971,0M | 2.884,2M | 680,8M | 2.203,4M | 2.100M | %95,3 |
| 2023 | 9.342,0M | 9.885,6M | 1.736,0M | 8.149,6M | 9.000M | %110,4 |
| 2024 | 5.740,5M | 5.370,9M | 3.827,9M | **1.543,0M** | 4.850M | **%314,3** |
| 2025 | 455,0M | ~6.900M (ikincil, doğrulanmamış) | ~3.800M (ikincil) | ~3.100M (ikincil) | 0 | N/A |

**Durum:** İkincil kaynak (TradingView/Investing.com) CFO'yu 2022'de ~2,4x, 2023'te ~1,44x şişirmişti. Düzeltilmiş veriyle **4 yılın 3'ünde (2021, 2023, 2024) temettü o yılın FCF'sini aştı**. FY2025 sıfır temettüsü yalnızca dışsal bir pazar şokuna değil, 2021-2024'teki agresif dağıtım politikasının biriken net nakit tamponunu zaten eritmiş olmasına da bağlı.

## AKSA

| Yıl | Net kâr | CFO | CAPEX | FAVÖK | Not |
|---|---:|---:|---:|---:|---|
| 2020 | bulunamadı | 862.084 bin TL (düşük güven, OCR bozuk) | bulunamadı | bulunamadı | FY2021 karşılaştırmalı sütunundan |
| 2021 | 1.167.208 bin TL | 2.910.752 bin TL | bulunamadı | bulunamadı | Birincil, AKSA.md ile tam örtüşüyor |
| 2022 | 3.422.038 bin TL | 1.346.171 bin TL | bulunamadı (OCR) | bulunamadı | Birincil, tam örtüşüyor |
| 2023 | 1.651.981 bin TL (TMS29@2023) | 1.481.877 bin TL | bulunamadı | bulunamadı | Değişmedi |
| 2024 | 1.136.625 bin TL (TMS29@2024) | OCR nedeniyle net okunamadı | 4.425.055 bin TL | 5.868.613 bin TL | Değişmedi |
| 2025 | 3.921.703 bin TL (TMS29@2025) | 5.064.708 bin TL | 3.114.154 bin TL | 5.729.630 bin TL | `annual-cash-replay.json` ile tam teyitli |
| 9A2026 | ana ortaklık −%24,5 YoY (2.531,9M) | bulunamadı | bulunamadı | **+%43,6 YoY (6.049,4M)** | Net borç/FAVÖK 2,84x (iyileşme) |

**Durum:** Net borç/FAVÖK "çelişkisi" (~2,8x şirket ifadesi vs ~3,70x bağımsız hesap) **zamanlama farkı olarak çözüldü** (9A2026: 2,84x). 2016-2019 hâlâ tamamen kapalı. **Yeni gerilim:** kaldıraç iyileşirken (FAVÖK +%43,6) ana ortaklık net kârı −%24,5 düşmüş — finansman maliyeti/kur etkisi kârlılığı eritiyor.

## ISMEN (sektöre özgü model — CFO/FCF uygulanmaz)

Klasik CFO/CAPEX modeli aracı kurum iş modeline uygun değil (METHODOLOGY.md kararı korunmuştur). Bu turda:
- TTM ana ortaklık kârı (30.06.2026, TAS29): **7.346.545 bin TL** — bağımsız doğrulandı (şirketin kendi sunumuyla birebir).
- ROE: **%21,38 (TTM)** — bağımsız doğrulandı.
- H1 2026 nominal net kâr **+%1** iken TAS29-düzeltmeli gerçek kâr **−%35** — nominal≠gerçek büyüme uyarısına somut, güncel kanıt.
- Komisyon geliri kısmen ayrıştırıldı: Aracılık 3.245.846 bin TL (%57) + Portföy Yönetimi 2.306.653 bin TL (%41) + Kurumsal Finansman 95.966 bin TL (%2) = 5.648.465 bin TL — "Faiz/Alım-Satım/Finansal Yatırım" (11.658.915 bin TL) kaleminden ayrı. Gerçek düzenleyici sermaye yeterliliği oranı hâlâ bulunamadı.

## AKMGY

| Dönem | Basis | CFO (TL) | CAPEX | FCF | Ödenen nakit temettü | Payout/CFO |
|---|---|---:|---:|---:|---:|---:|
| FY2020 | Nominal | 62.435.127 | 1.473.692 | 60.961.435 | 48.443.200 | %77,6 |
| FY2021 | Nominal | 81.495.864 | 2.832.230 | 78.663.634 | 99.494.880 | **%122,1** |
| FY2022 | Nominal | 158.090.978 | 4.564.458 | 153.526.520 | 109.183.520 | %69,1 |
| FY2023 | @Dec2023 PP | 260.195.206 | 24.584.406 | 235.610.800 | 227.003.595 | %87,2 |
| FY2024 | @Dec2024 PP | 473.011.521 | 38.861.463 | 434.150.058 | 363.308.690 | %76,8 |
| FY2025 | @Dec2025 PP | 552.923.054 | 37.950.169 | 514.972.885 | **656.505.044** | **%118,7** |

**Durum:** "CFO/CAPEX hiçbiri doğrulanamadı" iddiası **çürütüldü** — tam 6 dönemlik birincil seri üretildi. FY2021 ve FY2025'te ödenen nakit temettü CFO'yu aşıyor (dönem başı/sonu nakit stokundan karşılanmış, net nakit pozisyonu 2025'te küçük bir miktar azaldı). Şirketin hâlâ yüksek nakit stoku var (dönem sonu 633,8M TL) ama "payout-to-CFO hiç hesaplanamadı" ifadesi artık geçersiz ve sonuç tek yönlü olumlu değil.

## YGGYO / PAGYO (GYO modeli — IFRS net kârdan ayrı nakit/dağıtılabilir kâr analizi)

**YGGYO:** H1 2026 CFO 1.741.774.649 TL — bunun **%47,8'i (832.423.344 TL) banka mevduat faiz geliri**, çekirdek kira işinden değil (birincil tablodan doğrulandı). FY2025 Dönem Karı 5.362.720.197 TL, EPS 22,80 TL; ödenen 10,55 TL/pay temettü bu EPS'nin %46,3'ü — "dağıtılabilir kâr" tabanının (muhtemelen solo/yasal) IFRS net kârdan küçük olduğu tezini destekliyor ama FY2025'e özel taban hâlâ doğrulanamadı. FY2024 net zarar üç kaynakta üç farklı rakam (−364M / −249,45M / −523M) — çözülemedi.

**PAGYO:** FY2021-2025 Hasılat/net kâr/CFO/CAPEX/FCF tablosu spot-check edildi, çelişen rakam bulunmadı (önceki raporun seri kabul edilebilir). Yatırım amaçlı gayrimenkul (16,27 mr TL) birincil kaynakla birebir örtüşüyor. Pay sayısı (87,0M beyan vs ~89,4M çıkarım, ~%2,7 fark) küçük, çözülmemiş bir tutarsızlık.

---

## Özet — DATA_GAPS.md'nin "çok yıllı CFO/CAPEX/FCF eksikliği" maddesinin güncel durumu

| Şirket | Önceki durum | Bu turdaki durum |
|---|---|---|
| TUPRS | 2021-2024 CAPEX/FCF eksik | CFO tam (5/5 yıl); CAPEX hâlâ eksik (teknik, erişim değil) |
| FROTO | 2021-2025 CFO tümü eksik | Değişmedi — gerçekten hiç birincil kaynak yok, yalnızca güvenilmez 3. taraf seri |
| TOASO | 2021-2023 CFO/CAPEX eksik | Yalnızca FY2023 eksik; 2021-2022-2024-2025 artık birincil kaynaklı |
| TTRAK | FY2025 tam yıl eksik | 2021-2024 birincil kaynaklı (düzeltildi); FY2025 hâlâ ikincil |
| AKMGY | 2021-2025 tümü eksik | **Tamamı kapatıldı** — 6 dönemlik birincil seri var |
| DOAS | (listede yoktu, ama veri yanlış kullanılmıştı) | 2021-2023 birincil kaynaklı ama **düzeltilmiş**; 2024 hâlâ eksik |
| AKSA | (listede yoktu) | 2021-2023 kısmen var (CAPEX OCR sorunu); 2016-2019 hâlâ kapalı |
