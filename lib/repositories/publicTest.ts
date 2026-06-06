import { db, getApprovedQuestions } from "../data";
import { createAdminClient } from "../supabase/admin";

export type PublicTestGenerateInput = {
  area?: string;
  topic?: string;
  difficulty?: string;
  questionType?: string;
  count?: number;
};

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function sanitizeQuestion(q: any) {
  return {
    id: q.id,
    area: q.area,
    classLevel: q.class_level ?? q.classLevel ?? null,
    topic: q.topic_title ?? q.topic,
    difficulty: q.difficulty,
    questionType: q.question_type ?? q.questionType,
    stem: q.stem,
    options: q.options ?? [],
    visitorShowAnswer: false,
  };
}

export async function listPublicQuestionTopics() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    const source = Array.isArray(db.questionBank) ? db.questionBank : [];
    const grouped = new Map<string, any>();

    for (const q of source as any[]) {
      if (q.approvalStatus !== "approved") continue;
      const key = `${q.area}__${q.topic}`;
      const current = grouped.get(key);
      grouped.set(key, {
        area: q.area,
        topic: q.topic,
        questionCount: (current?.questionCount ?? 0) + 1,
      });
    }

    return Array.from(grouped.values());
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("public_question_topics")
    .select("*")
    .order("area", { ascending: true })
    .order("topic_title", { ascending: true });

  if (error) {
    console.error("public_question_topics error:", error.message);
    return [];
  }

  return (data ?? []).map((row: any) => ({
    area: row.area,
    topic: row.topic_title,
    questionCount: Number(row.question_count || 0),
  }));
}

export async function generatePublicTest(input: PublicTestGenerateInput) {
  const count = Math.min(Math.max(input.count ?? 10, 1), 50);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    const fallback = getApprovedQuestions({
      area: input.area,
      topic: input.topic,
      difficulty: input.difficulty,
      count: 200,
    });

    return shuffle(fallback)
      .filter((q: any) => !input.questionType || input.questionType === "Tümü" || q.questionType === input.questionType)
      .slice(0, count)
      .map(sanitizeQuestion);
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("public_questions")
    .select("id, area, class_level, topic_title, difficulty, question_type, stem, options")
    .eq("approval_status", "approved")
    .limit(200);

  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);
  if (input.topic && input.topic !== "Tümü") query = query.eq("topic_title", input.topic);
  if (input.difficulty && input.difficulty !== "Tümü") query = query.eq("difficulty", input.difficulty);
  if (input.questionType && input.questionType !== "Tümü") query = query.eq("question_type", input.questionType);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return shuffle(data ?? []).slice(0, count).map(sanitizeQuestion);
}
