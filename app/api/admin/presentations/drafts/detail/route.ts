import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { getPresentationDraftDetail } from "@/lib/repositories/presentationDrafts";
import { getApprovedVisualAssetsForDraft } from "@/lib/repositories/webVisualAssets";

const schema = z.object({
  draftId: z.string().min(2),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const draft = await getPresentationDraftDetail(input.draftId);
  const visuals = await getApprovedVisualAssetsForDraft(input.draftId);

  return NextResponse.json({
    ok: true,
    draft,
    visuals,
    security: {
      visitorVisible: false,
      note: "Sunum taslak detayı yalnızca admin panelinde görünür.",
    },
  });
}
