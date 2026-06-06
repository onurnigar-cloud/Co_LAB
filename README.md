# Co_LAB v3.7.1 Test Kurulum ve Yayın Hazırlık

Bu sürüm, Co_LAB prototipini gerçek uygulama geliştirmeye uygun Next.js proje yapısına taşır.

## Bu sürümde olanlar

- Next.js App Router iskeleti
- Ziyaretçi ana sayfası
- Admin panel route'u
- Derslik bileşeni
- Sketchfab destekli 3D Tahta prototipi
- Soru havuzu tabanlı test oluşturucu
- AI Kütüphane / Arşiv admin mockup
- API endpoint taslakları
- JSON tabanlı geçici veri katmanı
- Environment variable örneği

## Henüz bağlanmayanlar

- OpenAI API
- Supabase
- Google Drive API
- Gerçek admin auth
- Gerçek PDF işleme
- PPTX üretimi

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcı:

```text
http://localhost:3000
http://localhost:3000/admin
```

## Sürüm Notu

Bu sürümden sonra önerilen sıra:

1. `Co_LAB_v2.2_supabase_baglanti`
2. `Co_LAB_v2.3_admin_auth`
3. `Co_LAB_v2.4_drive_pdf_backend`
4. `Co_LAB_v2.5_ai_soru_havuzu`

## Güvenlik Kararları

- Ziyaretçiye kaynak PDF linki verilmez.
- Cevap anahtarı public API çıktısında döndürülmez.
- AI işlemleri admin/backend tarafında çalışacak şekilde planlandı.
- OpenAI, Supabase service role ve Google anahtarları sadece backend environment variables içinde tutulmalıdır.


## v2.2 Güncellemesi

Bu sürümde Supabase bağlantı katmanı eklendi:

- `@supabase/supabase-js`
- `@supabase/ssr`
- browser/server/admin Supabase client dosyaları
- repository katmanı
- SQL şema dosyası
- RLS güvenlik politikaları
- seed veri dosyası
- public-safe `public_questions` view
- answer key güvenliği için admin-only tablo yapısı

## Eklenen önemli dosyalar

```text
lib/supabase/client.ts
lib/supabase/server.ts
lib/supabase/admin.ts
lib/repositories/topics.ts
lib/repositories/questions.ts
lib/repositories/archive.ts
supabase/migrations/001_colab_schema.sql
supabase/migrations/002_colab_rls_policies.sql
supabase/seed/001_seed_initial_data.sql
SUPABASE_SETUP.md
```

## Sonraki sürüm

`Co_LAB_v2.3_admin_auth`

Bu sürümde:
- admin girişi
- kullanıcı rolleri
- route koruması
- admin panel erişim güvenliği
eklenecek.


## v2.3 Güncellemesi — Admin Auth

Bu sürümde admin paneli için Supabase Auth tabanlı giriş ve route koruması eklendi.

Eklenenler:

- `/auth/login` admin giriş sayfası
- `/auth/logout` çıkış route’u
- `/unauthorized` yetkisiz erişim sayfası
- `/admin` route koruması
- `middleware.ts`
- `lib/auth/admin.ts`
- Supabase profile trigger SQL
- İlk admin rolü atama örneği

## Eklenen önemli dosyalar

```text
middleware.ts
app/auth/login/page.tsx
app/auth/logout/route.ts
app/unauthorized/page.tsx
components/auth/LoginForm.tsx
lib/auth/admin.ts
supabase/migrations/003_auth_profile_trigger.sql
supabase/seed/002_set_admin_role_example.sql
AUTH_SETUP.md
```

## Sonraki sürüm

`Co_LAB_v2.4_drive_pdf_backend`

Bu sürümde:
- Google Drive dosya ID okuma
- PDF backend işleme
- kaynak PDF’yi ziyaretçiden gizleme
- kaynak parmak izi oluşturma
eklenecek.


## v2.4 Güncellemesi — Google Drive / PDF Backend

Bu sürümde kaynak PDF işleme altyapısı eklendi.

Eklenenler:

