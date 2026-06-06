import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { attachVisualToPresentationSlide } from "../../../../../lib/repositories/webVisualAssets";

const schema = z.object({
  presentationDraftId: z.string().min(2),
  slideNumber: z.number().min(1),
  visualAssetId: z.string().min(2),
  usageNote: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await attachVisualToPresentationSlide(input);

  return NextResponse.json({
    ok: true,
    result,
    note: "Görsel sunum slaydına iliştirildi.",
  });
}
