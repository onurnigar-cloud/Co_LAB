import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { getProductionPriorities } from "@/lib/repositories/contentDashboard";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);

  const priorities = await getProductionPriorities({
    area: searchParams.get("area") || undefined,
    limit: Number(searchParams.get("limit") || 50),
  });

  return NextResponse.json({
    ok: true,
    priorities,
    security: {
      adminOnly: true,
      note: "Üretim öncelikleri yalnızca admin üretim planlaması için kullanılır.",
    },
  });
}
