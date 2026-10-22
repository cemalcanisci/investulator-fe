# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-22

Kullanıcının onayladığı sınırlı ortak altyapı düzeltmeleri uygulandı. TUPRS tamamlanmış sayılmıyor; sonraki hisse/feature için onay bekle.

- domain/evidence + sourceEvidence: köken, toplama, inceleyen, belge konumu, kapsam ve ata kayıtları. Aynı köken/belge/toplama/inceleyen bağımsız teyit değil. analysisValidation çıplak VERIFIED ve belgesiz TMS29 bazını engeller.
- historyIntegrity takvim/kotasyon/temettü/aksiyon/fiyat/kur için bağımsız kapsam kanıtı ister. TUPRS manifesti yok; 10/15/20 yıl sonuçları kapalı. Gerçek kaynak bağımsızlığını farklı kimlikler otomatik ispatlamaz.
- valuationBasis akış/stok/çarpan/pay rollerini, bilgi/değerleme tarihini ve senaryo varsayımlarını kontrol eder. FCF, BOOK_ROE, NAV ve DDM henüz METHOD_PENDING. Kaynaklı normalizasyon olmadan TUPRS fiyatı üretilmedi.
- analysisPriorities yalnız yorum/inceleme sırasını değiştirir. analysisQuality hesap, kaynak, bölüm ve bağımsız incelemeyi ayırır; şemada bağımsız inceleme sertifikası olmadığı için genel tamamlanma açılmaz.
- analysis-reports.json v5: birincil belge mutabakat kanıtları, bölüm açıkları ve 2021–2025 kaynak envanteri; v4 ve eski TS raporları korunur. AnalysisQuality kaynak izini, strateji sırasını ve bölüm eksiklerini gösterir; eski açıklamalar kaldırılmadı. TR/EN anahtarları birlikte eklendi.
- Resmî H1 tablo ve KAP planı mutabakatı: net finansal borç −102,232249 milyar TL; işletme nakdi eksi yatırım 120,508319 milyar TL, sürdürülebilir FCF değildir. Beş yıllık seri baz/kapsam farkları nedeniyle tamamlanmadı. Güncel fiyat-hacim, normalleştirilmiş FAVÖK/akran çarpanı, tam KAP ekleri ve bağımsız inceleme açık.
- Yeni evidence.test ve valuationBasis.test; dividendBacktest/financialPeriods/research servis/sayfa regresyonları güncellendi. Vitest/coverage kullanıcı politikası gereği çalıştırılmadı. Build ve lint başarılı; mevcut bundle ve üç eski mock tipi uyarısı sürüyor. Görsel kabul bu tur yapılmadı.
- Ayrıntılı kaynaklar, ilk 15 bulgunun durumu ve tamamlanma kapısı: ../FINANSAL_ANALIZ_KAYNAK_MUTABAKATI_20261022.md. Ortak kurallar kök CLAUDE ve teknik eke yazıldı. Backend/Keycloak/runtime AI/portföy değişmedi; commit/push yapılmadı.

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
