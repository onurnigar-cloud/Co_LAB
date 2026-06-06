import { getApprovedQuestions } from "../data";
import { createAdminClient } from "../supabase/admin";

type GenerateTestInput = {
  area?: string;
  topic?: string;
  difficulty?: string;
  count?: number;
};

export async function getPublicTestQuestions(input: GenerateTestInput) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return getApprovedQuestions(input);
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("public_questions")
    .select("id, area, class_level, topic_title, difficulty, question_type, stem, options")
    .eq("approval_status", "approved")
    .limit(input.count ?? 10);

  if (input.area) query = query.eq("area", input.area);
  if (input.topic) query = query.eq("topic_title", input.topic);
  if (input.difficulty && input.difficulty !== "Tümü") query = query.eq("difficulty", input.difficulty);

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    return getApprovedQuestions(input);
  }

  return (data ?? []).map((q: any) => ({
    id: q.id,
    area: q.area,
    topic: q.topic_title,
    difficulty: q.difficulty,
    questionType: q.question_type,
    stem: q.stem,
    options: q.options ?? [],
    visitorShowAnswer: false,
  }));
}
