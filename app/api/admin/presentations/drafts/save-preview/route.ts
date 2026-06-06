import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { savePresentationPreviewEdits } from "@/lib/repositories/presentationDrafts";

const slideSchema = z.object({
  slideNumber: z.number(),
  title: z.string(),
  layout: z.string(),
  bulletPoints: z.array(z.string()).default([]),
  teacherNotes: z.string().default(""),
  studentTask: z.string().nullable().optional(),
  suggestedVisual: z.string().nullable().optional(),
  mapOr3DLinkNeeded: z.boolean().default(false),
  coverageTags: z.array(z.string()).default([]),
  visualPrompt: z.string().nullable().optional(),
  iconPrompt: z.string().nullable().optional(),
  animationPreset: z.string().optional(),
  designNote: z.string().optional(),
});

const schema = z.object({
  draftId: z.string().min(2),
  presentationTitle: z.string().min(2),
  slides: z.array(slideSchema).min(1),
  adminReviewNote: z.string().nullable().optional(),
  overallCoverageStatus: z.string().default("needs_review"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const normalizedSlides = input.slides.map((slide, index) => ({
    ...slide,
    slideNumber: index + 1,
  }));

  const result = await savePresentationPreviewEdits({
    ...input,
    slides: normalizedSlides,
  });

  return NextResponse.json({
    ok: true,
    result,
    note: "Slayt önizleme düzenlemeleri kaydedildi.",
  });
}
