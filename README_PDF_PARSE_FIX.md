# Co_LAB v3.7.10 PDF Parse Fix

Bu paket, Vercel build sırasında çıkan şu hatayı düzeltir:

```text
Type error: Property 'default' does not exist on type typeof import("pdf-parse/...")
const pdfParse = (await import("pdf-parse")).default;
```

## Sebep

`pdf-parse` paketi `latest` olarak kurulduğunda yeni API/tip yapısı mevcut kodla uyumsuz olabiliyor.

## Düzeltmeler

- `pdf-parse` sürümü `1.1.1` olarak sabitlendi.
- `@types/pdf-parse` sürümü `1.1.5` olarak sabitlendi.
- `lib/pdf/extract.ts` içinde dinamik `.default` import kaldırıldı.
- PDF parse importu klasik default import biçimine alındı:

```ts
import pdfParse from "pdf-parse";
```

## GitHub'a yükleme

Zip içindeki şu dosyaları repo ana dizinine yükle:

```text
package.json
lib/pdf/extract.ts
```

Commit mesajı:

```text
Fix pdf parse import for Vercel build
```

Sonra Vercel otomatik deploy başlatmazsa Redeploy yap.
Build cache seçeneği çıkarsa kapalı olsun.
