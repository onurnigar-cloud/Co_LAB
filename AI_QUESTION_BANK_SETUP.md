# Co_LAB v2.5 AI Soru Havuzu Kurulum Rehberi

## Amaç

Bu sürüm, backend tarafında çalışan OpenAI API ile PDF metinlerinden soru çıkarma altyapısını ekler.

Akış:

```text
source_chunks / manuel metin
↓
OpenAI Responses API
↓
yapılandırılmış JSON soru çıkarımı
↓
question_extraction_drafts
↓
admin kontrolü
↓
question_bank
↓
ziyaretçi test oluşturucu
```

## Gerekli environment variables

`.env.local` içine:

```text
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
```

OpenAI anahtarı yalnızca backend tarafında kullanılmalıdır. Tarayıcıya gönderilmez.

## Supabase SQL

v2.4 dosyalarından sonra şu migration çalıştırılır:

```text
supabase/migrations/005_ai_question_extraction_drafts.sql
```

## Admin panel kullanımı

```text
Admin Paneli
↓
Soru Havuzu
↓
AI Soru Çıkarma
↓
Source ID veya manuel metin
↓
Soruları Çıkar
↓
Admin kontrol
↓
Onay
```

## Güvenlik

- Doğru cevaplar admin alanında tutulur.
- Ziyaretçi public API çıktısında doğru cevap alanı dönmez.
- Kaynak PDF ziyaretçiye verilmez.
- AI çıktısı doğrudan yayına alınmaz.
- Taslak sorular önce admin kontrolüne düşer.

## Sürüm sınırı

Bu sürüm soru çıkarma ve taslak kayıt altyapısını hazırlar. Gelişmiş toplu onay arayüzü ve tam PDF sayfa aralığı yönetimi sonraki sürümlerde geliştirilecektir.
