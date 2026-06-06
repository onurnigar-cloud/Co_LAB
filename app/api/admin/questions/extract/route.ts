import { NextResponse } from "next/server";
import { z } from "zod";
import { extractQuestionsWithAI } from "@/lib/ai/questionExtractor";
import { getSourceChunksForAI, saveQuestionExtractionDrafts } from "@/lib/repositories/questionExtraction";
import { requireAdminApi } from "@/lib/security/adminApi";

const schema = z.object({
  sourceId: z.string().optional(),
  sourceTitle: z.string().min(2),
  areaHint: z.string().optional(),
  topicHint: z.string().optional(),
  manualText: z.string().optional(),
  maxQuestions: z.number().min(1).max(50).default(20),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "OPENAI_API_KEY tanımlı değil. AI soru çıkarma için backend environment variable gereklidir.",
      },
      { status: 500 }
    );
  }

  let text = input.manualText?.trim() || "";

  if (!text && input.sourceId) {
    const chunks = await getSourceChunksForAI(input.sourceId);
    text = chunks.map((chunk: any) => chunk.text_content).join("\n\n");
  }

  if (!text) {
    return NextResponse.json(
      {
        ok: false,
        error: "İşlenecek metin bulunamadı. sourceId ile source_chunks kaydı veya manualText gönderilmelidir.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await extractQuestionsWithAI({
      sourceTitle: input.sourceTitle,
      areaHint: input.areaHint,
      topicHint: input.topicHint,
      text,
      maxQuestions: input.maxQuestions,
    });

    const saved = await saveQuestionExtractionDrafts({
      sourceId: input.sourceId || null,
      sourceTitle: input.sourceTitle,
      result,
    });

    return NextResponse.json({
      ok: true,
      result,
      saved,
      security: {
        visitorShowAnswer: false,
        sourcePdfVisibleToVisitor: false,
        note: "Çıkarılan sorular admin kontrol taslağına kaydedildi. Doğru cevap ziyaretçiye açık API çıktısında dönmez.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "AI soru çıkarma sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
