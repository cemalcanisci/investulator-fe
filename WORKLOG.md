# WORKLOG.md (investulator-fe)

`investulator-fe`'ye özel ayrıntılı durum kaydı. Genel/ürün seviyesi durum için önce [`../WORKLOG.md`](../WORKLOG.md)'yi oku; kural orada (ŞU AN baştan yazılır, GEÇMİŞ'e satır eklenir, asla silinmez).

---

## ŞU AN

**Son güncelleyen:** Codex — **Tarih:** 2026-10-09

### Git kurulumu ve geçici test politikası (2026-10-09)

Git deposu dev branch ile oluşturuldu; origin git@github.com:cemalcanisci/investulator-fe.git. Kullanıcı şimdilik public push yapılmasını onayladı; private dönüşümünü daha sonra kendisi yapacak. GitHub dev aktarımı bu oturumun kapsamındadır. Ortam dosyaları, anahtarlar ve üretilen çıktılar Git dışında. Husky prepare ve pre-commit (yalnızca lint) eklendi; uygulama kodu değişmedi.

Sayfa 0-6 onaylı; Ayarlar sayfası kullanıcı kararıyla kaldırılmış durumda. Kullanıcının istediği genel inceleme ve mevcut frontend bulgularının düzeltmeleri tamamlandı. Sıradaki ürün fazı hâlâ Keycloak ve gerçek API entegrasyonu.

### Önceki incelemede tamamlananlar

- İşlem sırası: domain'e opsiyonel 'executedTime', forma saat alanı eklendi. 'lib/positions.ts' içindeki 'compareLedgerOrder' tarih/saat/sayısal id sırasını ortaklaştırır; 'quantityBefore' satışın hemen öncesindeki adedi hesaplar. Liste, varlık geçmişi, Dashboard ve dışa aktarım aynı sırayı kullanır. Eski saatsiz kayıtlar 12:00 kabul edilir.
- 'TransactionForm.tsx': bedelsiz/bölünmede kur ve para birimi alanları gizlenir, kur sorgusu yapılmaz. Tür değişiminde eski miktar/tutar alanları temizlenir; nakitsiz kaydı alışa çevirince yer tutucu kur snapshot olarak kullanılmaz. Temettü etiketi net toplam tutarı belirtir.
- 'transactionForm.ts': hesaplanan alan elle değiştirilirken görünen değerler korunur; türetilen adet/fiyat 18 ondalık, toplam 8 ondalık kullanır. 'services/transactions.ts' USD snapshot'ını 8 ondalığa kadar korur.
- 'transactionValidation.ts': servis girişinde türe uygun zorunlu/boş alanlar, pozitif miktarlar, komisyon, tarih/saat ve USD kuru doğrulanır. Negatif pozisyon kontrolü ve atomik kayıt devam eder.
- Tarih doğrulaması 'formatDate.ts' içinde ortaklaştırıldı; 30 Şubat gibi tarihler forma ve kur sorgusuna kabul edilmez. 'useFxRateToUsd.md' güncellendi.
- 'decimal.ts', 'holdingsView.ts', 'transactionsView.ts', 'analysisView.ts': para sıralamaları ve yüzde hesabı ondalık aritmetik kullanır. 'formatMoney.ts' küçük birim fiyatları sıfıra yuvarlamadan gösterir.
- Aktarım: opsiyonel saat sütunu, eski 14 sütunlu dosyalarla uyumluluk, kaydedilmiş birim fiyatın korunması ve bedelsiz/bölünmede kurdan bağımsız mükerrer kontrolü. Türkçe/İngilizce alanlar ve kılavuzlar güncellendi.
- İnceleme raporu: '../outputs/review-20261002/INCELEME.md'. Ürün kararları kök 'CLAUDE.md''ye işlendi.

### Doğrulama

- Son aktarım kontrolü: eski başlık düzeninde fazladan hücre reddi eklendi; ilgili 25 aktarım şeması testi ayrıca tekrar geçti.

- **48 test dosyası, 330 test geçti.** Kapsam: ifade **%97,25**, dal **%91,87**, fonksiyon **%96,33**, satır **%97,21**. Tüm metrikler %80 eşiğini geçti.
- Üretim derlemesi (TypeScript dahil), Prettier ve lint başarılı. Önceden mevcut büyük paket uyarısı ve aktarım testlerindeki üç mock tip uyarısı sürüyor; lint hatası yok.
- Yerel Chrome, ayrı 5199 portu: Dashboard, Yatırımlarım, İşlemler, Varlık Detayı, Analiz, Aktarım ve yeni işlem formu **1440/1100/820/680/390** genişliklerde test edildi. **35 taşma kontrolü geçti**, JavaScript hatası yok; koyu tema/TL modu denendi. Masaüstü ve mobil ekran görüntüleri incelendi. Test betiği yalnızca kendi sunucusunu ve tarayıcısını kapatır; kullanıcının 5173 sunucusuna dokunulmadı.
- Tarayıcı aracı bağlantısı çalışmadığından geçici klasörde Playwright kullanıldı; proje bağımlılıklarına eklenmedi. Betik ve ekran görüntüleri 'C:/Users/Can ISCI/AppData/Local/Temp/investulator-review-20261002' altında.

Kullanıcı kararı: commit/push ve her özellik sonrası otomatik test çalıştırma kapalı; toplu kontrol proje sonunda. Başlatılan kapsam testi kullanıcı kararı üzerine tamamlanmadan durduruldu; bu oturum için test başarısı iddia edilmez. Husky yalnızca lint çalıştırır.

### Sırada / bilinen sınırlar

1. Keycloak kurulumu ve backend JWT/gerçek API entegrasyonu.
2. Tarih + yerel saatin UTC işlem zamanına dönüşümü ve saatsiz eski kayıt politikası backend'de korunmalı.
3. Gerçek ağırlıklı ortalama maliyet, komisyon etkisi, gerçekleşen/gerçekleşmemiş K/Z ve temettü getirisi backend'de uygulanmalı.
4. İşlem defteri hâlâ **bellekte**, yenilemede sıfırlanır. Yatırımlarım/Analiz/Varlık Detayı pozisyon toplamları ve grafikler **sabit mock**; işlem değişiklikleri şimdilik geçmişe ve Dashboard son işlemlerine yansır.
5. Temettü brüt/stopaj ayrımı, kurumsal aksiyonların varlık türü uygunluğu ve kesirli hisse/nakit telafisi backend domain tasarımında değerlendirilmeli. API sözleşmesinde türe göre DTO/TypeScript birleşim tipine geçiş değerlendirilecek; mevcut nullable model servis doğrulamasıyla korunuyor.
6. Analiz dönemi yalnızca zaman grafiğine uygulanır; TWR/IRR ve kapanan pozisyon getirisi henüz yok. Varlık Detayı mevcut mock holdings ile sınırlı. PDF istemci tarafında özet rapordur.

---

## GEÇMİŞ

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
