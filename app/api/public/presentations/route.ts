import { NextResponse } from "next/server";
import { listPublicPresentations } from "../../../../lib/repositories/presentationPublish";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const presentations = await listPublicPresentations({
    area: searchParams.get("area") || undefined,
    topic: searchParams.get("topic") || undefined,
    limit: Number(searchParams.get("limit") || 50),
  });

  return NextResponse.json({
    ok: true,
    presentations,
    security: {
      sourcePdfVisible: false,
      storagePathVisible: false,
      note: "Ziyaretçi yalnızca yayınlanmış sunum metadata bilgisini görür.",
    },
  });
}
