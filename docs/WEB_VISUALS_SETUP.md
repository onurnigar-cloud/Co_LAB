# Co_LAB v3.1 Web Görsel Arama ve Atıflı Sunum Hattı

## Amaç

Bu sürüm, sunumlarda kullanılabilecek uygun görsellerin web kaynaklarından bulunmasını sağlar. Görseller doğrudan otomatik kullanılmaz; admin kalite, konu uyumu ve lisans/atıf kontrolü yaptıktan sonra onaylar.

## Desteklenen kaynaklar

İlk aşamada üç kaynak hattı eklendi:

```text
Wikimedia Commons
NASA Images
Openverse
```

## Çalışma akışı

```text
Admin sunum taslağı üretir
↓
Slayt görsel promptları oluşur
↓
Admin web görsel arama panelinde arama yapar
↓
Sistem görsel adaylarını getirir
↓
Her aday için kaynak / lisans / üretici / atıf bilgisi gösterilir
↓
Admin uygun görseli seçer
↓
Görsel web_visual_assets tablosuna kaydedilir
↓
İstenirse sunum slaydına iliştirilir
```

## Güvenlik ve etik kullanım

Görsel kullanımında şu kurallar uygulanır:

- Görsel otomatik olarak slayta gömülmez.
- Önce admin onayı gerekir.
- Lisans bilgisi kontrol edilmeden yayın yapılmaz.
- Atıf metni kaydedilir.
- Kaynak URL korunur.
- Ziyaretçi admin görsel arama sürecini görmez.

## Yeni tablolar

```text
web_visual_assets
presentation_slide_visuals
```

## Yeni API endpointleri

```text
POST /api/admin/visuals/search
POST /api/admin/visuals/approve
POST /api/admin/visuals/attach-to-slide
```

## Yeni bileşen

```text
components/admin/visuals/WebVisualSearchPanel.tsx
```

## Görsel seçim kriterleri

Admin şunları kontrol etmelidir:

```text
1. Görsel konuya uygun mu?
2. Görsel kalitesi sunuma uygun mu?
3. Lisans bilgisi açık mı?
4. Atıf metni yeterli mi?
5. Görsel resmi-modern Co_LAB diline uyuyor mu?
6. Kaynak güvenilir mi?
```

## Sonraki aşama

v3.2 aşamasında:
- onaylı görselin PPTX içine gömülmesi,
- görseli slayt numarasına bağlama arayüzü,
- Google Slides export,
- görsel önizlemeli slayt düzenleyici
eklenebilir.