- Google Drive file ID çözümleme
- Google Drive metadata okuma
- Backend üzerinden PDF indirme
- PDF SHA-256 parmak izi üretme
- PDF metin çıkarma
- Metni chunk/parça yapısına bölme
- `source_chunks` tablosu
- Admin panelinde Kaynak PDF / Drive işleme formu
- `/api/admin/sources/preview`
- `/api/admin/sources/process`

## Eklenen önemli dosyalar

```text
lib/google/drive.ts
lib/pdf/fingerprint.ts
lib/pdf/extract.ts
lib/security/adminApi.ts
lib/repositories/sources.ts
components/admin/sources/SourceProcessor.tsx
app/api/admin/sources/preview/route.ts
app/api/admin/sources/process/route.ts
supabase/migrations/004_source_chunks_processing.sql
DRIVE_PDF_BACKEND_SETUP.md
```

## Güvenlik kararı

Kaynak PDF ve Google Drive linki ziyaretçiye gönderilmez. Backend dosyayı işler, kaynak metadata ve metin parçaları admin-only tablolarında tutulur.

## Sonraki sürüm

`Co_LAB_v2.5_ai_soru_havuzu`

Bu sürümde:
- source_chunks içeriği OpenAI API’ye verilecek,
- sorular ayrıştırılacak,
- cevap anahtarı ayıklanacak,
- konu/zorluk/sınıf etiketleri üretilecek,
- admin onay ekranına düşecek.


## v2.5 Güncellemesi — AI Soru Havuzu

Bu sürümde OpenAI API ile backend tarafında çalışan soru çıkarma altyapısı eklendi.

Eklenenler:

- OpenAI backend client
- Yapılandırılmış JSON soru çıkarma şeması
- AI soru çıkarma prompt ve parser katmanı
- `/api/admin/questions/extract`
- `/api/admin/questions/approve`
- `question_extraction_drafts` tablosu
- `approve_question_draft` SQL fonksiyonu
- Admin panelinde AI Soru Çıkarma ekranı
- Doğru cevapların ziyaretçiden gizlenmesi

## Eklenen önemli dosyalar

```text
lib/openai/client.ts
lib/ai/questionExtractionSchema.ts
lib/ai/questionExtractor.ts
lib/repositories/questionExtraction.ts

components/admin/questions/QuestionExtractor.tsx

app/api/admin/questions/extract/route.ts
app/api/admin/questions/approve/route.ts

supabase/migrations/005_ai_question_extraction_drafts.sql

AI_QUESTION_BANK_SETUP.md
```

## Güvenlik kararı

AI'nin çıkardığı sorular doğrudan yayına alınmaz. Önce `question_extraction_drafts` tablosuna düşer. Admin onayından sonra `question_bank` tablosuna aktarılır. Ziyaretçi doğru cevapları görmez.

## Sonraki sürüm

`Co_LAB_v2.6_soru_onay_paneli`

Bu sürümde:
- çıkarılan taslak soruları listeleme,
- tek tek düzenleme,
- toplu onaylama,
- reddetme,
- konu/zorluk düzeltme
eklenecek.


## v2.6 Güncellemesi — Soru Onay Paneli

Bu sürümde AI tarafından çıkarılan soru taslakları için admin kontrol paneli eklendi.

Eklenenler:

- Taslak soruları listeleme
- Alan / konu filtresi
- Soru kökü düzenleme
- Seçenekleri düzenleme
- Doğru cevabı düzenleme
- Açıklama düzenleme
- Konu / sınıf / zorluk / soru tipi düzenleme
- Tekil taslak kaydetme
- Taslak reddetme
- Seçili taslakları toplu onaylama
- Onaylananları `question_bank` tablosuna aktarma

## Eklenen önemli dosyalar

```text
components/admin/questions/QuestionDraftReviewPanel.tsx

lib/repositories/questionDrafts.ts

app/api/admin/questions/drafts/route.ts
app/api/admin/questions/drafts/update/route.ts
app/api/admin/questions/drafts/reject/route.ts
app/api/admin/questions/drafts/bulk-approve/route.ts

supabase/migrations/006_question_draft_review_helpers.sql

QUESTION_REVIEW_SETUP.md
```

## Güvenlik kararı

Taslak sorular ziyaretçiye görünmez. Doğru cevaplar yalnızca admin panelinde kontrol edilir. Public test API, onaylanan soruları cevap anahtarı olmadan kullanır.

