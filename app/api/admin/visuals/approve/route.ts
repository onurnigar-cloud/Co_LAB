import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { saveWebVisualCandidate } from "@/lib/repositories/webVisualAssets";

const candidateSchema = z.object({
  provider: z.enum(["wikimedia", "nasa", "openverse"]),
  title: z.string(),
  query: z.string(),
  thumbnailUrl: z.string().nullable(),
  imageUrl: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  creator: z.string().nullable(),
  license: z.string().nullable(),
  licenseUrl: z.string().nullable(),
  attributionText: z.string(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  slideFitNote: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const candidate = candidateSchema.parse(body.candidate);

  const result = await saveWebVisualCandidate(candidate);

  return NextResponse.json({
    ok: true,
    result,
    note: "Görsel onaylandı ve atıf bilgisiyle kayıt altına alındı.",
  });
}
