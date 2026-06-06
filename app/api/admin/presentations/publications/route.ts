import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import {
  listAdminPublications,
  savePublicationQualityCheck,
} from "../../../../../lib/repositories/presentationAnalytics";

const qualitySchema = z.object({
  publicationId: z.string().min(2),
  checklist: z.record(z.boolean()),
  reviewerNote: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(request.url);

  const publications = await listAdminPublications({
    area: searchParams.get("area") || undefined,
    topic: searchParams.get("topic") || undefined,
    status: (searchParams.get("status") as any) || "Tümü",
    limit: Number(searchParams.get("limit") || 100),
  });

  return NextResponse.json({
    ok: true,
    publications,
    security: {
      adminOnly: true,
      note: "Yayın yönetim listesi yalnızca admin panelinde kullanılır.",
    },
  });
}

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = qualitySchema.parse(body);

  const result = await savePublicationQualityCheck(input);

  return NextResponse.json({
    ok: true,
    result,
    note: "Yayın kalite kontrol kaydı oluşturuldu ve yayın kalite puanı güncellendi.",
  });
}
