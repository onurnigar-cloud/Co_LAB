import topics from "../data/topics.json";
import materials from "../data/materials.json";
import questionBank from "../data/question_bank.json";
import presentations from "../data/presentations.json";
import aiLibrary from "../data/ai_library.json";

export const db = {
  topics,
  materials,
  questionBank,
  presentations,
  aiLibrary,
};

export function getPublicTopics() {
  return topics;
}

export function getPublicPresentations() {
  return presentations.filter((item: any) => item.visibility === "public");
}

export function getPublicMaterials() {
  return materials.filter((item: any) => item.visibility === "public");
}

export function getApprovedQuestions(filters: {
  area?: string;
  topic?: string;
  difficulty?: string;
  count?: number;
}) {
  const count = filters.count ?? 10;
  return questionBank
    .filter((q: any) => q.approvalStatus === "approved")
    .filter((q: any) => !filters.area || q.area === filters.area || q.classes?.includes(filters.area))
    .filter((q: any) => !filters.topic || q.topic === filters.topic)
    .filter((q: any) => !filters.difficulty || filters.difficulty === "Tümü" || q.difficulty === filters.difficulty)
    .slice(0, count)
    .map((q: any) => ({
      id: q.id,
      area: q.area,
      topic: q.topic,
      difficulty: q.difficulty,
      questionType: q.questionType,
      stem: q.stem,
      options: q.options,
      visitorShowAnswer: false,
    }));
}
