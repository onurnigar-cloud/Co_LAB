import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../../lib/security/adminApi";
import { updatePresentationDraft } from "../../../../../../lib/repositories/presentationDrafts";

const schema = z.object({
  draftId: z.string().min(2),
  presentationTitle: z.string().min(2),
  slides: z.array(z.any()),
  mainConcepts: z.array(z.string()).default([]),
  subConcepts: z.array(z.string()).default([]),
  missingConcepts: z.array(z.string()).default([]),
  adminReviewNote: z.string().nullable().optional(),
  overallCoverageStatus: z.string().default("needs_review"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await updatePresentationDraft(input);

  return NextResponse.json({
    ok: true,
    result,
  });
}
