import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { z } from "zod";
import { requireAdminApi } from "../../../../../lib/security/adminApi";
import { buildPresentationPptxBuffer, type PptxPresentationDraft } from "../../../../../lib/presentation/pptxBuilder";
import { getPresentationDraftForExport, sanitizeFileName } from "../../../../../lib/repositories/presentationExport";

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

const bodySchema = z.object({
  draftId: z.string().optional(),
  draft: z.object({
    presentationTitle: z.string(),
    area: z.string(),
    topicTitle: z.string(),
    sourceSummary: z.string().default(""),
    mainConcepts: z.array(z.string()).default([]),
    subConcepts: z.array(z.string()).default([]),
    missingConcepts: z.array(z.string()).default([]),
    suggestedSlideCount: z.number().default(0),
    slides: z.array(slideSchema),
    overallCoverageStatus: z.string().default("needs_review"),
    adminReviewNote: z.string().default(""),
  }).optional(),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = bodySchema.parse(body);

  let draft: PptxPresentationDraft | null = input.draft as PptxPresentationDraft | undefined || null;

  if (!draft && input.draftId) {
    draft = await getPresentationDraftForExport(input.draftId);
  }

  if (!draft) {
    return NextResponse.json(
      { ok: false, error: "PPTX üretimi için draft veya draftId gereklidir." },
      { status: 400 }
    );
  }

  const buffer = await buildPresentationPptxBuffer(draft);
  const fileName = `${sanitizeFileName(draft.presentationTitle)}-colab.pptx`;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
      "X-CoLAB-Security": "admin-export-only",
    },
  });
}
