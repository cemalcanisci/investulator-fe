# Metodoloji Değerlendirmesi — A/B/C/D Sınıflandırmasının Yeniden İncelenmesi

**Kesim tarihi:** 2026-11-10. Bu belge, `docs/dividend-screening-20261110/METHODOLOGY.md`'nin 10 şirketin tamamını B'de bırakan çerçevesinin **aşırı katı olup olmadığını** sorgular — görevin 5. bölümünün talebi.

## 1. Mevcut yöntem gerçekten aşırı katı mı?

**Hayır — ama nedeni "A standardı çok yüksek" değil, "çok yıllı doğrulanmış FCF/CFO serisi fiilen toplanmamıştı" idi.** Bu denetim, zaten mevcut (indirilmiş) kaynaklardan 5 şirkette (TUPRS'ta kısmen, TOASO, TTRAK, AKMGY, kısmen DOAS/AKSA) gerçek çok yıllı seriyi ortaya çıkardı. Bu serinin ortaya çıkması, A eşiğine yaklaşan şirket sayısını **artırmadı, tersine çoğu durumda azalttı**: DOAS ve TTRAK'ta düzeltilmiş veri, temettünün geçmişte zaten FCF'yi aştığını gösterdi (önceki "disiplinli dönem" yorumu yanlıştı); TOASO'da bozulmanın daha önce ve daha büyük başladığı ortaya çıktı. Yalnızca AKMGY ve AKSA'da yeni veri **net olarak daha olumlu/çözümleyici** çıktı (AKMGY'nin CFO/CAPEX'i artık var, ama payout CFO'yu aşıyor; AKSA'nın net borç/FAVÖK "çelişkisi" zamanlama farkı olarak çözüldü — ikisi de A'ya yetecek kadar güçlü değil).

**Sonuç: Yöntem aşırı katı değildi; onun yerine ilk turun kaynak taraması yeterince derin değildi.** Daha derin tarama, genel olarak B kararını **doğruladı ve sağlamlaştırdı**, A'ya terfi ettirmedi.

## 2. "10-15 yıl boyunca her yıl artan temettü, çekirdek adaylık için zorunlu mu?"

Mevcut yöntem bunu zaten zorunlu kılmıyordu (METHODOLOGY.md bölüm 9: "tek yıllık zarar/kesinti otomatik C değil"). Bu denetim bu ilkeyi **doğru bulur ve korur**: TUPRS, DOAS, TTRAK'ın geçmiş kesintileri (2020-2022, 2017/2020, 2019/2026) toparlanma kanıtıyla (2018-2019 TTRAK örneği, 2021 DOAS örneği, 2022-2023 TUPRS örneği) birlikte değerlendirildiğinde haklı olarak C'ye düşürülmemiş. **Ama bu denetim, "her yıl artan" yerine "çok yıllı FCF ile kanıtlanmış ödeyebilirlik" standardının asıl ayırt edici kriter olması gerektiğini doğruluyor** — ve bu standart hâlâ hiçbir şirkette (10-15 yıllık, kesintisiz bir FCF karşılama serisiyle) tam karşılanmıyor.

## 3. Döngüsel şirketlerde temettü kesintisi hangi koşullarda kabul edilebilir?

Mevcut çerçeve (geçmiş şoktan güçlü dönüş kanıtı arama) doğru yönde, ama bu denetim bir **eksik boyut** ortaya çıkardı: dönüş kanıtı ararken, kesintiden ÖNCEKİ dönemde dağıtımın zaten sürdürülebilir olup olmadığı da sorgulanmalı. TTRAK örneği: FY2025 kesintisi "disiplinli bir yönetim kararı" olarak okunabilirdi (ve COMPARISON.md böyle okumuştu), ama düzeltilmiş veri 2021-2024'ün üçünde temettünün zaten FCF'yi aştığını gösteriyor — kesinti, disiplinin kanıtı değil, önceki disiplinsizliğin kaçınılmaz sonucu olabilir. **Öneri: "döngüsel kesinti kabul edilebilir" testine, kesinti öncesi 3-4 yılın FCF/temettü oranının gerçekten ≤1,0x olup olmadığı kontrolü eklenmeli** — yalnızca "dönüş var mı" değil, "dönüşten önceki disiplin gerçek mi" sorusu da sorulmalı.

## 4. Çok yıllı FCF eksikliği şirketin finansal zayıflığı mı, araştırma eksikliği mi?

