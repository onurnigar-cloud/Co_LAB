export const colabPresentationTheme = {
  name: "Co_LAB Resmi Modern Sunum Teması",
  ratio: "LAYOUT_WIDE",
  colors: {
    deepNavy: "071827",
    atlasBlue: "0B3A53",
    turquoise: "35D6C8",
    mist: "EAF6F7",
    sand: "E8C072",
    ink: "10212E",
    slate: "536977",
    white: "FFFFFF",
    warning: "B85C38",
    success: "0F7A5B"
  },
  fonts: {
    heading: "Aptos Display",
    body: "Aptos",
    fallback: "Arial"
  },
  styleRules: [
    "Resmi ve kurumsal görünüm korunur.",
    "Slaytlar metin yığınına dönüşmez; her slayt tek ana fikir taşır.",
    "Coğrafi kavramlar harita, şema, süreç diyagramı veya gözlem göreviyle desteklenir.",
    "Renkler sınırlı ve tutarlıdır: lacivert, turkuaz, kum rengi, beyaz.",
    "Görsel dili karakteristik olmalıdır: atlas çizgileri, koordinat gridleri, topoğrafik hatlar, pusula/ölçek izleri.",
    "Öğrenciye ders anlatımı gibi düz bilgi verilmez; gözlem, karşılaştırma ve neden-sonuç ilişkisi kurdurulur."
  ]
};

export type SlideVisualStyle = {
  visualTone: string;
  backgroundMotif: string;
  iconStyle: string;
  imageTreatment: string;
};

export const colabVisualStyle: SlideVisualStyle = {
  visualTone: "resmi, modern, coğrafi atlas estetiği, kurumsal eğitim sunumu",
  backgroundMotif: "ince koordinat gridleri, yarı saydam izohips/topoğrafya çizgileri, sade harita dokusu",
  iconStyle: "tek çizgi modern ikonlar, kalınlığı dengeli, turkuaz vurgulu",
  imageTreatment: "yuvarlatılmış köşeli görsel alanları, düşük opaklıklı lacivert overlay, kısa açıklama etiketi"
};

export function getLayoutGuidance(layout: string) {
  const map: Record<string, string> = {
    title: "Büyük başlık, kısa alt başlık, arka planda atlas/grid motifi.",
    concept_explanation: "Sol başlık ve kavram açıklaması, sağda şema veya kavram kartı.",
    map_analysis: "Harita/görsel geniş alan kaplar; sağda gözlem soruları ve çıkarım kutusu.",
    visual_analysis: "Ana görsel + kısa yorum etiketleri; bilgi parçaları görsel üzerinde işaretlenir.",
    comparison: "İki sütunlu karşılaştırma; her sütunda 3-4 kritik özellik.",
    cause_effect: "Neden → süreç → sonuç akışı; oklarla ilerleyen şema.",
    process: "Aşamalar halinde yatay süreç çizgisi.",
    activity: "Öğrenci görevi, süre, beklenen ürün ve kontrol sorusu.",
    summary: "Kavram haritası veya 4 maddelik toparlama.",
    assessment: "Kısa ölçme soruları; cevaplar gösterilmez."
  };

  return map[layout] || "Modern, dengeli, görsel destekli resmi Co_LAB düzeni.";
}
