# Bağımsız Denetim — 10 BIST Şirketi Temettü Eleme Araştırması (2. Tur)

**Denetim kesim tarihi:** 2026-11-10, Europe/Istanbul.
**Denetlenen:** `docs/dividend-screening-20261110/` (COMPARISON.md, METHODOLOGY.md, DATA_GAPS.md, dividend-screening.json, companies/*.md+*.json), ilk turda TUPRS, DOAS, FROTO, TOASO, TTRAK, ISMEN, YGGYO, AKSA, AKMGY, PAGYO için hazırlanmıştı ve 10 şirketin tamamını **B — Koşullu Aday** olarak sınıflandırmıştı.
**Bu turun yöntemi:** Her şirket için, ilk turu yazan ajandan **tamamen ayrı bir oturumda** (CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralına uygun) çalışan 5 paralel ajan (ikişer şirket), önce Investulator'ın daha önceki oturumlarında zaten indirilmiş birincil kaynak PDF/metin dosyalarını (`outputs/bist-audit-20261101/`, `outputs/research-<şirket>-2026*/`, `outputs/tuprs-verification-20261022/`) madenledi, sonra KAP/MKK/şirket IR/bağımsız haber kaynaklarını web üzerinden tekrar taradı. `docs/dividend-screening-20261110/` içindeki hiçbir dosya değiştirilmedi; mevcut uygulama-içi BLOCKED/NEEDS_REVIEW fiyat hedefi kararlarına dokunulmadı; fiyat hedefi/alım-satım önerisi üretilmedi.

**Genel sonuç (önden özet):** 10 şirketin **hiçbirinin stratejik uygunluk kategorisi değişmedi** — tamamı **B (Koşullu Aday)** olarak kaldı; hiçbiri **A (Çekirdek Aday)**'a yükselmedi, hiçbiri **C (Uygun Değil)**'e düşmedi. Ama bu "değişmedi" sonucunun arkasında önemli bir asimetri var: **5 şirkette kanıt güvenilirliği yukarı revize edildi** (TOASO, TTRAK, AKSA, ISMEN, AKMGY — Düşük/PARTIAL'dan Orta'ya), çünkü zaten indirilmiş birincil kaynaklar yeniden, derinlemesine okunduğunda gerçek çok yıllı CFO/CAPEX/FCF verisi bulundu. Ama **en az 3 şirkette (DOAS, TTRAK, TOASO) bu yeni veri, ilk turun "disiplinli/sağlam" yorumunu zayıflatan, daha olumsuz bir tablo ortaya çıkardı** — bu şirketlerin B kategorisinde kalması aynı kaldı, ama COMPARISON.md'nin "göreli daha güçlü B" / "zayıf B" iç sıralaması bu bulgularla yeniden değerlendirilmelidir (bkz. FINAL_SHORTLIST.md).

---

## 1. "Zaten indirilmiş ama kullanılmamış veri" hipotezinin şirket bazında sonucu

Görev talimatının temel hipotezi — Investulator'ın daha eski araştırmalarında (`outputs/bist-audit-20261101/`, `outputs/research-*-2026*/`) zaten bulunan finansal veri, 10 Kasım dividend-screening turunda yeterince kullanılmamış olabilir — **şirkete göre çok farklı derecede doğrulandı**:

| Şirket | Hipotez sonucu | Kanıt |
|---|---|---|
| **TUPRS** | **Kısmen doğru.** CFO serisi (2021-2025) zaten indirilmişti VE zaten doğru kullanılmıştı — "eksik" etiketi yalnızca CAPEX için geçerliydi, CAPEX de "erişilemedi" değil "PDF metin çıkarımı güvenilmez" sorunuydu. | `outputs/tuprs-verification-20261022/y2021-y2025.txt` |
| **TOASO** | **Doğru.** FY2024-2025 nakit akış tablosu önceki oturumun kendi kaynak dosyasında (`out2025.txt`) zaten vardı, okunmamıştı. FY2021-2022 ise bu turda yeni indirilen Tofaş 2022 FR'den bulundu. | `outputs/research-toaso-20261031/out2025.txt`, Tofaş 2022 FR |
| **DOAS** | **Doğru, ama düzeltmeyle.** FY2021-2023 nakit akış verisi zaten indirilmiş dosyalarda vardı; ancak önceki tur bunu **ara toplam ile final CFO toplamını karıştırarak** yanlış kullanmıştı — veri "eksik" değil, **yanlış okunmuştu**. | `outputs/bist-audit-20261101/doas-fy2022-raw.txt`, `doas-fy2023-raw.txt` |
| **TTRAK** | **Doğru, çarpıcı biçimde.** `ttrak-2021-2024-core.cjs` scripti, şirketin kendi Annual Report'larından okunmuş birincil CFO/CAPEX içeriyordu; dividend-screening turu bunun yerine ~1,16x-2,4x şişirilmiş ikincil (TradingView/Investing.com) rakamları kullanmıştı. | `outputs/bist-audit-20261101/ttrak-2021-2024-core.cjs` |
| **AKMGY** | **Doğru, çarpıcı biçimde.** "2021-2025 CFO/CAPEX hiçbiri doğrulanamadı" iddiası **çürütüldü** — FY2021-2025'in tamamı için nakit akış tablosu zaten indirilmiş FY raporlarında (`outputs/research-akmgy-20261031/fy202*.txt`, `outputs/bist-audit-20261101/akmgy-fy202*.txt`) mevcuttu. | Bkz. CASHFLOW.md |
| **AKSA** | **Kısmen doğru.** CFO 2021-2022 zaten doğru kullanılmıştı; CAPEX için OCR bozukluğu asıl engeldi (erişim değil). Net borç/FAVÖK "çelişkisi" veri eksikliği değil, zamanlama farkıydı. | `outputs/research-aksa-20261031/fy2021.txt`, `annual-cash-replay.json` |
| **FROTO** | **Doğrulanmadı — hipotez bu şirket için geçersiz.** `bist-audit-20261101`'de FROTO'ya özel hiçbir finansal tablo PDF'i hiç indirilmemiş (yalnızca fiyat verisi var). Önceki raporun "bulunamadı" notu dürüsttü. | `find outputs/bist-audit-20261101 -iname "froto*"` doğrulaması |
| **ISMEN, YGGYO, PAGYO** | Kısmen uygulanabilir — bu üç şirkette asıl açık madde çok yıllı CFO/CAPEX değil, sektöre özgü diğer kalemlerdi (sermaye yeterliliği, dağıtılabilir kâr mekanizması, doluluk oranı). Yerel dosyalar derinlemesine okunarak kısmi ilerleme sağlandı (bkz. aşağı). | Bkz. ilgili bölümler |

**Genel çıkarım:** Hipotez 5/10 şirkette (TUPRS, TOASO, DOAS, TTRAK, AKMGY) güçlü biçimde doğrulandı — bu, dividend-screening turunun kaynak taramasının genişlik önceliğiyle (10 şirket, zaman kısıtlı) yapıldığını, derinlik açısından zaten elde bulunan belgelerin tam taranmadığını gösteriyor. FROTO'da ise gerçekten hiç birincil kaynak toplanmamıştı.

---

## 2. Doğrulanan iddialar (önceki rapor doğru çıktı)

- **Temettü ödeme/kesinti olguları** (hangi yılın ödendiği/kesildiği) — 10 şirketin tamamında, denetlenen kapsamda **doğrulandı**: TUPRS (2020-2022 kesinti), DOAS (2017, 2020 kesinti), TTRAK (2019, 2026[FY2025] kesinti), AKSA (11 yıl kesintisiz, Yahoo Finance ile satır-satır mutabık), FROTO (süreklilik, 2020-2023 rakamları), TOASO (2021-2022 nakit temettü tutarları birincil kaynaktan teyitli), AKMGY (10 yıl kesintisiz), YGGYO/PAGYO (temettü tarihleri/tutarları büyük ölçüde değişmedi, PAGYO'da süreklilik 2014'e kadar genişletildi).
- **AKSA'nın reel/USD bazda net temettü büyümesi olmadığı** — bağımsız, CPI'ye bağımlı olmayan bir yöntemle ($54,9M→$50,5M doğrudan USD karşılaştırması) **teyit edildi**.
- **TOASO'nun Stellantis Otomotiv Pazarlama devralma bedeli (400M EUR)** — ECB kuru ve TMS29 restatement faktörüyle **bağımsız doğrulandı**.
- **DOAS'ın kredi notu indirimi (JCR Eurasia A+(tr)→A(tr), 20.05.2026)** — üç bağımsız haber kaynağıyla **teyit edildi**.
- **ISMEN'in ROE (%21,38 TTM) ve sermaye yeterliliği oranının kamuya açık olmadığı** — şirketin kendi H1 2026 sunumuyla **birebir doğrulandı**.
- **TTRAK'ın 08.11.2024 ikinci temettü ödemesinin FY2023'e ait olduğu** — önceden "çıkarım" iken, KAP bildirim başlığıyla **kesin teyitli** hâle geldi.

## 3. Yanlışlanan veya önemli ölçüde düzeltilen iddialar

| Şirket | İddia | Denetim sonucu |
|---|---|---|
| **FROTO** | 24.03.2021 temettüsü "~13 TL, teyit edilemedi" | **Yanlış.** Ford Otosan IR sayfasından doğrulanan gerçek rakam: **6,42 TL/pay**, toplam 2.252.842.200 TL — tahmin ~2 kat büyüktü. |
| **DOAS** | "2021-2023 CFO temettüyü 1,5x-3x karşılıyor, disiplinli dönem" | **Yanlış/abartılı.** Kullanılan CFO, ara toplamdı. Final CFO ile: 2022 (TMS29-bazında) FCF **negatif**, 2023 FCF temettünün yalnızca **~%11'ini** karşılıyor. |
| **TTRAK** | "2022: Temettü/CFO %30,8", "2023: Temettü/CFO %63,0" | **Yanlış — düzeltildi: %72,8 ve %91,0.** İkincil kaynaklı CFO rakamları 1,44x-2,4x şişirilmişti. 2021/2023/2024'ün üçünde temettü o yılın FCF'sini aştı (2024'te %314). |
| **AKMGY** | "2021-2025 CFO/CAPEX hiçbiri doğrulanamadı", "payout-to-CFO hesaplanamadı" | **Çürütüldü.** 5 yıllık seri birincil kaynaktan üretildi; FY2025'te ödenen temettü CFO'yu **%118,7** ile aşıyor. |
| **AKMGY** | "3.726.400.000 adet pay, 1 kuruş nominal" | **Güçlü dolaylı kanıtla sorgulandı** — piyasa değeri aritmetiği bu rakamla ~70-85 kat çelişiyor; gerçek pay sayısının ~1/100'ü olması muhtemel, MKK ile kesinleştirilemedi. |
| **AKMGY** | Hukuki risk "2025/2596, 2025/2597 + 2025/2503" üçlemesi | **Eksik kapsamlı.** İlk derecede reddedilmiş, istinaftaki dava sayısı en az **4** (2026/334, 2026/335 çifti önceki raporda hiç yoktu). |
| **YGGYO** | "FY2024 net zarar -523M TL" | **Çelişkili hâle geldi, çözülmedi.** Şirketin kendi FY2025 faaliyet raporunun KENDİ İÇİNDE iki farklı rakamı var (-364M metin, -249,45M tablo) + dış ikincil kaynağın -523M'si — üç kaynak üç farklı sayı. |
| **YGGYO** | "CFO net kârın 3,8 katı, güçlü nakit üretimi" | **Nitelik değişti.** H1 2026 CFO'nun %47,8'i (832,4M TL) banka faiz geliri — çekirdek kira işinden değil. |
| **PAGYO** | "Ekspertiz-içi doluluk çelişkisi (%91 vs %97-98)" | **Doğrulandı AMA büyüdü.** FY2024'ün kendi Not 6'sı 2024 için %95-96 diyor, FY2025'in Not 6'sı aynı 2024 için %97-98 diyor — üç belge birbirini tutmuyor. |
| **DOAS** | `doas-fr2024-eng.pdf`'nin birincil kaynak olarak kullanılabilir olduğu (403 ile erişilemedi, deniyordu) | **Dosya gerçek bir PDF değil** — bir Cloudflare bot-koruma HTML sayfası. Önceki ajan bunu asla okuyamamıştı, dosya adı yanıltıcı bir "indirildi" izlenimi vermişti. |
| **TOASO** | "3 çeyrektir derinleşen stok/nakit akışı sorunu" (H1/9A2026'da başladığı imajı) | **Yanıltıcı çerçeve.** FY2024'ün kendisi zaten CFO -9,63 mr TL, FCF -18,6 mr TL ile derin negatifti — sorun 2026 ara dönemlerinden önce, en az FY2024'te başlamış. |
| **AKSA** | "Şirketin ~2,8x ifadesiyle bağımsız ~3,70x net borç/FAVÖK hesabı mutabık kılınamadı" | **Çözüldü — hata değil, zamanlama farkı.** 9A2026 verisi oranın 2,84x'e düştüğünü gösteriyor; iki rakam farklı tarihlere ait, ikisi de doğru. |
| **ISMEN** | "2025 ödemesi (%154 payout) tamamen açıklanamaz" | **Kısmen çözüldü.** 298,2M TL'si geçmiş yıl kârından karşılanmış (teyitli); ama 8,5 mr ile 5,825 mr dağıtılabilir kaynak arasında ~2,67 mr TL hâlâ açıklanamıyor. |

## 4. Bu turun kendi sınırlılığı

- Her iki ajan (çift gruplandırılmış 5 oturum) kendi içinde zaman/araç kısıtına çarptı: bu ortamda `poppler`/`pdftoppm` kurulu değil, bu nedenle bazı PDF'lerin görsel/sayfa düzeni doğrulaması (TUPRS CAPEX satır kayması, PAGYO Not 6 tablo düzeni, FROTO'nun şifreli PDF'leri) **yapılamadı** — bu, ileri bir turda farklı bir araç/OCR ile tekrar denenmeli.
- Reel (TÜFE) ve USD bazlı temettü büyüme serisi, AKSA dışındaki 9 şirkette bu turda da **sistematik olarak üretilmedi** (zaman kısıtı, METHODOLOGY.md'nin zaten not ettiği eksik).
- YGGYO ve PAGYO denetimleri zaman kısıtı nedeniyle **web taraması yapmadı**, yalnızca yerel dosyaları madenledi — bu iki şirketin açık maddeleri (9A2026 PAGYO net kâr çelişkisi, YGGYO PROEN sermaye büyüklüğü) web doğrulaması gerektiriyor.
- Bu denetim de **kendi ajanları tarafından yazıldı ve bir ÜÇÜNCÜ bağımsız turdan geçmedi** — CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralı burada da geçerlidir; bu rapor ikinci turu temsil eder, nihai/kesin değildir.
