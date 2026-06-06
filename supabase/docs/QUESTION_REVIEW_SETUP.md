# Co_LAB v2.6 Soru Onay Paneli Kurulum Rehberi

## Amaç

Bu sürüm, AI tarafından çıkarılan soru taslaklarını admin kontrolünden geçirmek için gerçek onay panelini ekler.

Akış:

```text
AI Soru Çıkarma
↓
question_extraction_drafts
↓
Soru Onay Paneli
↓
Düzenleme / Reddetme / Onaylama
↓
question_bank
↓
Ziyaretçi Test Oluşturucu
```

## Ek SQL

v2.5 dosyalarından sonra şu migration çalıştırılır:

```text
supabase/migrations/006_question_draft_review_helpers.sql
```

Bu dosya şunları ekler:

- `update_question_draft`
- `reject_question_draft`
- `bulk_approve_question_drafts`

## Admin Panel Kullanımı

```text
Admin Paneli
↓
AI Soru Havuzu
↓
AI Soru Çıkarma ile taslak oluştur
↓
Soru Onay Paneli
↓
Taslakları Yenile
↓
Soruyu düzenle
↓
Değişiklikleri Kaydet
↓
Onay için seç
↓
Seçilenleri Onayla
```

## Onay Öncesi Kontrol Edilecek Alanlar

- Soru kökü doğru mu?
- Seçenekler eksiksiz mi?
- Doğru cevap doğru mu?
- Konu etiketi doğru mu?
- Sınıf / TYT / AYT etiketi doğru mu?
- Zorluk seviyesi uygun mu?
- Soru tipi doğru mu?
- Cevap ziyaretçiye görünmüyor mu?

## Güvenlik

- Taslak sorular ziyaretçi tarafında görünmez.
- Doğru cevap alanı sadece admin panelinde görünür.
- Onaylanan sorular `question_bank` tablosuna aktarılır.
- Public test API doğru cevap döndürmez.
- Reddedilen taslaklar ziyaretçiye açılmaz.

## Sonraki aşama

`Co_LAB_v2.7_ziyaretci_test_uretici_backend`

Bu aşamada ziyaretçi test oluşturucu doğrudan Supabase `question_bank` üzerinden çalışacak; konu, zorluk ve soru sayısı seçimleri gerçek backend ile bağlanacak.
