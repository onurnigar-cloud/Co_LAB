import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { getPublicationAnalyticsSummary } from "@/lib/repositories/presentationAnalytics";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const summary = await getPublicationAnalyticsSummary();

  return NextResponse.json({
    ok: true,
    summary,
  });
}
