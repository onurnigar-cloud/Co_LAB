import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { listPresentationDrafts } from "@/lib/repositories/presentationDrafts";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);

  const drafts = await listPresentationDrafts({
    status: (searchParams.get("status") as any) || "needs_review",
    topic: searchParams.get("topic") || undefined,
    limit: Number(searchParams.get("limit") || 20),
  });

  return NextResponse.json({
    ok: true,
    drafts,
    security: {
      visitorVisible: false,
      note: "Sunum taslakları yalnızca admin panelinde görünür.",
    },
  });
}
