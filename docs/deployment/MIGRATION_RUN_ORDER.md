# Co_LAB Migration Sırası ve Kurulum Kontrolü

Bu dosya Supabase SQL migration dosyalarının hangi sırayla çalıştırılacağını gösterir.

## Migration sırası

Supabase SQL Editor içinde aşağıdaki dosyaları **sırasıyla** çalıştırın:

```text
001_initial_schema.sql
002_admin_security.sql
003_source_processing.sql
004_storage_and_public_views.sql
005_ai_question_extraction_drafts.sql
006_question_draft_review_helpers.sql
007_public_test_builder_views.sql
008_presentation_drafts.sql
009_web_visual_assets.sql
010_slide_preview_visual_placement.sql
011_presentation_publications.sql
012_publication_quality_analytics.sql
013_content_dashboard_stats.sql
014_sketchfab_models_3d_board.sql
```

## Kritik not

Migration dosyaları birbirine bağlıdır. Özellikle:

```text
002_admin_security.sql
```

çalışmadan admin korumalı fonksiyonlar sağlıklı çalışmaz.

```text
008_presentation_drafts.sql
```

çalışmadan sunum üretici taslak kaydı oluşturamaz.

```text
011_presentation_publications.sql
```

çalışmadan sunum yayına alma çalışmaz.

```text
014_sketchfab_models_3d_board.sql
```

çalışmadan Sketchfab model kütüphanesi ve 3D tahta çalışmaz.

## Storage bucket kontrolü

Supabase Storage içinde şu bucket’lar oluşturulmalıdır:

```text
source-files
generated-tests
presentation-exports
```

Öneri:

```text
source-files: private
generated-tests: private
presentation-exports: private
```

Public erişim doğrudan storage path ile değil, backend endpoint ve signed URL mantığıyla yönetilmelidir.

## Kurulumdan sonra kontrol

Terminalde proje kökünde:

```bash
npm run colab:check-files
npm run colab:env-template
npm run build
```

## Admin hesabı

Admin erişimi için `profiles` tablosunda ilgili kullanıcıya admin rolü atanmalıdır.

Örnek mantık:

```text
profiles.role = 'admin'
```

Bu alanın tam adı mevcut schema dosyasındaki yapıya göre kontrol edilmelidir.
