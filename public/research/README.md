# public/research/

Stratejiler sayfasındaki Import penceresinin **URL'den Yükle** seçeneği, bu klasöre konan `.xlsx` dosyalarını `/research/<dosya-adı>.xlsx` yolundan okur (Vite bu klasörü olduğu gibi statik sunar).

Yalnızca aynı origin ve bu klasörün altındaki `.xlsx` dosyalarına izin verilir; `https://` ile başlayan dış bağlantılar, `..` içeren yollar ve sorgu parametreleri reddedilir. Dosyanın buradan okunması tek başına kalıcı bir kayıt oluşturmaz; mevcut ön izleme/onay akışı (bkz. [`../../README.md`](../../README.md)) değişmeden sürer.
