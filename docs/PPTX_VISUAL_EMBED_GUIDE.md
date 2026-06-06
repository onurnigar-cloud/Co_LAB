# Co_LAB v3.2 Görseli PPTX Slaytına Gömme

## Amaç

Bu sürüm, admin tarafından onaylanan web görsellerini ilgili sunum slaydına bağlar ve PPTX export sırasında görseli gerçekten slayta gömer.

## Yeni akış

```text
AI Sunum Taslağı Üret
↓
presentation_drafts kaydı oluşur
↓
Admin web görsel arar
↓
Uygun görseli kaydeder
↓
Admin görseli slayt numarasına bağlar
↓
PPTX İndir
↓
PPTX builder ilgili görseli indirir
↓
Görsel slayta gömülür
↓
Atıf metni küçük dipnot olarak slayta yazılır
```

## Eklenenler

```text
lib/presentation/imageFetcher.ts
components/admin/visuals/SlideVisualAttachPanel.tsx
app/api/admin/visuals/list-approved/route.ts
app/api/admin/visuals/slide-visuals/route.ts
```

## Güncellenenler

```text
lib/presentation/pptxBuilder.ts
lib/repositories/presentationExport.ts
components/admin/presentations/PresentationGeneratorPanel.tsx
```

## Görsel gömme mantığı

PPTX export sırasında:

```text
presentation_draft_id
↓
presentation_slide_visuals tablosu okunur
↓
web_visual_assets kaydı bulunur
↓
image_url backend tarafından indirilir
↓
base64 data URI yapılır
↓
slayt görsel alanına gömülür
↓
atıf metni slayt altına eklenir
```

## Görsel yoksa ne olur?

İlgili slayta görsel bağlanmamışsa sistem Co_LAB placeholder alanını kullanır:

```text
GÖRSEL ALANI
Harita / şema / 3D görsel önerisi
```

## Atıf

Her gömülü görselde küçük dipnot olarak atıf metni yer alır:

```text
başlık — üretici — kaynak — lisans — kaynak URL
```

## Güvenlik

- Görsel yalnızca admin onayından sonra slayta bağlanır.
- Ziyaretçi web görsel arama sürecini görmez.
- Kaynak, lisans ve atıf bilgisi saklanır.
- Lisans kontrolü admin sorumluluğunda kalır.
- Görsel bulunamaz/indirilemezse sunum bozulmaz; placeholder kullanılır.

## Kullanım

1. Admin panelde AI Sunum Taslağı Üret.
2. Ekranda görünen `Sunum taslak ID` değerini kopyala.
3. Web Görsel Arama panelinden uygun görsel bul.
4. Görseli `Uygun Görsel Olarak Kaydet`.
5. Onaylı Görseli Slayta Bağla panelinde:
   - Sunum taslak ID gir
   - Slayt numarası gir
   - Onaylı görsel seç
   - Slayta Bağla
6. Sunum üretici bölümünden `PPTX İndir`.

## Sonraki aşama

`Co_LAB_v3.3_slides_preview_editor`

Bu aşamada:
- slayt önizleme ekranı,
- görselin slaytta nasıl duracağını canlı görme,
- görsel kırpma / konum seçimi,
- Google Slides export hazırlığı
eklenebilir.
