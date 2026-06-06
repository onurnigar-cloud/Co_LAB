# Co_LAB Admin Kabul Checklist

Bu checklist, sürümü ana sürüm olarak saklamadan veya yayına almadan önce kullanılmalıdır.

## A. Temel kurulum

- [ ] `.env.local` dosyası oluşturuldu.
- [ ] Supabase URL girildi.
- [ ] Supabase publishable key girildi.
- [ ] Supabase secret/service key girildi.
- [ ] OpenAI API key girildi.
- [ ] OpenAI model adı girildi.
- [ ] Sketchfab varsayılan kullanıcı adı `onurnigar` olarak ayarlandı.
- [ ] Gerekirse Sketchfab API token girildi.

## B. Supabase

- [ ] Migration dosyaları 001’den 014’e kadar sırasıyla çalıştırıldı.
- [ ] `source-files` bucket oluşturuldu.
- [ ] `generated-tests` bucket oluşturuldu.
- [ ] `presentation-exports` bucket oluşturuldu.
- [ ] Storage bucket’lar private olarak ayarlandı.
- [ ] Admin kullanıcının rolü tanımlandı.
- [ ] Public view’ler çalışıyor.

## C. Admin panel

- [ ] Admin dashboard açılıyor.
- [ ] İçerik kapsam puanı görünüyor.
- [ ] Soru havuzu paneli açılıyor.
- [ ] Sunum üretici paneli açılıyor.
- [ ] Web görsel arama paneli açılıyor.
- [ ] Slayt önizleme editörü açılıyor.
- [ ] Yayın kalite paneli açılıyor.
- [ ] Sketchfab model kütüphanesi açılıyor.

## D. Ziyaretçi tarafı

- [ ] Ana sayfa açılıyor.
- [ ] Sunum kütüphanesi görünüyor.
- [ ] Test oluşturucu çalışıyor.
- [ ] 3D Ders Tahtası görünüyor.
- [ ] Cevap anahtarı görünmüyor.
- [ ] Kaynak PDF linki görünmüyor.
- [ ] Admin panel linkleri/süreçleri görünmüyor.

## E. Sketchfab model kabulü

- [ ] Profil linki doğru: `https://sketchfab.com/onurnigar/models`
- [ ] En az bir model tek URL ile eklendi.
- [ ] Model adı düzenlendi.
- [ ] Eğitsel ad verildi.
- [ ] Model `ready` yapıldı.
- [ ] Model `public` yapıldı.
- [ ] Topic ID ile konuya bağlandı.
- [ ] Ziyaretçi 3D tahtasında model açıldı.

## F. Yayın kararı

- [ ] `npm run build` hatasız.
- [ ] Admin kabul checklist tamamlandı.
- [ ] Ziyaretçi gizlilik testi tamamlandı.
- [ ] En az bir test çıktısı alındı.
- [ ] En az bir sunum indirildi.
- [ ] En az bir 3D model açıldı.

## Ana sürüm önerisi

Bu checklist tamamlanırsa ana saklanacak sürüm:

```text
Co_LAB_v3.7_test_kurulum_ve_yayin_hazirlik
```
