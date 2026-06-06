# Co_LAB v3.3 Slayt Önizleme ve Kalite Kontrol Editörü

## Amaç

Bu sürüm, PPTX indirmeden önce adminin sunum taslağını canlı olarak kontrol etmesini sağlar.

## Yeni akış

```text
AI Sunum Taslağı Üret
↓
Sunum taslak ID al
↓
Görselleri slaytlara bağla
↓
Slayt Önizleme Editörü
↓
Başlık / madde / görev / görsel prompt düzenle
↓
Slayt sırasını değiştir
↓
Kalite göstergelerini kontrol et
↓
Düzenlemeleri kaydet
↓
Önizlenen sürümü PPTX indir
```

## Eklenen özellikler

- sunum taslağını ID ile yükleme
- slaytları sol menüde listeleme
- seçili slaytı canlı kart olarak önizleme
- bağlı görseli önizlemede gösterme
- slayt başlığı düzenleme
- madde düzenleme
- madde ekleme / silme
- öğretmen notu düzenleme
- öğrenci görevi düzenleme
- görsel prompt düzenleme
- animasyon preset değiştirme
- slaytı yukarı / aşağı taşıma
- slayt kopyalama
- slayt silme
- kalite kontrol yüzdeleri
- düzenlemeleri kaydetme
- önizlenen sürümü PPTX indirme

## Kalite göstergeleri

Panel şu göstergeleri hesaplar:

```text
Toplam slayt
Görsel destek oranı
Öğrenci görevi oranı
Öğretmen notu oranı
İçeriği eksik slayt sayısı
```

## Yeni API endpointleri

```text
POST /api/admin/presentations/drafts/detail
POST /api/admin/presentations/drafts/save-preview
POST /api/admin/visuals/update-placement
GET  /api/admin/visuals/slide-visuals
```

## Yeni SQL migration

```text
supabase/migrations/010_slide_preview_visual_placement.sql
```

Bu migration görsel yerleşimi için şu alanları ekler:

```text
fit_mode
focal_x
focal_y
caption_override
placement_note
```

## Güvenlik

- Slayt önizleme editörü yalnızca admin panelindedir.
- Taslaklar ziyaretçiye görünmez.
- PPTX önizleme çıktısı admin export’tur.
- Yayınlama için ayrıca onay/yayın adımı gerekir.

## Sonraki aşama

`Co_LAB_v3.4_sunum_yayinlama_ve_ziyaretci_indirme`

Bu aşamada:
- onaylı PPTX dosyasını yayına alma,
- ziyaretçiye sunum indirme kartı gösterme,
- sunum sürüm geçmişi,
- public sunum kütüphanesi
eklenebilir.