## Sonraki sürüm

`Co_LAB_v2.7_ziyaretci_test_uretici_backend`

Bu sürümde ziyaretçi test oluşturucu gerçek backend/Supabase soru havuzuna bağlanacak.


## v2.7 Güncellemesi — Ziyaretçi Test Üretici Backend

Bu sürümde ziyaretçi tarafındaki test oluşturucu backend/Supabase soru havuzuna bağlandı.

Eklenenler:

- `GET /api/public/test/topics`
- `POST /api/public/test/generate`
- `lib/repositories/publicTest.ts`
- `components/visitor/BackendTestBuilder.tsx`
- `public_question_topics` view
- A4 yazdırılabilir öğrenci test şablonu
- Kaynak PDF / Drive / cevap anahtarı gizleme garantisi

## Eklenen önemli dosyalar

```text
components/visitor/BackendTestBuilder.tsx
lib/repositories/publicTest.ts
app/api/public/test/topics/route.ts
app/api/public/test/generate/route.ts
supabase/migrations/007_public_test_builder_views.sql
VISITOR_TEST_BACKEND_SETUP.md
```

## Güvenlik kararı

Public API yalnızca onaylı soruları döndürür. Doğru cevap, açıklama, kaynak PDF ve Drive bilgisi public çıktıya dahil edilmez.

## Sonraki sürüm

`Co_LAB_v2.8_pdf_cikti_sablonu`

Bu sürümde test çıktısı daha profesyonel A4/PDF şablonuna dönüştürülecek.


## v2.8 Güncellemesi — PDF / A4 Çıktı Şablonu

Bu sürümde ziyaretçi test çıktısı profesyonel A4 öğrenci şablonuna dönüştürüldü.

Eklenenler:

- `PrintableTestSheet` bileşeni
- Co_LAB başlık alanı
- öğrenci adı-soyadı alanı
- sınıf / numara / tarih alanı
- puan kutusu
- kapsam ve yönerge kutuları
- soru numarası tasarımı
- açık uçlu cevap alanı
- iki sütunlu seçenek düzeni
- A4 yazdırma CSS kuralları
- cevap anahtarsız öğrenci sürümü uyarısı

## Eklenen önemli dosyalar

```text
components/visitor/print/PrintableTestSheet.tsx
lib/print/testTemplate.ts
PDF_PRINT_TEMPLATE_GUIDE.md
```

## Güvenlik kararı

Yazdırılan test öğrenci sürümüdür. Doğru cevap, açıklama, kaynak PDF, Drive file ID ve admin notları çıktıya dahil edilmez.

## Sonraki sürüm önerisi

`Co_LAB_v2.9_sunum_uretici_backend_hazirlik`

Bu sürümde AI sunum üretici için backend hazırlığı yapılabilir.


## v2.9 Güncellemesi — Sunum Üretici Backend Hazırlık

Bu sürümde AI destekli sunum üretici için backend hazırlığı eklendi.

Eklenenler:

- Sunum üretimi için OpenAI JSON Schema
- AI sunum taslağı üretici
- `presentation_drafts` tablosu
- kapsam kontrol listesi
- eksik kavram kontrolü
- slayt iskeleti
- öğretmen notları
- öğrenci görevleri
- harita / 3D model ihtiyacı işaretleme
- admin panelinde AI Sunum Taslağı Üretici ekranı

## Eklenen önemli dosyalar

```text
lib/ai/presentationSchema.ts
lib/ai/presentationGenerator.ts
lib/repositories/presentationDrafts.ts

components/admin/presentations/PresentationGeneratorPanel.tsx

app/api/admin/presentations/generate/route.ts
app/api/admin/presentations/drafts/route.ts
app/api/admin/presentations/drafts/update/route.ts
app/api/admin/presentations/drafts/approve/route.ts

supabase/migrations/008_presentation_drafts.sql

PRESENTATION_BACKEND_SETUP.md
```

## Güvenlik kararı

Sunum taslakları ziyaretçiye görünmez. AI çıktıları önce admin kontrolüne düşer. Eksik kavram varsa sunum doğrudan yayınlanmamalıdır.

## Sonraki sürüm

