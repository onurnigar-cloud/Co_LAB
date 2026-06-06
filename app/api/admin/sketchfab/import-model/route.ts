import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { importSketchfabModelUrl } from "../../../../../lib/sketchfab/profile";
import { upsertSketchfabModel } from "../../../../../lib/repositories/sketchfabModels";

const schema = z.object({
  modelUrlOrUid: z.string().min(10),
  sourceProfileUrl: z.string().default("https://sketchfab.com/onurnigar/models"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const candidate = await importSketchfabModelUrl(input.modelUrlOrUid, input.sourceProfileUrl);
  const result = await upsertSketchfabModel(candidate);

  return NextResponse.json({
    ok: true,
    candidate,
    result,
    note: "Model Sketchfab oEmbed bilgisiyle kütüphaneye eklendi.",
  });
}
