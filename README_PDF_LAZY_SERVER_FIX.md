# Co_LAB v3.7.15 PDF Lazy Server Fix

Bu paket, Vercel build sırasında çıkan şu hatayı düzeltir:

```text
ENOENT: no such file or directory, open './test/data/05-versions-space.pdf'
Failed to collect page data for /api/admin/sources/process
```

## Sebep

`pdf-parse` paketi Next/Vercel build sırasında kendi test PDF dosyasını okumaya çalışabiliyor. Bu dosya Vercel ortamında olmadığı için build kırılıyor.

## Düzeltme

- `lib/pdf/extract.ts` içinde `pdf-parse` artık dosya başında import edilmiyor.
- `pdf-parse/lib/pdf-parse.js` sadece PDF işleme fonksiyonu çalıştığında lazy `require` ile çağrılıyor.
- `app/api/admin/sources/process/route.ts` içine şu ayarlar eklendi:

```ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
```

## GitHub'a yükleme

Zip içindeki şu iki dosyayı mevcut konumlarına yükle:

```text
lib/pdf/extract.ts
app/api/admin/sources/process/route.ts
```

Commit mesajı:

```text
Fix pdf parse build-time file access
```

Vercel otomatik deploy başlatmazsa Redeploy yap.
Build cache seçeneği çıkarsa kapalı olsun.