`Co_LAB_v3.0_pptx_google_slides_cikti`

Bu sürümde sunum taslağından gerçek PPTX / Google Slides çıktısı üretimi planlanacaktır.


## v3.0 Güncellemesi — Resmi Modern Sunum Tasarımı ve PPTX

Bu sürümde sunum üreticiye Co_LAB’a özgü resmi, modern ve karakteristik görsel dil eklendi.

Eklenenler:

- Co_LAB resmi-modern sunum teması
- renk paleti
- atlas/grid/topoğrafya görsel motifleri
- slayt düzen rehberleri
- slayt başına görsel prompt
- slayt başına ikon promptu
- slayt başına animasyon preset
- tasarım notu
- PPTX builder
- admin panelde “PPTX İndir” butonu
- `/api/admin/presentations/export-pptx`
- sunum assetleri

## Eklenen önemli dosyalar

```text
lib/presentation/designSystem.ts
lib/presentation/animationPlan.ts
lib/presentation/visualPrompt.ts
lib/presentation/pptxBuilder.ts
lib/repositories/presentationExport.ts

app/api/admin/presentations/export-pptx/route.ts

public/presentation-assets/colab-atlas-grid.svg
public/presentation-assets/colab-topography-light.svg

PRESENTATION_DESIGN_SYSTEM_GUIDE.md
```

## Tasarım karakteri

Sunumlar şu çizgide üretilecek:

```text
resmi
modern
karakteristik
coğrafi atlas estetiği
sade ama güçlü
harita / topoğrafya / grid destekli
öğretmen anlatımına uygun
öğrenci görevleriyle desteklenmiş
```

## Animasyon notu

Programatik PPTX üretiminde gelişmiş PowerPoint nesne animasyonları her ortamda güvenilir biçimde uygulanamaz. Bu sürümde animasyonlar `animationPreset` olarak planlanır ve slayt metadata’sına yansıtılır. Web/admin önizlemede bu presetler CSS animasyonlarıyla uygulanabilir. PPTX dosyasında ise modern düzen, görsel alanlar ve animasyon planı notları yer alır.

## Sonraki sürüm

`Co_LAB_v3.1_gorsel_uretme_ve_slides_preview`

Bu sürümde:
- görsel promptlardan gerçek görsel üretimi,
- slayt önizleme ekranı,
- harita/3D görsel yakalama alanı,
- Google Slides export hazırlığı
eklenebilir.


## v3.1 Güncellemesi — Web Görsel Arama ve Atıf

Bu sürümde sunumlar için web’den uygun görsel bulma hattı eklendi.

Eklenenler:

- Wikimedia Commons görsel arama
- NASA Images görsel arama
- Openverse görsel arama
- görsel aday kartları
- lisans / üretici / kaynak / atıf alanları
- admin onay sistemi
- web_visual_assets tablosu
- presentation_slide_visuals tablosu
- web görsel arama admin paneli

## Eklenen önemli dosyalar

```text
lib/webVisuals/types.ts
lib/webVisuals/wikimedia.ts
lib/webVisuals/nasa.ts
lib/webVisuals/openverse.ts
lib/webVisuals/search.ts

lib/repositories/webVisualAssets.ts

components/admin/visuals/WebVisualSearchPanel.tsx

app/api/admin/visuals/search/route.ts
app/api/admin/visuals/approve/route.ts
app/api/admin/visuals/attach-to-slide/route.ts

supabase/migrations/009_web_visual_assets.sql

WEB_VISUALS_SETUP.md
```

## Kullanım mantığı

Görseller doğrudan otomatik kullanılmaz. Admin önce görseli, kaynağı, lisansı ve atıf bilgisini kontrol eder. Uygun olan görsel kaydedilir ve slayta bağlanabilir.

## Sonraki sürüm

`Co_LAB_v3.2_gorseli_pptx_slaytina_gomme`

Bu sürümde onaylı görsellerin ilgili slayta gömülmesi ve PPTX çıktısında görünmesi tamamlanabilir.


## v3.2 Güncellemesi — Görseli PPTX Slaytına Gömme

Bu sürümde onaylı web görselleri ilgili sunum slaydına bağlanabilir ve PPTX export sırasında slayta gerçek görsel olarak gömülür.

