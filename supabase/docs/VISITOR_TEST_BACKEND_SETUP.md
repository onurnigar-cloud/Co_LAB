# Co_LAB v2.7 Ziyaretçi Test Üretici Backend Kurulum Rehberi

## Amaç

Bu sürüm, ziyaretçi test oluşturucuyu gerçek backend/Supabase soru havuzuna bağlar.

Akış:

```text
Ziyaretçi alan / konu / zorluk / soru sayısı seçer
↓
/api/public/test/generate
↓
Backend yalnızca onaylı soruları getirir
↓
Doğru cevap ve açıklama çıkarılır
↓
Co_LAB test şablonu oluşturulur
↓
Yazdır / PDF al
```

## Ek SQL

v2.6 dosyalarından sonra şu migration çalıştırılır:

```text
supabase/migrations/007_public_test_builder_views.sql
```

Bu dosya şunu ekler:

```text
public_question_topics
```

Bu view yalnızca şu bilgileri verir:

- alan
- konu
- onaylı soru sayısı

Cevap, kaynak PDF ve Drive bilgisi içermez.

## Public API

```text
GET /api/public/test/topics
POST /api/public/test/generate
```

`POST /api/public/test/generate` örnek body:

```json
{
  "area": "10. Sınıf",
  "topic": "Türkiye’de Yer Şekilleri",
  "difficulty": "Tümü",
  "questionType": "Tümü",
  "count": 10
}
```

## Public API Güvenliği

Dönen veri içinde şunlar yoktur:

- doğru cevap
- açıklama
- kaynak PDF
- Google Drive file ID
- admin notu
- AI raw çıktısı

## Ziyaretçi Arayüzü

Yeni bileşen:

```text
components/visitor/BackendTestBuilder.tsx
```

Bu bileşen konu listesini backend’den alır, test oluşturur ve A4 çıktıya uygun şablon sunar.

## Sonraki aşama

`Co_LAB_v2.8_pdf_cikti_sablonu`

Bu aşamada çıktı görünümü daha profesyonel hale getirilecek:
- okul tipi başlık alanı
- puan kutusu
- kazanım/kapsam bilgisi
- sayfa numarası
- çoktan seçmeli optik düzen alternatifi
