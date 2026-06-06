import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "../../../../../../lib/security/adminApi";
import { updateQuestionDraft } from "../../../../../../lib/repositories/questionDrafts";

const schema = z.object({
  draftId: z.string().min(2),
  stem: z.string().min(2),
  options: z.array(z.string()).default([]),
  correctAnswer: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
  area: z.string().min(1),
  classLevel: z.string().nullable().optional(),
  topicTitle: z.string().min(1),
  difficulty: z.string().min(1),
  questionType: z.string().min(1),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const result = await updateQuestionDraft({
    draftId: input.draftId,
    stem: input.stem,
    options: input.options,
    correctAnswer: input.correctAnswer ?? null,
    explanation: input.explanation ?? null,
    area: input.area,
    classLevel: input.classLevel ?? null,
    topicTitle: input.topicTitle,
    difficulty: input.difficulty,
    questionType: input.questionType,
  });

  return NextResponse.json({ ok: true, result });
}
