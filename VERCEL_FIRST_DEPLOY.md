# Co_LAB Vercel İlk Deployment

## Vercel durumu

Bağlı Vercel team:

```text
onurnigar-5895's projects
team_tTlBx2ISCKarqX6v09SxVBAC
```

Mevcut proje listesi boş. Bu nedenle ilk proje GitHub import ile oluşturulacak.

## 1. Vercel’de import

Vercel Dashboard:

```text
Add New
↓
Project
↓
Import Git Repository
↓
Co_LAB
```

Framework:

```text
Next.js
```

Build command:

```text
npm run build
```

Install command:

```text
npm install
```

## 2. Environment Variables

Vercel Project Settings > Environment Variables bölümüne şu değerler girilecek:

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

Önerilen Sketchfab değerleri:

```text
SKETCHFAB_USERNAME=onurnigar
SKETCHFAB_PROFILE_URL=https://sketchfab.com/onurnigar/models
```

## 3. Gizli kalması gerekenler

Şunlar `NEXT_PUBLIC_` ile başlamamalı:

```text
SUPABASE_SECRET_KEY
OPENAI_API_KEY
SKETCHFAB_API_TOKEN
```

## 4. Supabase tamamlanmadan deployment eksik çalışır

Önce Supabase tarafında:

```text
001–014 migration
source-files bucket
generated-tests bucket
presentation-exports bucket
admin user role
```

tamamlanmalı.

## 5. Deployment sonrası test

```text
Ana sayfa açılıyor mu?
/admin korumalı mı?
Admin dashboard açılıyor mu?
3D Ders Tahtası görünüyor mu?
Sketchfab model iframe açılıyor mu?
Test oluşturucu cevap anahtarı göstermiyor mu?
Sunum indirme çalışıyor mu?
```
