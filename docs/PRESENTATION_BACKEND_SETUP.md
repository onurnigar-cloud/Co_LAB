# Co_LAB v2.9 Sunum Üretici Backend Hazırlık Rehberi

## Amaç

Bu sürüm, AI destekli sunum üretimi için backend hazırlığını ekler.

Akış:

```text
source_chunks / manuel konu metni
↓
OpenAI yapılandırılmış çıktı
↓
kavram listesi
↓
kapsam kontrolü
↓
slayt iskeleti
↓
öğretmen notları
↓
öğrenci görevleri
↓
presentation_drafts
↓
admin onayı
↓
presentations tablosu
```

## Yeni SQL

v2.8 dosyalarından sonra şu migration çalıştırılır:

```text
supabase/migrations/008_presentation_drafts.sql
```

## Yeni API Endpointleri

```text
POST /api/admin/presentations/generate
GET  /api/admin/presentations/drafts
POST /api/admin/presentations/drafts/update
POST /api/admin/presentations/drafts/approve
```

## Güvenlik

- Sunum taslağı doğrudan ziyaretçiye açılmaz.
- AI çıktısı admin kontrolüne düşer.
- Eksik kavram varsa `missingConcepts` alanına yazılır.
- Kapsam kontrolü tamamlanmadan yayın yapılmamalıdır.
- Kaynak PDF ziyaretçiye gösterilmez.

## Bu sürümün sınırı

Bu sürüm PPTX dosyasını henüz üretmez.

Bu sürüm yalnızca şunları üretir:

- kavram kapsam listesi
- slayt planı
- slayt başlıkları
- öğretmen notları
- öğrenci görevleri
- görsel/harita/3D model ihtiyaçları
- admin kontrol taslağı

PPTX / Google Slides çıktısı sonraki sürümde bağlanmalıdır.

## Sonraki aşama

`Co_LAB_v3.0_pptx_google_slides_cikti`

Bu aşamada:
- sunum taslağından PPTX üretimi,
- tema/şablon sistemi,
- Google Slides aktarım hazırlığı,
- ziyaretçiye onaylı sunum indirme
eklenecektir.
