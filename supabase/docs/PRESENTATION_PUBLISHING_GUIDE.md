# Co_LAB v3.4 Sunum Yayınlama ve Ziyaretçi İndirme

## Amaç

Bu sürüm, admin tarafından kalite kontrolü tamamlanan sunumun PPTX olarak üretilmesini, Supabase Storage alanına yüklenmesini ve ziyaretçi kütüphanesinde indirmeye açılmasını sağlar.

## Yeni akış

```text
AI Sunum Taslağı Üret
↓
Slayt Önizleme Editörü
↓
Görsel / içerik / kalite kontrol
↓
Sunumu Yayına Al
↓
PPTX backend tarafından üretilir
↓
Supabase Storage'a yüklenir
↓
presentation_publications kaydı oluşur
↓
Ziyaretçi Sunum Kütüphanesi’nde görür
↓
PPTX indirir
```

## Eklenen tablo

```text
presentation_publications
```

Bu tablo şunları saklar:

```text
presentation_draft_id
title
area
topic_title
description
slide_count
version
file_bucket
file_path
file_size_bytes
visibility
publication_status
published_at
```

## Supabase Storage kurulumu

Supabase Dashboard > Storage bölümünde şu bucket oluşturulmalıdır:

```text
presentation-exports
```

Önerilen ayar:

```text
private bucket
```

Çünkü ziyaretçi doğrudan storage path görmemeli. Public indirme endpoint’i kısa süreli signed URL üretir.

## Yeni API endpointleri

Admin:

```text
POST /api/admin/presentations/publish
POST /api/admin/presentations/unpublish
```

Ziyaretçi:

```text
GET  /api/public/presentations
POST /api/public/presentations/download
```

## Güvenlik

- Ziyaretçi kaynak PDF’ye erişmez.
- Ziyaretçi storage file path görmez.
- Ziyaretçi admin taslak sürecini görmez.
- İndirme bağlantısı geçici signed URL ile oluşturulur.
- Yayından kaldırılan sunum public listede görünmez.

## Admin kullanımı

```text
Admin Paneli
↓
AI Sunum Üretici
↓
Sunum Taslak ID
↓
Sunumu Yayına Al / Yayından Kaldır
↓
Taslak ID gir
↓
Açıklama ve sürüm yaz
↓
Yayına Al
```

## Ziyaretçi kullanımı

```text
Ana sayfa
↓
Sunumlar
↓
Sunum Kütüphanesi
↓
PPTX İndir
```

## Sonraki aşama

`Co_LAB_v3.5_surum_gecmisi_ve_yayin_kalite_paneli`

Bu aşamada:
- sunum sürüm geçmişi,
- yayın kalite kontrol listesi,
- public/hidden toggles,
- analytics/indirme sayısı,
- hangi sınıf/konu için kaç içerik var görünümü
eklenebilir.
