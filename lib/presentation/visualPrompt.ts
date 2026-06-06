import { colabVisualStyle, getLayoutGuidance } from "@/lib/presentation/designSystem";

export function buildSlideVisualPrompt(input: {
  topicTitle: string;
  slideTitle: string;
  layout: string;
  coverageTags: string[];
  suggestedVisual?: string | null;
}) {
  const base = [
    "Co_LAB dijital coğrafya öğretim platformu için yüksek kaliteli slayt görseli",
    colabVisualStyle.visualTone,
    `Konu: ${input.topicTitle}`,
    `Slayt: ${input.slideTitle}`,
    `Düzen: ${getLayoutGuidance(input.layout)}`,
    `Görsel motif: ${colabVisualStyle.backgroundMotif}`,
    `İkon stili: ${colabVisualStyle.iconStyle}`,
    `Görsel işleme: ${colabVisualStyle.imageTreatment}`,
    "Renk paleti: lacivert, turkuaz, kum rengi, beyaz",
    "Ders kitabı ciddiyetinde; ama modern, karakteristik ve yenilikçi",
    "Metin çok az olsun; görsel öğretici, sade ve anlaşılır olsun"
  ];

  if (input.suggestedVisual) {
    base.push(`Önerilen görsel: ${input.suggestedVisual}`);
  }

  if (input.coverageTags?.length) {
    base.push(`Kapsam etiketleri: ${input.coverageTags.join(", ")}`);
  }

  return base.join(". ");
}

export function buildIconPrompt(concept: string) {
  return [
    "Tek çizgi modern eğitim ikonu",
    `Kavram: ${concept}`,
    "Coğrafya temalı",
    "lacivert çizgi, turkuaz vurgu",
    "şeffaf arka plan",
    "resmi ve sade"
  ].join(". ");
}
