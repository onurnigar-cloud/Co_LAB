# Co_LAB v2.4 Google Drive / PDF Backend Kurulum Rehberi

## Amaç

Bu sürümde kaynak PDF bağlantıları ziyaretçiye verilmeden backend üzerinde işlenir.

Akış:

```text
Admin Drive linki girer
↓
Backend dosya ID değerini çözer
↓
Google Drive metadata okur
↓
PDF dosyasını backend indirir
↓
SHA-256 parmak izi üretir
↓
PDF metni çıkarılır
↓
Metin parçalara ayrılır
↓
sources ve source_chunks tablolarına admin-only kaydedilir
```

## Gerekli environment variables

`.env.local` içine şunları ekleyin:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

Paylaşıma açık dosyalar için isteğe bağlı:

```text
GOOGLE_API_KEY=
```

Önerilen güvenli yöntem OAuth refresh token kullanmaktır. Böylece Drive dosyaları herkese açık olmak zorunda kalmaz.

## Supabase SQL

v2.2 ve v2.3 SQL dosyalarından sonra bunu da çalıştırın:

```text
supabase/migrations/004_source_chunks_processing.sql
```

## Admin panel kullanımı

Admin panelinde:

```text
Kaynak PDF / Drive
↓
Kaynak başlığı yaz
↓
Google Drive linki veya dosya ID gir
↓
Metadata Önizle
↓
PDF’yi Backend’de İşle
```

## Ziyaretçi güvenliği

Bu sistemde ziyaretçiye şunlar gönderilmez:

- Google Drive linki
- Drive file ID
- kaynak PDF
- PDF chunk metinleri
- cevap anahtarı
- admin-only kaynak metadata

## Sonraki aşama

`Co_LAB_v2.5_ai_soru_havuzu`

Bu aşamada `source_chunks` içindeki metinler OpenAI API ile işlenerek soru havuzuna aktarılacaktır.