Eklenenler:

- görsel indirme ve base64 data URI hazırlama
- `imageFetcher`
- PPTX görsel gömme
- slayt altına atıf dipnotu ekleme
- onaylı görselleri listeleme endpoint’i
- slayta bağlı görselleri okuma endpoint’i
- admin panelde “Onaylı Görseli Slayta Bağla” bölümü
- PPTX export sırasında `presentation_slide_visuals` kayıtlarını otomatik okuma

## Eklenen önemli dosyalar

```text
lib/presentation/imageFetcher.ts
components/admin/visuals/SlideVisualAttachPanel.tsx
app/api/admin/visuals/list-approved/route.ts
app/api/admin/visuals/slide-visuals/route.ts
PPTX_VISUAL_EMBED_GUIDE.md
```

## Güncellenen önemli dosyalar

```text
lib/presentation/pptxBuilder.ts
lib/repositories/presentationExport.ts
components/admin/presentations/PresentationGeneratorPanel.tsx
```

## Yeni kullanım

```text
AI Sunum Taslağı Üret
↓
Sunum taslak ID al
↓
Web görsel ara
↓
Uygun görseli kaydet
↓
Görseli slayta bağla
↓
PPTX indir
```

## Sonraki sürüm

`Co_LAB_v3.3_slides_preview_editor`

Bu sürümde slaytların admin panelde canlı önizlenmesi, görsel yerleşiminin kontrol edilmesi ve görsel kırpma/konumlandırma adımları geliştirilebilir.


## v3.3 Güncellemesi — Slayt Önizleme ve Kalite Kontrol Editörü

Bu sürümde admin paneline PPTX öncesi canlı slayt önizleme ve düzenleme ekranı eklendi.

Eklenenler:

- sunum taslağını ID ile yükleme
- slayt navigasyonu
- canlı slayt kartı önizleme
- bağlı web görselini önizlemede gösterme
- başlık/madde/görev/öğretmen notu/görsel prompt düzenleme
- animasyon preset değiştirme
- slayt sırası değiştirme
- slayt kopyalama
- slayt silme
- kalite kontrol göstergeleri
- düzenlemeleri kaydetme
- önizlenen sürümü PPTX indirme

## Eklenen önemli dosyalar

```text
components/admin/presentations/preview/SlidePreviewEditorPanel.tsx

app/api/admin/presentations/drafts/detail/route.ts
app/api/admin/presentations/drafts/save-preview/route.ts
app/api/admin/visuals/update-placement/route.ts

supabase/migrations/010_slide_preview_visual_placement.sql

SLIDES_PREVIEW_EDITOR_GUIDE.md
```

## Kullanım

```text
Admin Paneli
↓
AI Sunum Üretici
↓
Sunum taslak ID al
↓
Slayt Önizleme ve Kalite Kontrol Editörü
↓
Taslağı Yükle
↓
Düzenle
↓
Düzenlemeleri Kaydet
↓
Önizlenen Sürümü PPTX İndir
```

## Sonraki sürüm

`Co_LAB_v3.4_sunum_yayinlama_ve_ziyaretci_indirme`

Bu sürümde onaylı sunumların ziyaretçi tarafında indirilmesi ve sürüm yönetimi tamamlanabilir.


## v3.4 Güncellemesi — Sunum Yayınlama ve Ziyaretçi İndirme

Bu sürümde admin tarafından onaylanan sunumların PPTX olarak yayına alınması ve ziyaretçi tarafından indirilmesi eklendi.

Eklenenler:

- `presentation_publications` tablosu
- admin “Sunumu Yayına Al / Yayından Kaldır” paneli
- backend PPTX üretip Supabase Storage’a yükleme
- public sunum kütüphanesi
- public sunum listeleme endpoint’i
- geçici signed URL ile güvenli indirme
- yayından kaldırma endpoint’i

## Eklenen önemli dosyalar

```text
components/admin/presentations/publish/PresentationPublishPanel.tsx
components/visitor/presentations/PublicPresentationLibrary.tsx

lib/repositories/presentationPublish.ts

app/api/admin/presentations/publish/route.ts
app/api/admin/presentations/unpublish/route.ts
app/api/public/presentations/route.ts
app/api/public/presentations/download/route.ts

supabase/migrations/011_presentation_publications.sql

PRESENTATION_PUBLISHING_GUIDE.md
```

