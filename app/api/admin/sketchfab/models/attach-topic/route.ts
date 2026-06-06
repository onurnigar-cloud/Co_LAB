import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { attachSketchfabModelToTopic } from "@/lib/repositories/sketchfabModels";

const schema = z.object({
  modelId: z.string().min(2),
  topicId: z.string().min(2),
  displayOrder: z.number().default(1),
  teacherNote: z.string().nullable().optional(),
  studentTask: z.string().nullable().optional(),
  boardMode: z.enum(["explore", "guided_observation", "compare", "assessment"]).default("explore"),
  defaultForTopic: z.boolean().default(false),
  visibility: z.enum(["admin", "teacher", "public", "hidden"]).default("public"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await attachSketchfabModelToTopic(input);

  return NextResponse.json({
    ok: true,
    result,
    note: "Sketchfab modeli konuya bağlandı.",
  });
}
