# Co_LAB v3.7 Sketchfab Model ve 3D Tahta Yönetimi

## Amaç

Bu sürüm, 3D modellerin Co_LAB’a doğrudan Sketchfab üzerinden alınmasını sağlar.

Varsayılan model kaynağı:

```text
https://sketchfab.com/onurnigar/models
```

## Temel karar

Modelleri Co_LAB’a dosya olarak yüklemiyoruz. Sketchfab üzerinde herkese açık modeller embed olarak kullanılıyor.

Bu yöntem:

```text
daha hafif
daha hızlı
site depolamasını zorlamaz
model güncellemelerini Sketchfab üzerinden yönetilebilir kılar
```

## Yeni admin akışı

```text
Admin Paneli
↓
Sketchfab Model Kütüphanesi
↓
Profil modellerini içe al
↓
veya tek model URL ekle
↓
Model adını düzenle
↓
Eğitsel ad ver
↓
Açıklama yaz
↓
Durum: ready
↓
Görünürlük: public
↓
Topic ID ile konuya bağla
↓
Ziyaretçi 3D Ders Tahtasında model açılır
```

## Senin düzenleyeceğin alanlar

Modellerin Sketchfab’daki orijinal adları yerine Co_LAB içinde ders diline uygun adlar kullanılabilir:

```text
original_title  → Sketchfab’dan gelen ad
display_name    → sitede görünen ad
educational_name → ders içindeki eğitsel ad
description     → öğretmen/öğrenci açıklaması
```

Örnek:

```text
original_title: plato
display_name: Plato Modeli
educational_name: Plato
description: Akarsularla yarılmış yüksek düzlükleri gözlemlemek için kullanılır.
```

## Yeni tablolar

```text
sketchfab_model_library
topic_3d_model_links
```

## Yeni public view

```text
public_topic_3d_models
```

## Yeni API endpointleri

Admin:

```text
POST /api/admin/sketchfab/profile-models
POST /api/admin/sketchfab/import-model
GET  /api/admin/sketchfab/models
POST /api/admin/sketchfab/models/update
POST /api/admin/sketchfab/models/attach-topic
```

Ziyaretçi:

```text
GET /api/public/3d/models
```

## Sketchfab teknik notu

- Tek model ekleme Sketchfab oEmbed endpoint’iyle çalışır.
- Profil modellerini toplu alma için Sketchfab Data API denenir.
- Profil API erişimi kısıtlanırsa tek model URL ekleme yöntemi güvenli yedek olarak çalışır.
- Embed iframe, Sketchfab model viewer üzerinden açılır.

## Güvenlik

- Admin model kütüphanesi ziyaretçiye görünmez.
- Ziyaretçi yalnızca `ready + public` durumdaki modelleri görür.
- Kaynak profil yönetim süreci ziyaretçiye gösterilmez.
- Model dosyaları Co_LAB sunucusuna indirilmez.
- Embed üzerinden çalıştığı için model lisans/kullanım sorumluluğu Sketchfab yayınına bağlı kalır.

## Sonraki aşama

`Co_LAB_v3.8_streetview_harita_gorevleri`

Bu aşamada:
- Google Street View görevleri,
- koordinat/konum tabanlı gözlem kartları,
- harita görevleri,
- öğretmen yönergeleri,
- ziyaretçi harita/Street View paneli
eklenebilir.
