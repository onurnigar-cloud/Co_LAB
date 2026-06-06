import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePresentationWithAI } from "../../../../../lib/ai/presentationGenerator";
import { getSourceChunksForPresentation, savePresentationDraft } from "../../../../../lib/repositories/presentationDrafts";
import { requireAdminApi } from "../../../../../lib/security/adminApi";

const schema = z.object({
  sourceId: z.string().optional(),
  sourceTitle: z.string().min(2),
  areaHint: z.string().optional(),
  topicHint: z.string().min(2),
  presentationType: z.string().default("Ayrıntılı ders anlatım sunumu"),
  manualText: z.string().optional(),
  targetSlideCount: z.number().min(5).max(80).default(24),
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
        error: "OPENAI_API_KEY tanımlı değil. AI sunum taslağı üretimi için backend environment variable gereklidir.",
      },
      { status: 500 }
    );
  }

  let text = input.manualText?.trim() || "";

  if (!text && input.sourceId) {
    const chunks = await getSourceChunksForPresentation(input.sourceId);
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
    const result = await generatePresentationWithAI({
      sourceTitle: input.sourceTitle,
      areaHint: input.areaHint,
      topicHint: input.topicHint,
      presentationType: input.presentationType,
      text,
      targetSlideCount: input.targetSlideCount,
    });

    const saved = await savePresentationDraft({
      sourceId: input.sourceId || null,
      sourceTitle: input.sourceTitle,
      presentationType: input.presentationType,
      result,
    });

    return NextResponse.json({
      ok: true,
      result,
      saved,
      security: {
        visitorVisible: false,
        note: "Sunum taslağı admin kontrolüne kaydedildi. Onaylanmadan ziyaretçiye açılmaz.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "AI sunum taslağı üretimi sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
