import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../../lib/security/adminApi";
import { updatePublicationStatus } from "../../../../../../lib/repositories/presentationAnalytics";

const schema = z.object({
  publicationId: z.string().min(2),
  visibility: z.enum(["public", "teacher", "hidden"]),
  publicationStatus: z.enum(["published", "hidden", "archived"]),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await updatePublicationStatus(input);

  return NextResponse.json({
    ok: true,
    result,
    note: "Yayın görünürlüğü/durumu güncellendi.",
  });
}
