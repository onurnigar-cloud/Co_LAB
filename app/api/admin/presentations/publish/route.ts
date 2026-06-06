import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { publishPresentationDraft } from "../../../../../lib/repositories/presentationPublish";

const schema = z.object({
  draftId: z.string().min(2),
  description: z.string().nullable().optional(),
  version: z.string().default("1.0"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  try {
    const result = await publishPresentationDraft(input);

    return NextResponse.json({
      ok: true,
      result,
      note: "Sunum PPTX olarak üretildi, storage alanına yüklendi ve ziyaretçi kütüphanesinde yayına alındı.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sunum yayına alınamadı.",
      },
      { status: 500 }
    );
  }
}
