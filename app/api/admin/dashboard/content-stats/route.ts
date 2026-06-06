import { NextResponse } from "next/server";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { getContentDashboardStats } from "../../../../../lib/repositories/contentDashboard";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const result = await getContentDashboardStats();

  return NextResponse.json({
    ok: true,
    result,
    security: {
      adminOnly: true,
      note: "İçerik kapsam istatistikleri admin paneli için üretilir.",
    },
  });
}
