import { createAdminClient } from "@/lib/supabase/admin";

export type DraftListFilter = {
  status?: "needs_review" | "approved" | "rejected";
  area?: string;
  topic?: string;
  limit?: number;
};

export async function listQuestionDrafts(filter: DraftListFilter = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [
      {
        id: "local-draft-1",
        source_title: "TYT / 9 ve 10. Sınıf Uyumlu Coğrafya Testi",
        area: "10. Sınıf",
        class_level: "10",
        topic_title: "Türkiye’de Yer Şekilleri",
        difficulty: "Orta",
        question_type: "Çoktan seçmeli",
        stem: "Türkiye’de kısa mesafelerde yükselti ve yer şekillerinin değişmesi aşağıdakilerden hangisini doğrudan artırır?",
        options: ["Nüfus artış hızını", "İklim çeşitliliğini", "Denizlerin tuzluluk oranını", "Jeolojik zamanların süresini", "Yerel saat farkını"],
        correct_answer: "B",
        explanation: "Yükselti ve yer şekillerindeki çeşitlilik kısa mesafelerde iklim farklılıklarını artırır.",
        confidence: 0.86,
        needs_review: true,
        approval_status: "needs_review",
      }
    ];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("question_extraction_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filter.limit ?? 50);

  if (filter.status) query = query.eq("approval_status", filter.status);
  if (filter.area && filter.area !== "Tümü") query = query.eq("area", filter.area);
  if (filter.topic) query = query.ilike("topic_title", `%${filter.topic}%`);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateQuestionDraft(input: {
  draftId: string;
  stem: string;
  options: string[];
  correctAnswer: string | null;
  explanation: string | null;
  area: string;
  classLevel: string | null;
  topicTitle: string;
  difficulty: string;
  questionType: string;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, draftId: input.draftId };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("update_question_draft", {
    draft_id: input.draftId,
    new_stem: input.stem,
    new_options: input.options,
    new_correct_answer: input.correctAnswer,
    new_explanation: input.explanation,
    new_area: input.area,
    new_class_level: input.classLevel,
    new_topic_title: input.topicTitle,
    new_difficulty: input.difficulty,
    new_question_type: input.questionType,
  });

  if (error) throw new Error(error.message);

  return { draftId: data };
}

export async function rejectQuestionDraft(draftId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, draftId };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("reject_question_draft", {
    draft_id: draftId,
  });

  if (error) throw new Error(error.message);

  return { draftId: data };
}

export async function bulkApproveQuestionDrafts(draftIds: string[]) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      approved: draftIds.map((draftId) => ({
        approved_draft_id: draftId,
        question_id: `local-question-${draftId}`,
      })),
    };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("bulk_approve_question_drafts", {
    draft_ids: draftIds,
  });

  if (error) throw new Error(error.message);

  return { approved: data ?? [] };
}
