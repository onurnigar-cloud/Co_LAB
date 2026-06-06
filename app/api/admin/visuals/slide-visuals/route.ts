import { NextResponse } from "next/server";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { getApprovedVisualAssetsForDraft } from "../../../../../lib/repositories/webVisualAssets";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  if (!draftId) {
    return NextResponse.json({ ok: false, error: "draftId gereklidir." }, { status: 400 });
  }

  const visuals = await getApprovedVisualAssetsForDraft(draftId);

  return NextResponse.json({
    ok: true,
    visuals,
  });
}
