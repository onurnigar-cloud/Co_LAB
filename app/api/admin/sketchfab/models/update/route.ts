import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { updateSketchfabModel } from "@/lib/repositories/sketchfabModels";

const schema = z.object({
  modelId: z.string().min(2),
  displayName: z.string().min(1),
  educationalName: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  modelStatus: z.enum(["draft", "ready", "hidden", "archived"]).default("draft"),
  visibility: z.enum(["admin", "teacher", "public", "hidden"]).default("admin"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await updateSketchfabModel(input);

  return NextResponse.json({
    ok: true,
    result,
    note: "Model adı ve yayın durumu güncellendi.",
  });
}
