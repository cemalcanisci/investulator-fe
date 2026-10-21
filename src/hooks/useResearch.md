# useResearch

Katalog kimliğiyle sürümlü araştırma raporlarını okur. Şimdilik frontend dosyalarını
okuyan servis, ileride aynı sözleşmeyle backend'e bağlanabilir. Portföy/işlem verisi
kullanılmaz. Boş dizi rapor bulunmadığını belirtir; ağ hatasıyla karıştırılmaz.

Örnek: `const query = useResearch('watch-bist-tuprs');`
`query.data` rapor dizisi; `isPending`, `isError`, `refetch` React Query durumlarıdır.
