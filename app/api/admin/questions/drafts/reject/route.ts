import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { rejectQuestionDraft } from "@/lib/repositories/questionDrafts";

const schema = z.object({
  draftId: z.string().min(2),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await rejectQuestionDraft(input.draftId);

  return NextResponse.json({
    ok: true,
    result,
    security: {
      visitorVisible: false,
      note: "Reddedilen taslak ziyaretçi tarafında görünmez.",
    },
  });
}
