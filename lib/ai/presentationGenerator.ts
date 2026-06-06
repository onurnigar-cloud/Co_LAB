import { createOpenAIClient, getOpenAIModel } from "../openai/client";
import { presentationGenerationJsonSchema, type PresentationGenerationResult } from "./presentationSchema";

export type GeneratePresentationInput = {
  sourceTitle: string;
  areaHint?: string;
  topicHint: string;
  presentationType?: string;
  text: string;
  targetSlideCount?: number;
};

function buildPrompt(input: GeneratePresentationInput) {
  return `
Sen Co_LAB için çalışan uzman bir coğrafya ders sunumu tasarım motorusun.

Amaç:
- Kaynak metinden kavram atlamadan, öğretmenin sınıfta anlatabileceği ayrıntılı sunum taslağı üret.
- Sunumu kısa özet gibi değil, ders anlatım akışı gibi yapılandır.
- Ana kavramları, alt kavramları, neden-sonuç ilişkilerini, harita/görsel/3D model ihtiyaçlarını çıkar.
- Eksik kavram varsa açıkça missingConcepts alanına yaz.
- Her slaytta öğretmen notu bulunmalı.
- Uygun slaytlarda öğrenci görevi, harita analizi, 3D model gözlemi veya kısa değerlendirme sorusu öner.
- Slaytlar doğrudan PPTX üretimine aktarılabilecek kadar düzenli olmalı.
- Her slayt için resmi-modern Co_LAB görsel diliyle visualPrompt üret.
- Her slayta uygun animationPreset seç: softFadeSequence, mapReveal, processFlow, comparisonWipe, conceptZoom, activityFocus veya noAnimation.
- Tasarım resmi, karakteristik, modern ve coğrafya laboratuvarı kimliğine uygun olmalı.
- Görsel öneriler atlas/grid/topoğrafya/harita/3D model estetiğiyle uyumlu olmalı.
- İçerik ziyaretçiye hemen yayınlanmayacak; admin kontrol taslağına düşecek.

Kaynak başlık:
${input.sourceTitle}

Alan / sınıf ipucu:
${input.areaHint || "Belirtilmedi"}

Konu:
${input.topicHint}

Sunum türü:
${input.presentationType || "Ayrıntılı ders anlatım sunumu"}

Hedef slayt sayısı:
${input.targetSlideCount || 24}

Kaynak metin:
${input.text}
`;
}

export async function generatePresentationWithAI(input: GeneratePresentationInput): Promise<PresentationGenerationResult> {
  const client = createOpenAIClient();

  const response = await client.responses.create({
    model: getOpenAIModel(),
    input: buildPrompt(input),
    text: {
      format: {
        type: "json_schema",
        name: "colab_presentation_generation",
        strict: true,
        schema: presentationGenerationJsonSchema
      }
    }
  } as any);

  const outputText =
    (response as any).output_text ||
    (response as any).output?.flatMap((item: any) => item.content || [])
      ?.find((content: any) => content.type === "output_text")?.text;

  if (!outputText) {
    throw new Error("OpenAI yanıtında sunum JSON metni bulunamadı.");
  }

  return JSON.parse(outputText) as PresentationGenerationResult;
}
