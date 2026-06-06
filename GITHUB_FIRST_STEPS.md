# Co_LAB GitHub İlk Kurulum

## Durum

GitHub bağlantısı çalışıyor ancak `onurnigar-cloud` hesabında erişilebilir repo görünmüyor.

Bu yüzden önce GitHub üzerinde boş bir repo oluşturulmalı.

## 1. GitHub’da repo oluştur

GitHub hesabı:

```text
onurnigar-cloud
```

Önerilen repo adı:

```text
Co_LAB
```

Ayarlar:

```text
Visibility: Private
Initialize with README: kapalı
Add .gitignore: kapalı
License: kapalı
```

## 2. Bu paketin içeriğini repo’ya yükle

Bu zip dosyasını aç.

İçindeki dosyaları repo köküne gelecek şekilde yükle:

```text
package.json
app/
components/
lib/
supabase/
docs/
scripts/
.env.example
vercel.json
```

Dikkat:

```text
Co_LAB_v3.7.2_github_vercel_hazir klasörünün kendisini değil,
klasörün içindeki dosyaları repo köküne koy.
```

## 3. GitHub web arayüzünden yükleme

GitHub repo sayfasında:

```text
Add file
↓
Upload files
↓
Dosyaları sürükle
↓
Commit changes
```

## 4. Terminal alternatifi

Bilgisayarda terminal kullanacaksan:

```bash
git init
git add .
git commit -m "Initial Co_LAB deployment-ready version"
git branch -M main
git remote add origin https://github.com/onurnigar-cloud/Co_LAB.git
git push -u origin main
```

## 5. Sonraki adım

Repo oluştuktan sonra Vercel’de GitHub’dan import edilecek.
