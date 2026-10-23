# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-23

Yaklaşık geçmiş yatırım simülasyonu tamamlandı; kullanıcı incelemesi bekleniyor. Sonraki hisseye geçme. Önceki analiz UX ve TUPRS v6 korunur; genel finansal analiz tamamlanmış sayılmaz.

- Yeni domain/approximateHistory, lib/approximateBacktest ve services/approximateHistory: sembolden bağımsız aylık hesap, decimal tutarlar, XIRR, dönem/kur/pay bazı/kaynak kapsam kapıları. APPROXIMATE ve PRICE_ONLY, strict COMPLETE/VERIFIED ile karışmaz.
- tuprs-approximate-history.json: 23 Ekim yeniden indirilen Yahoo fiyat/kurdan 240 aylık gözlem; 20 temettü tutarı/tarihi aracı kurum ve takvimle mutabakat; tek 2023 7:1 bedelsiz. Kaynaklar bağımsız sayılmaz. Aynı ajan incelemesi, kısmi kaynak güveni açık.
- ApproximateBacktest: aylık/tek seferlik USD tutar, varsayılan aylık 1.000 USD, fiyat-only/nakit/yeniden yatırım, TL/USD katkı-son değer-kâr-getiri-XIRR, alacak ve kaynak/iz panelleri. ResearchPage/ResearchOverview bağlantıları yeni öncelikli panele yönelir; eski panel erişilebilir.
- DividendBacktest.tsx, dividendBacktest.ts, historyIntegrity.ts ve eski tarihsel JSON değişmedi. Strict 10/15/20 MISSING_DATA devam eder. Eski yıllık 1.000 USD varsayımı ayrı korunur.
- Yaklaşık aylık 1.000 USD, 2026-09-30: 10/15/20 yıl yeniden yatırım toplamları 463.813,89 / 792.721,50 / 1.397.157,13 USD; alacak dahil, brüt ve masrafsız. XIRR %25,84 / %18,02 / %15,50. Kaynak/varsayım olmadan bu değerleri güncel veya garanti sayma.
- approximateBacktest.test ve ApproximateBacktest.test yazıldı; otomatik Vitest/coverage ÇALIŞTIRILMADI. tsc -b ve Vite build başarılı; büyük paket uyarısı var. Lint hatasız, üç eski mock tipi uyarısı sürüyor.
- Ayrı 5199 sunucusunda 5 genişlik × 2 görünüm, mod/para birimi, TR/EN/koyu tema, sonuç değişmezliği ve strict içeriği kontrol edildi. Kanıt ve ham kaynaklar ../outputs/approximate-20261023/; teknik rapor ../YAKLASIK_GECMIS_YATIRIM_20261023.md.
- Açık sınırlar: bağımsız doğrulama yok; aylık ödeme sonrası alım gecikmesi; nakit temettü yerel para biriminde faizsiz; sıfır vergi/komisyon; fiyat/FX kapanış saati farkı. USD kotasyonlu varlık için ek TL raporlama serisi yeni veri adaptöründe gerekir. Backend/Keycloak/runtime AI/portföy değişmedi; commit/push yok.

---

## GEÇMİŞ

- **2026-10-21 — Codex:** 15 bulgu için kod/kaynak denetimi ve ortak analiz mimarisi planlandı; üç doğrulama açığı salt okunur tekrar ile belgelendi. Üretim uygulaması kullanıcı onayı bekliyor; ayrıntı kök denetim belgesinde.

_Yeni satırlar en alta eklenir; var olan satırlar değiştirilmez._

