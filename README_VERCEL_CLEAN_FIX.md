# Co_LAB v3.7.5 Vercel Clean Fix

Bu paket, Vercel build sırasında devam eden `Module not found: Can't resolve '@/lib/...'` hataları için temiz kök ayar dosyalarını içerir.

## İçerik

- package.json
- next.config.mjs
- tsconfig.json
- vercel.json

## GitHub'a yükleme

1. Zip'i indirip aç.
2. GitHub'da `onurnigar-cloud / Co_LAB` repo ana dizinine gir.
3. `Add file` > `Upload files` seç.
4. Bu klasörün içindeki şu 4 dosyayı repo ana dizinine sürükle:

```text
package.json
next.config.mjs
tsconfig.json
vercel.json
```

5. GitHub aynı adlı dosyaları güncelleyecek.
6. Commit mesajı:

```text
Apply Vercel clean build fix
```

7. Vercel otomatik yeni deployment başlatmazsa `Redeploy` yap.
8. Redeploy ekranında seçenek çıkarsa `Use existing Build Cache` kapalı olsun.

## Kontrol

Yeni build logunda şu satır görünmeli:

```text
Detected Next.js version: 15.4.6
```

Şu eski satır görünürse eski build'e bakıyorsun:

```text
Detected Next.js version: 16.2.7
```
