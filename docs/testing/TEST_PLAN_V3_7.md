# Co_LAB v3.7 Test Planı

Bu test planı v3.7 sürümünün temel işlevlerini bozmadan yayına hazırlanması için kullanılır.

## 1. Kurulum testi

```text
npm install
npm run colab:check-files
npm run colab:env-template
npm run build
```

Beklenen sonuç:

```text
build hatasız tamamlanmalı
kritik dosyalar eksik görünmemeli
```

## 2. Admin panel testi

Kontrol edilecekler:

```text
/admin sayfası açılıyor mu?
Admin olmayan kullanıcı erişemiyor mu?
Admin dashboard görünüyor mu?
Supabase env eksikse uyarı veriyor mu?
```

## 3. PDF / kaynak işleme testi

Kontrol edilecekler:

```text
Admin kaynak yükleme ekranı açılıyor mu?
Drive/PDF source ID mantığı korunuyor mu?
source_chunks kayıtları oluşuyor mu?
```

## 4. AI soru havuzu testi

Kontrol edilecekler:

```text
Manuel metinden soru çıkarıyor mu?
Sorular question_extraction_drafts tablosuna düşüyor mu?
Admin soruyu düzenleyebiliyor mu?
Admin soruyu onaylayabiliyor mu?
Onaylı soru question_bank tablosuna geçiyor mu?
Ziyaretçi test oluşturucuda cevap anahtarı görünmüyor mu?
```

## 5. Test çıktı testi

Kontrol edilecekler:

```text
Ziyaretçi konu seçebiliyor mu?
Test oluşturuluyor mu?
Yazdır / PDF Al çalışıyor mu?
Öğrenci çıktısında cevap anahtarı görünmüyor mu?
```

## 6. AI sunum üretici testi

Kontrol edilecekler:

```text
Manuel metinden sunum taslağı oluşuyor mu?
Kapsam kontrolü geliyor mu?
Eksik kavram listesi geliyor mu?
Slaytlar düzenlenebiliyor mu?
PPTX indirilebiliyor mu?
```

## 7. Web görsel testi

Kontrol edilecekler:

```text
Wikimedia / NASA / Openverse araması çalışıyor mu?
Görsel kartlarında kaynak ve atıf görünüyor mu?
Uygun görsel kaydedilebiliyor mu?
Görsel slayta bağlanabiliyor mu?
PPTX export sırasında görsel slayta gömülüyor mu?
```

## 8. Sunum yayınlama testi

Kontrol edilecekler:

```text
Sunum taslak ID ile yayına alınabiliyor mu?
presentation_publications kaydı oluşuyor mu?
presentation-exports bucket içine PPTX yükleniyor mu?
Ziyaretçi sunum kütüphanesinde görünüyor mu?
PPTX indirilebiliyor mu?
İndirme sayısı artıyor mu?
```

## 9. Sketchfab model testi

Kontrol edilecekler:

```text
Profil modellerini içe alma deneniyor mu?
Tek model URL eklenebiliyor mu?
Model adı düzenlenebiliyor mu?
Model ready/public yapılabiliyor mu?
Model topic ID ile konuya bağlanabiliyor mu?
Ziyaretçi 3D ders tahtasında model açılıyor mu?
```

Örnek test model linki:

```text
https://sketchfab.com/3d-models/plato-95d05c602eab4dcba20b53481c17c70f
```

## 10. Güvenlik testi

Ziyaretçi tarafında görünmemesi gerekenler:

```text
OpenAI API key
Supabase secret key
storage file path
kaynak PDF doğrudan linki
admin taslakları
cevap anahtarı
AI raw çıktıları
admin kalite notları
```

## 11. Kabul kararı

Aşağıdaki üç alan hatasız çalışmadan yayına geçilmemelidir:

```text
Admin login / yetki kontrolü
Supabase migration + storage kurulumu
Ziyaretçi tarafında cevap/kaynak gizliliği
```
