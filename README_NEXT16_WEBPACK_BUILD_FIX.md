# Co_LAB v3.7.17 Next 16 Webpack Build Fix

Bu paket, Vercel build sırasında çıkan şu hatayı düzeltir:

```text
ERROR: This build is using Turbopack, with a `webpack` config and no `turbopack` config.
```

## Sebep

Next.js 16'da production build varsayılan olarak Turbopack kullanmaya çalışıyor. Projede `next.config.mjs` içinde `webpack` ayarı bulunduğu için Next build duruyor.

## Düzeltme

`package.json` içinde build komutu açıkça Webpack'e alındı:

```json
"build": "next build --webpack"
```

Bu sayede Next 16 güvenlik kontrolü korunur, ama mevcut webpack config ile çakışan Turbopack devreye girmez.

## GitHub'a yükleme

Zip içindeki şu dosyaları repo ana dizinine yükle:

```text
package.json
vercel.json
next.config.mjs
```

Commit mesajı:

```text
Force webpack build for Next 16
```

Vercel otomatik build başlatmazsa Redeploy yap.
Build cache seçeneği çıkarsa kapalı olsun.
