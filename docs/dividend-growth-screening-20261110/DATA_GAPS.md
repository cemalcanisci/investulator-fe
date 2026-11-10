# Veri Eksikleri — Dördüncü Tur (Konsolide)

**Kesim tarihi:** 2026-11-10. Bu dosya önceki üç turun [DATA_GAPS.md](../dividend-screening-20261110/DATA_GAPS.md)/[DATA_GAPS.md](../dividend-screening-independent-audit-20261110/DATA_GAPS.md) listelerini **tekrar etmez** — yalnızca bu turda **yeni bulunan** eksikler/çelişkiler ile henüz kapatılmamış, karar açısından en kritik olanları konsolide eder. [METHODOLOGY_V2.md](METHODOLOGY_V2.md) bölüm 3'ün ayrımı uygulanır: **araştırma eksikliği** (düzeltilebilir, şirket aleyhine delil sayılmaz) / **erişim engeli** (teknik, düzeltilebilir) / **gerçek veri boşluğu** (kalıcı, bir şeffaflık riski olarak değerlendirilir).

## Bu turda bulunan yeni eksikler/çelişkiler

| Şirket | Bulgu | Tür | Kararı engelliyor mu? |
|---|---|---|---|
| **AKMGY** | Pay sayısı aritmetik olarak 37.264.000 çıkıyor (CASHFLOW.md'nin FY2020/2022 rakamlarıyla örtüşerek); bu, 2023-2025 dividendHistory'sinin muhtemelen **%15-32 eksik kayıtlı** olduğunu gösteriyor | Gerçek veri boşluğu (MKK teyidi yok) | Hayır doğrudan — ama büyüme rakamlarının gerçek değerin altında olabileceği anlamına geliyor, izleme listesine eklendi |
| **PAGYO** | Pay sayısında ~%2,7 çözülmemiş tutarsızlık (87,0M beyan vs ~89,4M çıkarım) — 2016-2024 toplam nakit türetmelerinin tamamına sirayet ediyor | Gerçek veri boşluğu | Hayır — büyüme YÖNÜ değişmiyor, büyüklüğü hafif belirsiz |
| **FROTO** | profitYear 2025 ödemesinin (~%100,0 payout) hiçbir KAP tablosuyla doğrulanmadığı, ve bu rakamın headline 10y/5y CAGR'ların neredeyse tamamını sürüklediği | Araştırma eksikliği + erişim engeli (önceki turlarda zaten not edilmişti, bu tur büyüme hesabına sirayet ettiğini gösterdi) | **Evet — bu turun D kararının ana nedeni** |
| **DOAS** | 2022 toplam nakit temettüsünde çözülmemiş çelişki (1,935 vs 2,150 milyar TL, bağımsız denetimin bulduğu birincil nakit akış tablosu rakamı vs bu seride kullanılan per-share türevi) | Erişim engeli (403) | Hayır — CAGR uç noktaları değil, ara nokta |
| **ISMEN** | Gerçek düzenleyici sermaye yeterliliği oranı (SPK Seri V No:34) üç turda da hiçbir kaynaktan bulunamadı | **Gerçek veri boşluğu, kalıcı** | Hayır doğrudan, ama A kararını kalıcı olarak engelliyor (şeffaflık riski) |
| **YGGYO** | FY2024 net zarar büyüklüğü hâlâ 3 kaynakta 3 farklı rakam (−364M metin / −249,45M tablo — şirketin KENDİ raporunun iç çelişkisi / −523M dış kaynak); CFO'nun %47,8'i faiz gelirinden | Araştırma eksikliği (birincil kaynağın kendi iç çelişkisi, dışarıdan çözülemez) | Hayır — ama dağıtılabilir kâr mekanizmasının anlaşılmasını engelliyor |
| **TTRAK** | 08.11.2024 ikinci taksidinin hangi kâr yılına ait olduğu — bağımsız denetimin AUDIT.md'de "KAP bildirim başlığıyla kesin teyitli" dediği bulgu bu turda aktarıldı ama kendi başına yeniden teyit edilmedi | Araştırma eksikliği (önceki turun bulgusuna güvenildi) | Hayır |
| **TOASO** | FY2023 CFO/CAPEX serisi hâlâ yok; 5,88 mr TL'lik şarta bağlı yükümlülüğün yıllık nakit etkisi nicel modellenmedi | Erişim engeli + araştırma eksikliği | Hayır tek başına, ama FY2026 verisiyle birleşirse kategori kararını etkileyebilir |
| **AKMGY** | İstinaf/temyiz sürecinin sonucu (kesim tarihinde belirsiz) | Gerçek veri boşluğu (henüz olmamış bir olay) | **Evet — pozisyon büyüklüğü kararı bu sonuca kadar ertelenmelidir** (3. turdan korunan öneri) |

## TÜFE/USD-TRY referansının kendi sınırlaması (tüm 10 şirkete eşit uygulanır)

`_reference/MACRO_REFERENCE.md`'de belirtildiği gibi: TÜFE kaynağı (hakedis.org üzerinden TÜİK) ve USD/TRY kaynağı (Yahoo Finance) **birincil TÜİK veri portalı / TCMB resmi kuruyla bu oturumda çapraz doğrulanmadı**. Linkleme tutarlılığı (12 ayın hepsinde sıfır sapma) ve YoY çapraz doğrulaması (TÜİK'in yayımladığı resmi oranlarla birebir eşleşme) güven artırıcı, ama birincil kaynak doğrulaması değil. Bu, 10 şirketin **hepsine eşit** uygulanan sistematik bir sınırlama — herhangi bir şirketi diğerine göre dezavantajlı kılmaz.

## Bu çalışmanın kendi sınırlılığı

Dördüncü tur da (önceki üçü gibi) **bağımsız bir ikinci oturum tarafından denetlenmedi** (CLAUDE.md'nin "aynı ajan incelemesi bağımsız denetim sayılmaz" kuralı). Nihai A/B/C/D sentezi (bu dosyanın ve `FINAL_SHORTLIST.md`'nin yazarı) tek bir merkezi oturumda yapıldı; 10 şirketin veri derleme/hesap ajanları birbirinden bağımsız çalıştı ama aralarında çapraz doğrulama yapılmadı (ör. AKMGY'nin pay sayısı bulgusu PAGYO ajanına iletilmedi, her ajan kendi şirketine odaklandı). Beşinci bir bağımsız denetim turu, özellikle DOAS (C eşiği) ve FROTO (D) kararları için önerilir.
