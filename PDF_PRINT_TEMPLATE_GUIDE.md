# Co_LAB v2.8 PDF / A4 Çıktı Şablonu

## Amaç

Bu sürümde ziyaretçi test oluşturucu, okulda doğrudan yazdırılabilecek / PDF alınabilecek profesyonel A4 öğrenci çıktısı üretir.

## Yeni çıktı yapısı

Test çıktısında şu alanlar bulunur:

- Co_LAB başlığı
- öğrenci adı-soyadı alanı
- sınıf / numara alanı
- tarih alanı
- süre alanı
- puan kutusu
- konu / kapsam bilgisi
- yönerge kutusu
- soru numarası
- soru kökü
- seçenekler
- açık uçlu cevap alanı
- öğrenci sürümü uyarısı

## Güvenlik

Çıktıda şunlar yoktur:

- cevap anahtarı
- doğru cevap
- açıklama
- kaynak PDF linki
- Google Drive file ID
- admin notu
- AI raw çıktısı

## Yeni bileşenler

```text
components/visitor/print/PrintableTestSheet.tsx
lib/print/testTemplate.ts
```

## Kullanım

Ziyaretçi:

```text
Alan / Sınıf seçer
Konu seçer
Soru sayısı seçer
Zorluk seçer
Testi Oluştur der
Yazdır / PDF Al der
```

Tarayıcı yazdırma ekranında hedef olarak:

```text
PDF olarak kaydet
```

seçilebilir.

## Sonraki aşama

`Co_LAB_v2.9_sunum_uretici_backend_hazirlik`

Bu aşamada AI sunum üretici backend mantığına geçilebilir.
