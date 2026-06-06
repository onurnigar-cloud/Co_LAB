# Co_LAB v2.2 Supabase Kurulum Rehberi

## 1. Supabase projesi oluştur

Supabase panelinden yeni bir proje oluştur.

## 2. Environment variables

`.env.example` dosyasını `.env.local` olarak kopyala.

```bash
cp .env.example .env.local
```

Sonra değerleri doldur:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

`SUPABASE_SECRET_KEY` yalnızca backend tarafında kullanılmalıdır. Tarayıcıya gönderilmemelidir.

## 3. SQL dosyalarını çalıştır

Supabase SQL Editor’da şu sırayla çalıştır:

```text
supabase/migrations/001_colab_schema.sql
supabase/migrations/002_colab_rls_policies.sql
supabase/seed/001_seed_initial_data.sql
```

## 4. Güvenlik kontrolü

- RLS açık olmalı.
- `question_bank` tablosu doğrudan public erişime açılmamalı.
- `answer_keys` yalnızca admin erişimli kalmalı.
- Public API cevap anahtarı döndürmemeli.
- Kaynak PDF / Drive linkleri ziyaretçiye verilmemeli.

## 5. Geliştirme

```bash
npm install
npm run dev
```

Adresler:

```text
http://localhost:3000
http://localhost:3000/admin
```

## 6. Bu sürümün sınırı

Bu sürüm Supabase bağlantı altyapısını ve SQL şemasını hazırlar. Gerçek admin auth ve kullanıcı rolü kontrolü `v2.3_admin_auth` sürümünde yapılacaktır.


## v2.4 Ek SQL

Drive/PDF backend işleme için şu dosyayı da çalıştırın:

```text
supabase/migrations/004_source_chunks_processing.sql
```

Bu dosya `source_chunks` tablosunu ve kaynak işleme metadata alanlarını ekler.


## v2.5 Ek SQL

AI soru çıkarma taslakları için şu migration dosyasını da çalıştırın:

```text
supabase/migrations/005_ai_question_extraction_drafts.sql
```


## v2.6 Ek SQL

Soru onay paneli için şu migration dosyasını da çalıştırın:

```text
supabase/migrations/006_question_draft_review_helpers.sql
```


## v2.7 Ek SQL

Ziyaretçi test oluşturucu konu listesi için şu migration dosyasını da çalıştırın:

```text
supabase/migrations/007_public_test_builder_views.sql
```


## v2.9 Ek SQL

AI sunum taslakları için şu migration dosyasını da çalıştırın:

```text
supabase/migrations/008_presentation_drafts.sql
```


## v3.1 Ek SQL

Web görsel arama ve atıf kayıtları için şu migration dosyasını çalıştırın:

```text
supabase/migrations/009_web_visual_assets.sql
```


## v3.3 Ek SQL

Slayt önizleme ve görsel yerleşim ayarları için şu migration dosyasını çalıştırın:

```text
supabase/migrations/010_slide_preview_visual_placement.sql
```


## v3.4 Ek SQL

Sunum yayınlama ve ziyaretçi indirme için şu migration dosyasını çalıştırın:

```text
supabase/migrations/011_presentation_publications.sql
```

## v3.4 Storage

Supabase Storage içinde şu bucket oluşturulmalıdır:

```text
presentation-exports
```

Öneri: private bucket. Ziyaretçi indirmesi signed URL ile yapılır.


## v3.5 Ek SQL

Yayın kalite paneli, sürüm yönetimi ve indirme istatistikleri için şu migration dosyasını çalıştırın:

```text
supabase/migrations/012_publication_quality_analytics.sql
```


## v3.6 Ek SQL

İçerik istatistikleri ve admin ana paneli için şu migration dosyasını çalıştırın:

```text
supabase/migrations/013_content_dashboard_stats.sql
```


## v3.7 Ek SQL

Sketchfab model kütüphanesi ve 3D ders tahtası için şu migration dosyasını çalıştırın:

```text
supabase/migrations/014_sketchfab_models_3d_board.sql
```


## v3.7.1 Test / Kurulum Notu

Bu sürümde migration dosyalarının uygulanma sırası ayrıca belgelendi:

```text
docs/deployment/MIGRATION_RUN_ORDER.md
supabase/docs/MIGRATION_RUN_ORDER.md
```

Supabase SQL dosyaları 001’den 014’e kadar sırayla çalıştırılmalıdır.
