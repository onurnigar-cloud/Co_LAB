import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../../lib/security/adminApi";
import { bulkApproveQuestionDrafts } from "../../../../../../lib/repositories/questionDrafts";

const schema = z.object({
  draftIds: z.array(z.string().min(2)).min(1),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await bulkApproveQuestionDrafts(input.draftIds);

  return NextResponse.json({
    ok: true,
    result,
    security: {
      visitorShowAnswer: false,
      note: "Onaylanan sorular question_bank tablosuna aktarılır; cevaplar public API çıktısında gösterilmez.",
    },
  });
}
