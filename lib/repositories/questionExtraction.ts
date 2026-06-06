import { createAdminClient } from "@/lib/supabase/admin";
import type { QuestionExtractionResult } from "@/lib/ai/questionExtractionSchema";

export async function getSourceChunksForAI(sourceId: string, limit = 8) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [];
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("source_chunks")
    .select("chunk_index, text_content, token_estimate")
    .eq("source_id", sourceId)
    .order("chunk_index", { ascending: true })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function saveQuestionExtractionDrafts(params: {
  sourceId?: string | null;
  sourceTitle: string;
  result: QuestionExtractionResult;
}) {
  const { sourceId, sourceTitle, result } = params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      inserted: result.questions.length,
      drafts: result.questions.map((q, index) => ({
        id: `local-draft-${index + 1}`,
        source_id: sourceId,
        source_title: sourceTitle,
        ...q,
      })),
    };
  }

  if (result.questions.length === 0) {
    return { inserted: 0, drafts: [] };
  }

  const supabase = createAdminClient();

  const rows = result.questions.map((q) => ({
    source_id: sourceId || null,
    source_title: sourceTitle,
    area: q.area,
    class_level: q.classLevel,
    topic_title: q.topicTitle,
    difficulty: q.difficulty,
    question_type: q.questionType,
    stem: q.stem,
    options: q.options,
    correct_answer: q.correctAnswer,
    explanation: q.explanation,
    confidence: q.confidence,
    needs_review: true,
    approval_status: "needs_review",
    raw_payload: q,
  }));

  const { data, error } = await supabase
    .from("question_extraction_drafts")
    .insert(rows)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return {
    inserted: data?.length ?? 0,
    drafts: data ?? [],
  };
}

export async function approveQuestionDraft(draftId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      approvedQuestionId: `local-approved-${draftId}`,
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("approve_question_draft", {
    draft_id: draftId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    approvedQuestionId: data,
  };
}
