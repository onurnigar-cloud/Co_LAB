import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { listQuestionDrafts } from "@/lib/repositories/questionDrafts";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);

  const drafts = await listQuestionDrafts({
    status: (searchParams.get("status") as any) || "needs_review",
    area: searchParams.get("area") || undefined,
    topic: searchParams.get("topic") || undefined,
    limit: Number(searchParams.get("limit") || 50),
  });

  return NextResponse.json({
    ok: true,
    drafts,
    security: {
      visitorVisible: false,
      note: "Taslak sorular yalnızca admin panelinde görünür.",
    },
  });
}
