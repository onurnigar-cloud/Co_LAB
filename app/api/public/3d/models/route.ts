import { NextResponse } from "next/server";
import { listPublic3DModels } from "@/lib/repositories/sketchfabModels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const models = await listPublic3DModels({
    topicSlug: searchParams.get("topicSlug") || undefined,
    topicId: searchParams.get("topicId") || undefined,
    area: searchParams.get("area") || undefined,
  });

  return NextResponse.json({
    ok: true,
    models,
    security: {
      sourceProfileVisible: false,
      note: "Ziyaretçi yalnızca public/ready modelleri görür.",
    },
  });
}
