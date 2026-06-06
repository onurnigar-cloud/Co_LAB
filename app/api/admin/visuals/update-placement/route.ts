import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { createAdminClient } from "@/lib/supabase/admin";

const schema = z.object({
  presentationDraftId: z.string().min(2),
  slideNumber: z.number().min(1),
  fitMode: z.enum(["cover", "contain", "fill"]).default("cover"),
  focalX: z.number().min(0).max(1).default(0.5),
  focalY: z.number().min(0).max(1).default(0.5),
  captionOverride: z.string().nullable().optional(),
  placementNote: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({
      ok: true,
      localOnly: true,
      note: "Supabase bağlı değil; yerleşim ayarı local placeholder olarak kabul edildi."
    });
  }

  const body = await request.json();
  const input = schema.parse(body);

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_slide_visuals")
    .update({
      fit_mode: input.fitMode,
      focal_x: input.focalX,
      focal_y: input.focalY,
      caption_override: input.captionOverride || null,
      placement_note: input.placementNote || null,
    })
    .eq("presentation_draft_id", input.presentationDraftId)
    .eq("slide_number", input.slideNumber)
    .select("*");

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    result: data,
    note: "Görsel yerleşim ayarı güncellendi.",
  });
}