## Storage gereksinimi

Supabase Storage içinde şu bucket oluşturulmalıdır:

```text
presentation-exports
```

Öneri: private bucket. Public indirme endpoint’i geçici signed URL üretir.

## Güvenlik kararı

Ziyaretçi yalnızca yayınlanmış sunum metadata bilgisini ve geçici indirme bağlantısını görür. Kaynak PDF, storage path, admin taslak süreci ve AI üretim adımları görünmez.

## Sonraki sürüm

`Co_LAB_v3.5_surum_gecmisi_ve_yayin_kalite_paneli`

Bu sürümde yayın kalite paneli, sürüm geçmişi ve indirme istatistikleri geliştirilebilir.


## v3.5 Güncellemesi — Sürüm Geçmişi ve Yayın Kalite Paneli

Bu sürümde yayına alınmış sunumlar için kalite kontrol, görünürlük yönetimi ve indirme istatistikleri eklendi.

Eklenenler:

- yayın kalite puanı
- kalite checklist kayıtları
- indirme olayları
- indirme sayısı
- admin yayın yönetim tablosu
- public / hidden / archived durum yönetimi
- yayın analytics özeti
- ziyaretçi sunum kartlarında indirme sayısı

## Eklenen önemli dosyalar

```text
components/admin/presentations/quality/PublicationQualityPanel.tsx

lib/repositories/presentationAnalytics.ts

app/api/admin/presentations/publications/route.ts
app/api/admin/presentations/publications/update-status/route.ts
app/api/admin/presentations/analytics/route.ts

supabase/migrations/012_publication_quality_analytics.sql

PUBLICATION_QUALITY_GUIDE.md
```

## Güncellenen önemli dosyalar

```text
app/api/public/presentations/download/route.ts
components/visitor/presentations/PublicPresentationLibrary.tsx
lib/repositories/presentationPublish.ts
app/admin/page.tsx
```

## Güvenlik kararı

Ziyaretçi yalnızca yayındaki public sunumları ve toplam indirme sayısını görür. Admin kalite notları, ham indirme event kayıtları, storage path ve taslak süreçleri görünmez.

## Sonraki sürüm

`Co_LAB_v3.6_icerik_istatistikleri_ve_admin_ana_panel`

Bu sürümde admin ana paneli, içerik kapsam haritası ve eksik içerik uyarıları geliştirilebilir.


## v3.6 Güncellemesi — İçerik İstatistikleri ve Admin Ana Panel

Bu sürümde Co_LAB admin paneline genel içerik kapsamı, eksik içerik uyarıları ve üretim öncelik listesi eklendi.

Eklenenler:

- admin ana dashboard
- sınıf/alan bazlı içerik özeti
- konu bazlı kapsam puanı
- kritik eksik konu listesi
- kısmi tamamlanan konu listesi
- üretim önceliği önerileri
- test/sunum/etkinlik/3D model/harita görevi sayıları
- içerik kapsam SQL view’leri

## Eklenen önemli dosyalar

```text
components/admin/dashboard/AdminMainDashboardPanel.tsx

lib/repositories/contentDashboard.ts

app/api/admin/dashboard/content-stats/route.ts
app/api/admin/dashboard/production-priorities/route.ts

supabase/migrations/013_content_dashboard_stats.sql

ADMIN_MAIN_DASHBOARD_GUIDE.md
```

## Yeni SQL view’ler

```text
content_topic_coverage
content_area_summary
content_production_priorities
```

## Kapsam puanı

```text
soru havuzu: 25
yayın sunum: 25
etkinlik: 20
3D model: 15
harita/Street View görevi: 15
```

## Güvenlik kararı

İçerik eksikleri, üretim öncelikleri ve admin sağlık paneli yalnızca admin tarafında görünür. Ziyaretçi yalnızca yayınlanmış içerikleri görür.

## Sonraki sürüm

`Co_LAB_v3.7_3d_model_ve_streetview_yonetim_paneli`

