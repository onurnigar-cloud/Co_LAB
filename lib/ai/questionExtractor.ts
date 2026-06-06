import { createOpenAIClient, getOpenAIModel } from "../openai/client";
import { questionExtractionJsonSchema, type QuestionExtractionResult } from "./questionExtractionSchema";

export type ExtractQuestionsInput = {
  sourceTitle: string;
  areaHint?: string;
  topicHint?: string;
  text: string;
  maxQuestions?: number;
};

function buildPrompt(input: ExtractQuestionsInput) {
  return `
Sen Co_LAB için çalışan bir coğrafya eğitim içerik ayrıştırma motorusun.

Görev:
- Verilen kaynak metinden coğrafya sorularını ayıkla.
- Soru kökünü, seçenekleri, doğru cevabı, açıklamayı ve konu etiketlerini çıkar.
- Cevap anahtarı varsa tespit et fakat ziyaretçiye gösterilecek veri gibi düşünme.
- Emin olmadığın doğru cevaplarda correctAnswer=null ve needsReview=true yap.
- Soru açık uçluysa options boş dizi olabilir.
- Konu, sınıf, TYT/AYT ve zorluk etiketlerini olabildiğince doğru ver.
- Kaynakta cevap anahtarı metnin arka bölümünde görünüyorsa embeddedAnswerKeyDetected=true yap.
- En fazla ${input.maxQuestions ?? 20} soru çıkar.

Kaynak başlık:
${input.sourceTitle}

Alan ipucu:
${input.areaHint || "Belirtilmedi"}

Konu ipucu:
${input.topicHint || "Belirtilmedi"}

Kaynak metin:
${input.text}
`;
}

export async function extractQuestionsWithAI(input: ExtractQuestionsInput): Promise<QuestionExtractionResult> {
  const client = createOpenAIClient();

  const response = await client.responses.create({
    model: getOpenAIModel(),
    input: buildPrompt(input),
    text: {
      format: {
        type: "json_schema",
        name: "colab_question_extraction",
        strict: true,
        schema: questionExtractionJsonSchema
      }
    }
  } as any);

  const outputText =
    (response as any).output_text ||
    (response as any).output?.flatMap((item: any) => item.content || [])
      ?.find((content: any) => content.type === "output_text")?.text;

  if (!outputText) {
    throw new Error("OpenAI yanıtında JSON metni bulunamadı.");
  }

  return JSON.parse(outputText) as QuestionExtractionResult;
}
