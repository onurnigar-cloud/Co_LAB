export type AnimationPreset =
  | "softFadeSequence"
  | "mapReveal"
  | "processFlow"
  | "comparisonWipe"
  | "conceptZoom"
  | "activityFocus"
  | "noAnimation";

export type SlideAnimationPlan = {
  preset: AnimationPreset;
  order: string[];
  durationMs: number;
  easing: "smooth" | "linear" | "emphasis";
  note: string;
};

export function getAnimationPlan(layout: string): SlideAnimationPlan {
  switch (layout) {
    case "title":
      return {
        preset: "softFadeSequence",
        order: ["background motif", "title", "subtitle", "tagline"],
        durationMs: 650,
        easing: "smooth",
        note: "Başlık ve alt başlık sırayla yumuşak biçimde gelir."
      };
    case "map_analysis":
      return {
        preset: "mapReveal",
        order: ["map/image", "location marker", "observation prompt", "inference box"],
        durationMs: 850,
        easing: "smooth",
        note: "Harita önce açılır, sonra konum işaretleri ve yorum kutusu belirir."
      };
    case "process":
    case "cause_effect":
      return {
        preset: "processFlow",
        order: ["step 1", "arrow", "step 2", "arrow", "result"],
        durationMs: 900,
        easing: "linear",
        note: "Süreç çizgisi soldan sağa ilerler."
      };
    case "comparison":
      return {
        preset: "comparisonWipe",
        order: ["left column", "right column", "common conclusion"],
        durationMs: 750,
        easing: "smooth",
        note: "Karşılaştırma blokları sırayla görünür."
      };
    case "concept_explanation":
      return {
        preset: "conceptZoom",
        order: ["key concept", "definition", "example", "geography connection"],
        durationMs: 700,
        easing: "emphasis",
        note: "Ana kavram vurgulanır, açıklama ve örnek ardından gelir."
      };
    case "activity":
      return {
        preset: "activityFocus",
        order: ["task title", "steps", "expected output", "time box"],
        durationMs: 700,
        easing: "smooth",
        note: "Görev adımları odak sırasıyla açılır."
      };
    default:
      return {
        preset: "softFadeSequence",
        order: ["title", "content", "teacher note"],
        durationMs: 600,
        easing: "smooth",
        note: "Sade yumuşak giriş uygulanır."
      };
  }
}

export function getPptxAnimationNote() {
  return "Not: PPTX export temel slayt düzenini ve animasyon planı metadata’sını üretir. PowerPoint içindeki gelişmiş nesne animasyonları, hedef uygulamanın destek düzeyine göre manuel/ek araçla uygulanabilir. Web önizlemede bu presetler CSS animasyonlarıyla kullanılabilir.";
}
