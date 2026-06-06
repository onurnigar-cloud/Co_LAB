# Co_LAB Vercel Deployment Hazırlığı

Bu rehber Co_LAB projesini Vercel’e hazırlamak için kullanılır.

## 1. Yayına çıkmadan önce

Yerelde şu komutları çalıştırın:

```bash
npm install
npm run colab:check-files
npm run build
```

`npm run build` hatasız tamamlanmadan Vercel deployment yapılmamalıdır.

## 2. Vercel environment variables

Vercel Project Settings > Environment Variables bölümüne şu değerler girilmelidir:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
OPENAI_API_KEY
OPENAI_MODEL
SKETCHFAB_USERNAME
SKETCHFAB_PROFILE_URL
SKETCHFAB_API_TOKEN
```

## 3. Kritik güvenlik notu

Aşağıdaki değerler client tarafına sızmamalıdır:

```text
SUPABASE_SECRET_KEY
OPENAI_API_KEY
SKETCHFAB_API_TOKEN
```

Bu nedenle bu değişkenler `NEXT_PUBLIC_` ile başlamamalıdır.

## 4. Supabase Storage

Vercel deployment öncesinde Supabase Storage’da şu bucket’lar hazır olmalıdır:

```text
source-files
generated-tests
presentation-exports
```

## 5. Build komutu

Vercel tarafında varsayılan Next.js build yeterli olmalıdır:

```text
npm run build
```

## 6. İlk deployment sonrası test

Yayına çıktıktan sonra şu sıralamayla test edin:

```text
1. Ana sayfa açılıyor mu?
2. /admin erişimi korunuyor mu?
3. Admin dashboard açılıyor mu?
4. Test oluşturucu çalışıyor mu?
5. Sunum kütüphanesi listeleniyor mu?
6. PPTX indirme signed URL ile çalışıyor mu?
7. 3D tahta Sketchfab modeli açıyor mu?
```

## 7. Olası hata noktaları

### Supabase migration eksikse

Belirti:

```text
relation does not exist
function does not exist
view does not exist
```

Çözüm:

```text
MIGRATION_RUN_ORDER.md dosyasındaki sırayla migration dosyalarını çalıştırın.
```

### Storage bucket eksikse

Belirti:

```text
Bucket not found
storage upload failed
```

Çözüm:

```text
Supabase Storage’da gerekli bucket’ları oluşturun.
```

### Admin erişimi çalışmıyorsa

Belirti:

```text
Unauthorized
admin privilege required
```

Çözüm:

```text
profiles tablosunda kullanıcının admin rolünü kontrol edin.
```

### Sketchfab profil taraması çalışmıyorsa

Belirti:

```text
Profil toplu taraması sonuç vermedi
```

Çözüm:

```text
Tek model URL ekleme yöntemini kullanın.
Örnek:
https://sketchfab.com/3d-models/plato-95d05c602eab4dcba20b53481c17c70f
```

## 8. Yayın öncesi sürüm adı

Vercel’e ilk ciddi kurulum için önerilen paket:

```text
Co_LAB_v3.7_test_kurulum_ve_yayin_hazirlik
```
