import { NextResponse } from "next/server";
import { z } from "zod";
import { approveQuestionDraft } from "../../../../../lib/repositories/questionExtraction";
import { requireAdminApi } from "../../../../../lib/security/adminApi";

const schema = z.object({
  draftId: z.string().min(2),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  try {
    const result = await approveQuestionDraft(input.draftId);

    return NextResponse.json({
      ok: true,
      result,
      security: {
        visitorShowAnswer: false,
        note: "Soru onaylandı ve question_bank tablosuna cevap anahtarı ziyaretçiden gizli kalacak şekilde aktarıldı.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Soru onaylama sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
