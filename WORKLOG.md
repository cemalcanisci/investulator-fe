# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-26

Harici araçla sıfırdan üretilen SISE Excel'i gerçek okuyucu, ön izleme, izole kalıcı depo, analiz sayfası, yenileme ve kayıpsız export/import zincirinden geçti. Ayrıntılı teslim: [EXTERNAL_IMPORT_TEST_20261026.md](EXTERNAL_IMPORT_TEST_20261026.md).

- Kök neden doğrudan ExcelJS stack trace ile tekrarlandı: geçerli SpreadsheetML XML öneklerinde workbook modelinin oluşmaması. researchWorkbookXml.ts ad alanı öneklerini standartlaştırır; hücre okuyucusu yalnızca ExcelJS, güvenlik sınırları korunur.
- Yeni rapor için yalnızca boş hesap dizisi başlangıçlarına izin verildi; finansal olgular sunuma yansıtılır. Kimlik/rapor ön doğrulaması, alan konumlu hatalar ve değişiklik yok/kayıt kapalı/kayıt hatası mesajları ayrıldı.
- observedAt kaynak yayımlanma tarihinden ayrı, muhafazakâr erişilebilirlik sınırı; businessDescription ve çeviri anahtarı olmayan şirketler için görünüm desteği. TMS 29/dönem kapıları ve UNVERIFIED/NEEDS_REVIEW korunur.
- public/research/sise-import-test.xlsx bağımsız üreticiyle sıfırdan hazırlandı. JSON örneği ve EXTERNAL_FORMAT.md zorunlu sayfa/sütun/alan sözleşmesini içerir. Örnek resmi kaynaklı 2025 tutarları içerir, tam bağımsız araştırma değildir.
- Ön izleme: added 142, updated 0, unchanged 0, newCompanyIds [watch-bist-sise], issues []. Gerçek HTTP/disk/Chrome 19 kontrol geçti. Beş ekran genişliği, koyu tema, sayfa yenileme ve finansal değerler doğrulandı. Üst çubuk TRY dönüşümü kur servisi yokluğunda doğrulanmadı.
- Tam Vitest: 532 test, 527 başarılı, 5 başarısız. Temiz HEAD arşivinde aynı AnalysisPage (4) ve research service (1) hatası tekrarlandı; yeni hata yok. Genel coverage satır %91,71, dal %86,02; genel %80 eşiği geçildi.
- TypeScript/build ve mevcut Oxlint başarılı. Genel format kontrolü dokunulmayan README ve üç araştırma JSON dosyasını işaretliyor; kullanıcı değişiklikleri ve gerçek veri biçimi korunuyor.
- TUPRS ve gerçek araştırma dosyaları hash karşılaştırmasıyla değişmedi. Kullanıcının 5173 sunucusu korunur. Kalıcı servis hâlâ yerel geliştirme ortamına özgüdür. Commit/push yapılmadı.
- Sıradaki işler: kullanıcı incelemesi; ayrı kapsamda mevcut 5 eski test beklentisi ve mevcut format sorunları. TUPRS araştırması kısmi kalır; backend/Keycloak/runtime AI ilerletilmedi.

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

- **2026-10-24 — Codex:** Yaklaşık simülasyonda 18 senaryo bağımsız algoritmayla eşleşti; 31 ilgili Vitest testi izinle geçti. 67 aylık fiyat farkı ve kaynak eksikleri belgelendi; uygulama değiştirilmedi.

- **2026-10-24 — Codex:** Oran durumları, ortak bütüncül değerlendirme ve tek simülasyon arayüzü tamamlandı; kaynak eksikleri açık, yeni regresyonlar yazıldı fakat çalıştırılmadı.

- **2026-10-25 — Codex:** Son geçerli dönem, ayrı finansal/fiyat görünümü ve kontrollü kalıcı XLSX aktarımı eklendi. 90/90 ilgili test geçti; 0 başarısız. Tam suite/coverage çalıştırılmadı. Üretim API ve finansal kaynak eksikleri teslim belgesinde açıklandı.

- **2026-10-25 — Claude:** XLSX Import'a **URL'den Yükle** seçeneği eklendi (`/research/...xlsx`, aynı origin, mevcut önizleme/onay/kalıcı yazma akışı korunur); `sanitizeResearchUrl`/`fetchResearchWorkbookFromUrl` (`src/lib/researchUrlImport.ts`), i18n, `public/research/` ve kök `README.md` (PowerShell başlatma komutu) eklendi. Tüm suite çalıştırıldı: 520/525 geçti; kalan 5 başarısız test bu işten bağımsız, önceki oturumun v6→v7 veri güncellemesinden kalan stale fikstür (`AnalysisPage.test.tsx`, `services/research.test.ts`) — düzeltilmedi, ayrıca not edildi. tsc/lint/build/format temiz. Commit/push yapılmadı.

- **2026-10-26 — Codex:** Harici XLSX/SISE aktarımı, gerçek kalıcılık ve analiz görünümü doğrulandı; 527/532 test, aynı 5 temel hata; 19 gerçek entegrasyon kontrolü başarılı. Format sözleşmesi ve bağımsız Excel örneği eklendi; gerçek TUPRS verisi korunarak commit/push yapılmadı.