Bu sürümde 3D tahta ve Google Street View/harita görevleri için yönetim paneli geliştirilebilir.


## v3.7 Güncellemesi — Sketchfab Model ve 3D Tahta Yönetimi

Bu sürümde 3D model hattı Sketchfab profilin üzerinden kuruldu.

Varsayılan kaynak:

```text
https://sketchfab.com/onurnigar/models
```

Eklenenler:

- Sketchfab profil modellerini içe alma denemesi
- tek Sketchfab model URL’si ekleme
- oEmbed metadata okuma
- model adlarını düzenleme
- eğitsel ad alanı
- model açıklaması
- ready/public yayın durumu
- topic ID ile modele konu bağlama
- ziyaretçi 3D ders tahtası
- konuya bağlı model seçimi
- birden fazla model varsa seçim ekranı

## Eklenen önemli dosyalar

```text
lib/sketchfab/types.ts
lib/sketchfab/url.ts
lib/sketchfab/oembed.ts
lib/sketchfab/profile.ts

lib/repositories/sketchfabModels.ts

components/admin/threeD/SketchfabModelManagerPanel.tsx
components/visitor/threeD/Topic3DBoard.tsx

app/api/admin/sketchfab/profile-models/route.ts
app/api/admin/sketchfab/import-model/route.ts
app/api/admin/sketchfab/models/route.ts
app/api/admin/sketchfab/models/update/route.ts
app/api/admin/sketchfab/models/attach-topic/route.ts
app/api/public/3d/models/route.ts

supabase/migrations/014_sketchfab_models_3d_board.sql

SKETCHFAB_3D_BOARD_GUIDE.md
```

## Yeni tablolar

```text
sketchfab_model_library
topic_3d_model_links
```

## Ziyaretçi tarafı

Ana sayfaya şu bölüm eklendi:

```text
3D Ders Tahtası
```

Konuya bağlı model varsa doğrudan açılır. Birden fazla model varsa seçim kartları görünür.

## Teknik dayanak

Sketchfab oEmbed endpoint’i model sayfası URL’sinden gömülebilir viewer HTML’i döndürür; Viewer API ise web uygulamalarında Sketchfab 3D viewer’ın JavaScript ile kontrol edilmesini sağlar. Co_LAB v3.7’de temel entegrasyon iframe/embed ile güvenli ve hafif tutuldu.

## Sonraki sürüm

`Co_LAB_v3.8_streetview_harita_gorevleri`

Bu sürümde Google Street View ve harita görevleri yönetimi geliştirilebilir.


## v3.7.1 Güncellemesi — Test / Kurulum / Yayın Hazırlık

Bu sürüm yeni büyük özellik eklemek yerine mevcut `v3.7` yapısını güvenli biçimde test ve yayına hazırlamak için oluşturuldu.

Eklenenler:

- migration çalışma sırası
- Supabase storage kontrol notları
- admin kabul checklist
- Vercel deployment hazırlığı
- hata teşhis rehberi
- dosya bütünlüğü kontrol script’i
- environment variable kontrol script’i
- v3.7 Sketchfab / 3D tahta test planı

## Eklenen önemli dosyalar

```text
docs/deployment/MIGRATION_RUN_ORDER.md
docs/deployment/VERCEL_DEPLOYMENT_PREP.md
docs/testing/TEST_PLAN_V3_7.md
docs/testing/TROUBLESHOOTING.md
docs/checklists/ADMIN_ACCEPTANCE_CHECKLIST.md

scripts/check-colab-files.mjs
scripts/print-env-checklist.mjs
```

## Yeni npm scriptleri

```bash
npm run colab:check-files
npm run colab:env-template
```

## Önerilen test sırası

```bash
npm install
npm run colab:check-files
npm run colab:env-template
npm run build
```

## Ana sürüm kararı

Bu sürüm kurulum ve yayın öncesi kontrol için ana güvenli sürüm olarak saklanabilir:

```text
Co_LAB_v3.7_test_kurulum_ve_yayin_hazirlik
```

## Street View notu

Google Street View / harita görevleri modülü bilinçli olarak bu sürüme alınmadı. Daha sonra ayrı bir tasarım aşaması olarak ele alınacak.
Deployment refresh: v3.7.3 lib fix
