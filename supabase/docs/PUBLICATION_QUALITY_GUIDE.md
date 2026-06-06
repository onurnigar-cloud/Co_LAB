# Co_LAB v3.5 Sürüm Geçmişi ve Yayın Kalite Paneli

## Amaç

Bu sürüm, yayına alınmış sunumları yalnızca listelemekle kalmaz; kalite kontrol, görünürlük yönetimi, indirme sayısı ve sürüm takibi mantığını da ekler.

## Yeni akış

```text
Sunum yayına alınır
↓
presentation_publications kaydı oluşur
↓
Yayın kalite panelinde görünür
↓
Admin kalite checklist doldurur
↓
Kalite puanı hesaplanır
↓
Yayın public / hidden / archived yapılabilir
↓
Ziyaretçi indirirse indirme olayı kaydedilir
↓
Admin indirme sayılarını görür
```

## Eklenen tablo ve alanlar

### presentation_publications tablosuna eklenen alanlar

```text
quality_status
quality_score
quality_note
last_quality_review_at
parent_publication_id
```

### Yeni tablolar

```text
presentation_quality_checks
presentation_download_events
```

### Yeni view’ler

```text
presentation_publication_stats
public_presentation_download_counts
```

## Yeni admin API endpointleri

```text
GET  /api/admin/presentations/publications
POST /api/admin/presentations/publications
POST /api/admin/presentations/publications/update-status
GET  /api/admin/presentations/analytics
```

## Güncellenen public indirme

```text
POST /api/public/presentations/download
```

Bu endpoint artık indirme bağlantısı üretirken indirme olayını da kaydeder.

## Kalite checklist maddeleri

```text
Kaynak metindeki temel kavramlar atlanmadı
Görseller konuya uygun ve kaliteli
Web görsellerinde lisans/atıf kontrol edildi
Öğretmen notları yeterli
Öğrenci görevleri/etkileşim alanları uygun
Resmi-modern Co_LAB tasarım dili korunuyor
PPTX indirme testi yapıldı
Kaynak PDF/admin/AI süreci ziyaretçiye görünmüyor
```

## Kalite puanı

Puanlama otomatik hesaplanır:

```text
işaretlenen madde / toplam madde × 100
```

Durum:

```text
90–100: approved
70–89: warning
0–69: failed
```

## Güvenlik

- Ziyaretçi ham indirme olaylarını göremez.
- Ziyaretçi storage path görmez.
- Ziyaretçi admin kalite notlarını görmez.
- Ziyaretçi yalnızca yayındaki public sunumu indirir.
- Hidden/archived içerikler public kütüphanede görünmez.

## Sonraki aşama

`Co_LAB_v3.6_icerik_istatistikleri_ve_admin_ana_panel`

Bu aşamada:
- sınıf/konu bazlı içerik sayıları,
- kaç test / kaç sunum / kaç 3D model var görünümü,
- admin ana dashboard,
- eksik içerik uyarıları,
- üretim öncelik listesi
eklenebilir.
