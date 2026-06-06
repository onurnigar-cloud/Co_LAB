import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { listSketchfabModels } from "@/lib/repositories/sketchfabModels";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);

  const models = await listSketchfabModels({
    status: searchParams.get("status") || "Tümü",
    visibility: searchParams.get("visibility") || "Tümü",
    query: searchParams.get("query") || undefined,
    limit: Number(searchParams.get("limit") || 100),
  });

  return NextResponse.json({
    ok: true,
    models,
    security: {
      adminOnly: true,
      note: "Sketchfab model kütüphanesi düzenleme verileri admin içindir.",
    },
  });
}
