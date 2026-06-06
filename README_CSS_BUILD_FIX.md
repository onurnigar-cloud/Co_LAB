# Co_LAB v3.7.9 CSS Build Fix

Bu paket, Vercel build sırasında kalan CSS import tip hatasını düzeltir.

## Hata

```text
Type error: Cannot find module or type declarations for side-effect import of './globals.css'.
```

## Düzeltmeler

- `typescript` sürümü `latest` yerine `5.5.4` olarak sabitlendi.
- `global.d.ts` dosyası CSS/SCSS/SASS modül tanımlarını içerir.
- `tsconfig.json` içine `global.d.ts` ve `**/*.d.ts` açıkça eklendi.
- `app/layout.tsx` içindeki global CSS importu için güvenli `@ts-ignore` eklendi.

## GitHub'a yükleme

Zip içindeki şu dosyaları repo ana dizinine yükle:

```text
package.json
tsconfig.json
global.d.ts
app/layout.tsx
```

Commit mesajı:

```text
Fix CSS type import for Vercel build
```

Sonra Vercel yeniden deploy etsin. Build cache seçeneği çıkarsa kapalı olsun.
