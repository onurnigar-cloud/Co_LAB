# Co_LAB v2.3 Admin Auth Kurulum Rehberi

## 1. Supabase SQL dosyalarını çalıştır

v2.2 dosyalarından sonra şu dosyayı da çalıştırın:

```text
supabase/migrations/003_auth_profile_trigger.sql
```

## 2. Admin kullanıcısı oluştur

Supabase Dashboard üzerinden Auth > Users alanından admin kullanıcısı oluşturun.

Önerilen admin e-posta:

```text
onur.nigar@tfl.k12.tr
```

## 3. Admin rolü ver

Kullanıcı oluştuktan sonra SQL Editor’da şu komutu çalıştırın:

```sql
update public.profiles
set role = 'admin'
where email = 'onur.nigar@tfl.k12.tr';
```

Alternatif olarak:

```text
supabase/seed/002_set_admin_role_example.sql
```

dosyasındaki komutu çalıştırabilirsiniz.

## 4. .env.local değerleri

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

## 5. Test

```bash
npm install
npm run dev
```

Sonra:

```text
http://localhost:3000/auth/login
http://localhost:3000/admin
```

## Güvenlik Mantığı

- `/admin` route’u middleware ile korunur.
- Giriş yapılmamışsa `/auth/login` sayfasına yönlendirilir.
- Kullanıcı `admin` rolünde değilse `/unauthorized` sayfasına yönlendirilir.
- Çıkış için `/auth/logout` kullanılır.
