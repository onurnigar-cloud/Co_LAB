# Co_LAB v3.6 İçerik İstatistikleri ve Admin Ana Panel

## Amaç

Bu sürüm, Co_LAB admin paneline genel sağlık göstergesi ve içerik kapsam haritası ekler.

Admin artık şu soruların cevabını tek ekranda görebilir:

```text
Hangi sınıfta kaç konu var?
Hangi konuda kaç soru var?
Hangi konuda sunum eksik?
Hangi konuda etkinlik eksik?
Hangi konuda 3D model yok?
Hangi konuda harita / Street View görevi yok?
Önce hangi içeriği üretmeliyim?
```

## Yeni dashboard akışı

```text
topics
↓
question_bank
↓
presentation_publications
↓
activities
↓
three_d_models
↓
map_tasks
↓
content_topic_coverage
↓
content_area_summary
↓
content_production_priorities
↓
Admin Ana Panel
```

## Yeni SQL view’ler

```text
content_topic_coverage
content_area_summary
content_production_priorities
```

## Kapsam puanı

Kapsam puanı 100 üzerinden hesaplanır:

```text
soru havuzu: 25 puan
yayın sunum: 25 puan
etkinlik: 20 puan
3D model: 15 puan
harita / Street View görevi: 15 puan
```

## Kapsam durumları

```text
complete
partial
critical_missing
```

## Üretim önceliği önerileri

Sistem şu tür öneriler üretir:

```text
Öncelik 1: Sunum üret
Öncelik 2: Test/soru havuzu güçlendir
Öncelik 3: Etkinlik üret
Öncelik 4: 3D model bağla
Öncelik 5: Harita/Street View görevi ekle
Kapsam yeterli
```

## Yeni API endpointleri

```text
GET /api/admin/dashboard/content-stats
GET /api/admin/dashboard/production-priorities
```

## Yeni admin bileşeni

```text
components/admin/dashboard/AdminMainDashboardPanel.tsx
```

## Güvenlik

- İçerik kapsam istatistikleri admin paneli içindir.
- Public kullanıcıya üretim eksikleri ve admin planlaması gösterilmez.
- Ziyaretçi yalnızca yayınlanmış içerikleri görür.

## Sonraki aşama

`Co_LAB_v3.7_3d_model_ve_streetview_yonetim_paneli`

Bu aşamada:
- Sketchfab model yönetimi,
- konuya bağlı 3D model atama,
- Google Street View görevleri,
- harita/konum gözlem görevleri,
- ziyaretçi 3D tahta deneyimi
geliştirilebilir.
