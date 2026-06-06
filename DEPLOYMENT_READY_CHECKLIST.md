# Co_LAB Deployment Ready Checklist

Bu paket GitHub + Vercel kurulumuna hazır sürümdür.

## Sürüm

```text
Co_LAB_v3.7.2_github_vercel_hazir
```

## İlk yapılacaklar

```text
1. GitHub’da Co_LAB isimli private repo oluştur.
2. Bu zip içeriğini repo köküne yükle.
3. Supabase projesi oluştur.
4. Migration dosyalarını 001–014 sırasıyla çalıştır.
5. Storage bucket’ları oluştur.
6. Vercel’de GitHub repo’yu import et.
7. Environment variables gir.
8. Deploy et.
9. Admin kabul checklist’i uygula.
```

## Komutlar

```bash
npm install
npm run colab:check-files
npm run colab:env-template
npm run build
```

## Ana rehber dosyaları

```text
GITHUB_FIRST_STEPS.md
VERCEL_FIRST_DEPLOY.md
docs/deployment/MIGRATION_RUN_ORDER.md
docs/deployment/VERCEL_DEPLOYMENT_PREP.md
docs/testing/TEST_PLAN_V3_7.md
docs/checklists/ADMIN_ACCEPTANCE_CHECKLIST.md
```
