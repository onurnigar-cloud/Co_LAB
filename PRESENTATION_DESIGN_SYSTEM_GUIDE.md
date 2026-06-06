# Co_LAB v3.0 Resmi Modern Sunum Tasarım Sistemi

## Amaç

Bu sürüm, AI sunum üreticiyi yalnızca metin/slayt iskeleti üreten bir sistem olmaktan çıkarır; görsel, animasyon ve kurumsal tasarım dili olan kaliteli bir sunum üretim hattına dönüştürür.

## Tasarım karakteri

Co_LAB sunum dili şu özellikleri taşımalıdır:

- resmi
- modern
- karakteristik
- coğrafya/atlas estetiğine sahip
- ders kitabı ciddiyetinde
- görsel destekli
- sade ama güçlü
- harita, grid, izohips, koordinat, 3D model ve gözlem görevleriyle desteklenmiş

## Renk paleti

```text
Derin lacivert: #071827
Atlas mavisi:   #0B3A53
Turkuaz vurgu:  #35D6C8
Kum rengi:      #E8C072
Sis beyazı:     #EAF6F7
```

## Slayt başına eklenen yeni alanlar

Her slayt artık şu metadata alanlarını taşıyabilir:

```text
visualPrompt
iconPrompt
animationPreset
designNote
```

## Animasyon presetleri

```text
softFadeSequence
mapReveal
processFlow
comparisonWipe
conceptZoom
activityFocus
noAnimation
```

## Önemli not

Programatik PPTX üretiminde gelişmiş PowerPoint nesne animasyonları her ortamda güvenilir biçimde yazılamaz. Bu nedenle sistem iki katmanlı çalışır:

1. Web/admin önizlemede animasyon presetleri CSS/arayüz animasyonu olarak uygulanabilir.
2. PPTX çıktısına animasyon planı ve slayt düzeni metadata olarak yerleştirilir.

## PPTX üretimi

Yeni endpoint:

```text
POST /api/admin/presentations/export-pptx
```

Bu endpoint admin tarafından üretilmiş sunum taslağını Co_LAB temalı PPTX dosyasına çevirir.

## Yeni dosyalar

```text
lib/presentation/designSystem.ts
lib/presentation/animationPlan.ts
lib/presentation/visualPrompt.ts
lib/presentation/pptxBuilder.ts
lib/repositories/presentationExport.ts
app/api/admin/presentations/export-pptx/route.ts
public/presentation-assets/colab-atlas-grid.svg
public/presentation-assets/colab-topography-light.svg
```

## Sonraki aşama

v3.1 aşamasında:
- görsellerin gerçekten üretilip slaytlara gömülmesi,
- harita/screenshot/Sketchfab görsel yakalama,
- Google Slides export,
- slayt önizleme ekranı
eklenebilir.