Bu sorunun cevabı **şirkete göre ayrıştırılabilir hâle geldi** (görevin istediği gibi):
- **Araştırma eksikliğiydi** (asıl veri sorunlu değil, erişilmemiş/okunmamış): TOASO, TTRAK, AKMGY, DOAS (kısmen), TUPRS (CFO için).
- **Gerçekten erişilemiyor** (teknik/erişim engeli, veri muhtemelen var ama bu ortamda çıkarılamıyor): TUPRS (CAPEX, PDF metin çıkarım kalitesi), FROTO (şifreli PDF'ler), AKSA (CAPEX, OCR bozukluğu).
- **Gerçekten hiç toplanmamış/mevcut değil:** FROTO'nun birincil finansal tablo verisi (bist-audit-20261101'de hiç indirilmemiş).

**Öneri:** DATA_GAPS.md ve benzeri dokümanlarda "eksik" etiketi tek bir kategori olarak kalmamalı; en azından "erişilmedi/taranmadı" (araştırma eksikliği, düzeltilebilir) ile "erişilebilir değil/okunamıyor" (teknik sınır) ve "hiç mevcut değil" (gerçek veri boşluğu) ayrımı yapılmalı — bunların her biri farklı bir "kararı engelliyor mu" ve "nasıl kapatılabilir" yanıtı gerektiriyor.

## 5. Şirketin yapısal riski ile eksik veri nasıl ayrılmalı?

Bu denetim, bu ayrımın bazı şirketlerde **ilk turun sandığından daha zor** olduğunu gösterdi — çünkü bazı "eksik veri" maddelerinin arkasında aslında **olumsuz bir gerçek** çıktı (DOAS'ın FCF karşılaması gerçekte zayıf; TTRAK'ın geçmiş dağıtımı gerçekte agresifti; TOASO'nun bozulması gerçekte daha eski ve daha büyüktü). Yani "veri eksikti" ile "veri olumsuzdu ama görülmemişti" bazen aynı madde içinde iç içe geçmiş durumda. **Öneri:** Bir DATA_GAPS maddesi kapatıldığında, sonucun basitçe "artık doğrulandı" değil, "doğrulandı VE sonuç [olumlu/olumsuz/nötr] çıktı, önceki yorumu [güçlendirdi/zayıflattı/değiştirmedi]" şeklinde kaydedilmesi, gelecekteki konsolidasyon turlarının bu ayrımı daha net görmesini sağlar.

## 6. Kanıt güvenilirliği ekseninin netleştirilmesi

İlk tur, çoğu şirkette genel bir "PARTIAL" etiketi kullanmıştı. Bu denetim, kanıt güvenilirliğinin **bölüm bazında** (TUPRS örneğinde: CFO=Yüksek, CAPEX=Düşük, temettü olgusu=Yüksek, temettü tam rakamları=Düşük-Orta) değerlendirilmesinin tek bir blanket etiketten daha bilgilendirici olduğunu gösterdi. **Öneri:** `dividend-screening.json` şemasına, genel `verificationStatus` alanının yanında, en azından `dividendHistoryConfidence`, `cashFlowConfidence`, `riskAssessmentConfidence` gibi alt alanlar eklenmesi, gelecekteki okuyucuların "bu şirket hangi KONUDA güvenilir, hangi konuda değil" sorusunu tek bakışta görmesini sağlar.

## 7. Bugünkü fiyat/hedef fiyat sızıntısı var mı?

Denetim, hiçbir audit raporunun fiyat hedefi veya alım/satım önerisi üretmediğini doğruladı — hem orijinal hem bu turun ajanları bu kısıtlamaya uydu. **Metodolojik disiplin bu konuda korunmuş.**

## 8. Genel sonuç

**A/B/C/D çerçevesi kendisi aşırı katı değil — iki eksenli (stratejik uygunluk × kanıt güvenilirliği) ayrım görevin istediği gibi doğru kurulmuş.** Asıl iyileştirme alanı, kanıt toplama derinliğiydi (çoğu şirkette zaten mevcut kaynaklar yeterince taranmamıştı) ve bu derinlik artınca sonuç genel olarak B kararını **doğruladı, bazı durumlarda daha olumsuz bir resim ortaya çıkardı**, hiçbir durumda A eşiğine yaklaştırmadı. Bu, metodolojinin gevşetilmesi gerektiği anlamına gelmez — tersine, mevcut A standardının (çok yıllı, bağımsız doğrulanmış FCF/CFO karşılama + kesintisiz öngörülebilir süreklilik) **doğru yerde durduğunu, 10 şirketin hiçbirinin bu standardı gerçekten karşılamadığını daha güçlü kanıtla teyit ediyor.**
