import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { unpublishPresentation } from "../../../../../lib/repositories/presentationPublish";

const schema = z.object({
  publicationId: z.string().min(2),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await unpublishPresentation(input.publicationId);

  return NextResponse.json({
    ok: true,
    result,
    note: "Sunum yayından kaldırıldı.",
  });
}