- **2026-09-21 — Claude:** Vite iskeleti, tema altyapısı (3 tema, token'lar), i18n (tr+en), `logger`, `AppProviders` kuruldu.
- **2026-09-21 — Claude:** Uygulama kabuğu (`AppShell`: sidebar/drawer/bottom tabs) ve Sayfa 1 (Dashboard: KPI kartları, portföy grafiği, dağılım halkası, en çok kazandıran/kaybettiren, son işlemler, fiyat durumu) yapıldı, onaylandı.
- **2026-09-21 — Claude:** Sayfa 2 (Yatırımlarım) yapıldı: özet kartları, arama/filtre/sıralama, tablo + kart listesi, fiyat durumu rozeti, boş/hata/yükleniyor/sonuç-yok durumları. Renk token kaynağı `design/`'den `src/theme/tokens.ts`'e taşındı, `design/` arşive alındı.
- **2026-09-21 — Claude:** Kullanıcı geri bildirimiyle Sayfa 2'ye eklenenler: çip/select imleci, fiyat+rozet alt alta hizalama, **USD↔TRY gösterim para birimi anahtarı** (`useMoney`, `useCurrency`, `CurrencyProvider`, `services/fx.ts`), **sticky tablo başlığı ve toplam satırı**, **sütun başlığından sıralama** (`SortButton`, `aria-sort`, ikinci tıklama yön çevirir).
- **2026-09-21/22 — Claude:** Sayfa 3 (İşlemler) taslağı sunuldu ve onaylandı; kod yazıldı (liste, filtreler, yeni/düzenle modalı, iptal/iptali kaldır diyaloğu, bellek içi mock servisler — ayrıntı yukarıdaki "ŞU AN"da). Test, tarayıcı doğrulaması ve dokümantasyon **tamamlanmadı**.

- **2026-09-22 — Codex:** İşlemler onaylandı ve testleri tamamlandı; Varlık Detayı yapılıp onaylandı. Analiz ilk sürümü, ortak pointer kuralı ve grafik para birimi erişilebilirliği eklendi; 283 test geçti, Analiz onayı bekleniyor.
- **2026-09-23 — Claude:** Sayfa 7 (Ayarlar) kullanıcı tarafından gereksiz bulunup tamamen kaldırıldı (kod, testler, i18n, worklog/CLAUDE.md güncellendi). Sayfa sayfa tasarım turu bitti; Faz 1 (Keycloak kurulumu) başlıyor.

- **2026-10-02 — Codex:** Genel inceleme yapıldı; işlem saati/sırası, satış öncesi adet, nakitsiz işlem kur bağımlılığı, tür değiştirme, küçük tutar hassasiyeti, tarih ve servis doğrulaması, ondalık sıralama ve aktarım uyumluluğu düzeltildi. 330 test ve beş genişlikte 35 tarayıcı kontrolü geçti; ayrıntılı rapor outputs/review-20261002/INCELEME.md.

- **2026-10-09 — Codex:** dev branch ve GitHub origin kuruldu; ilk aktarım hazırlandı. Kullanıcı public repo kullanımını şimdilik onayladı.

- **2026-10-09 — Codex:** Kullanıcı kararıyla otomatik test çalıştırma ertelendi; Husky test adımı kaldırıldı, lint korundu.

- **2026-10-11 — Codex:** Stratejiler/Takip Listesi ilk ekranı, ayrı seed/oturum verisi, grup/üyelik yönetimi, TR/EN ve yeni test kodları eklendi; otomatik test çalıştırılmadı, kullanıcı onayı bekleniyor.

- **2026-10-11 — Codex:** Grup filtresi toggle düzeltildi; kaynaklı TUPRS frontend araştırma ekranı, KAP/borç/FX açıklamaları ve test kodları eklendi. Otomatik test çalıştırılmadı; görsel kontrol araç bağlantısına takıldı.

- **2026-10-11 — Codex:** Kullanıcı geri bildirimiyle açıklamalı oranlar, ucuzluk değerlendirmesi, şirket/ortaklık/siyasi risk özeti v2 olarak eklendi. Skill kalıcılaştırması kullanıcı onayından sonraya bırakıldı.

- **2026-10-11 — Codex:** V3 uzun vadeli temettü, SAF/elektrik/hidrojen fırsatları ve izleme koşulları eklendi. V2 onaylı standart skill’lere aktarıldı; build/lint tamamlandı, otomatik test çalıştırılmadı.

- **2026-10-20 — Codex:** Aylık USD katkı ve temettü yeniden yatırım hesaplayıcısı eklendi; basit kâr/yıl ile yıllık bileşik model getirisi ayrıldı. Testler yazıldı; otomatik çalıştırılmadı.

- **2026-10-20 — Codex:** Kullanıcı düzeltmesiyle gelecek projeksiyonu kaldırıldı; TUPRS 10/15/20 yıllık kaynaklı yaklaşık tarihsel birikim, ödeme günü yeniden yatırım, XIRR, eksik geçmiş durumları ve TR/EN ortak bileşen eklendi. Tüm temettü hisseleri kapsamı üç skill’e aktarıldı; testler yazıldı, otomatik çalıştırılmadı.

- **2026-10-21 — Codex:** A–C: ortak analiz sözleşmesi/doğrulama/profiller, TUPRS v4 yerel JSON, backtest bütünlük kapısı ve TR/EN detay ekranı uygulandı. Test kodları yazıldı, otomatik çalıştırılmadı; 15 bulgu yeniden denetimi ve açık riskler belgelendi.

- **2026-10-22 — Codex:** Yedi takip maddesi mevcut kodla karşılaştırıldı; manifest bağımsızlık kanıtı, ekonomik dönem/varsayım ilişkileri, strateji öncelikleri ve TMS29 izlenebilirliği için sınırlı düzeltme ve ayrı TUPRS tamamlama planı sunuldu. Üretim kodu değişmedi; onay bekleniyor.

- **2026-10-22 — Codex:** Onaylanan kanıt/bağımsızlık, ekonomik dönem/TMS29 ve strateji önceliği düzeltmeleri; TUPRS v5 birincil belge mutabakatı ve açık bölüm planı eklendi. Analiz kısmi, otomatik testler çalıştırılmadı.

- **2026-10-23 — Codex:** Analiz UX: ortak metrik eğitimi, EASY/DETAILED, genel bakış, uyumlu tarihsel/akran karşılaştırması ve simülasyon korunma regresyonları eklendi. Build/lint/tarayıcı kontrolleri yapıldı; Vitest/coverage çalıştırılmadı.

- **2026-10-23 — Codex:** Ortak yaklaşık simülasyon, gerçek TUPRS aylık snapshot, iki seviyeli sunum ve regresyonlar eklendi. Üç vade yaklaşık hesaplanıyor; strict kapılar korunuyor.
