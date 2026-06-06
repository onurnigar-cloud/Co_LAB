import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { approvePresentationDraft } from "@/lib/repositories/presentationDrafts";

const schema = z.object({
  draftId: z.string().min(2),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await approvePresentationDraft(input.draftId);

  return NextResponse.json({
    ok: true,
    result,
    note: "Sunum taslağı presentations tablosuna taslak/draft görünürlüğüyle aktarıldı. Ziyaretçiye açmak için ayrıca yayın kararı gerekir.",
  });
}
