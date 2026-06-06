# Co_LAB Hata Teşhis Rehberi

## 1. Build hatası

İlk kontrol:

```bash
npm run colab:check-files
npm run build
```

Eksik dosya varsa önce paket bütünlüğü kontrol edilmelidir.

## 2. Supabase bağlantı hatası

Belirtiler:

```text
Invalid API key
Project URL missing
relation does not exist
```

Kontrol:

```text
.env.local
Vercel Environment Variables
Migration sırası
```

## 3. Admin yetki hatası

Belirti:

```text
admin privilege required
```

Kontrol:

```text
profiles tablosunda ilgili kullanıcı admin mi?
Supabase auth user id doğru eşleşiyor mu?
```

## 4. OpenAI üretimi çalışmıyor

Belirtiler:

```text
OPENAI_API_KEY tanımlı değil
AI response JSON parse error
```

Kontrol:

```text
OPENAI_API_KEY backend env olarak tanımlı mı?
OPENAI_MODEL doğru mu?
Üretilecek metin çok kısa/boş mu?
```

## 5. PPTX export çalışmıyor

Belirtiler:

```text
pptxgenjs module error
storage upload failed
```

Kontrol:

```text
npm install çalıştı mı?
presentation-exports bucket var mı?
Supabase secret key doğru mu?
```

## 6. Web görsel gömülmüyor

Belirtiler:

```text
Görsel yerine placeholder görünüyor
```

Olası nedenler:

```text
Görsel URL erişilemiyor
CORS/remote image erişimi sınırlı
Görsel slayta bağlanmamış
```

Sistem bu durumda sunumu bozmaz; placeholder kullanır.

## 7. Sketchfab model görünmüyor

Kontrol:

```text
Model ready mi?
Visibility public mi?
Model topic ID ile bağlandı mı?
Public 3D API model döndürüyor mu?
Embed URL doğru mu?
```

## 8. Ziyaretçi cevap anahtarını görüyorsa

Bu kritik hatadır.

Kontrol:

```text
Public test API doğru cevap döndürüyor mu?
question_bank raw alanları public response’a sızıyor mu?
```

Çözüm:

```text
Public API yalnızca soru kökü/seçenek/zorluk/soru tipi döndürmelidir.
correct_answer ve explanation public çıktıda olmamalıdır.
```
