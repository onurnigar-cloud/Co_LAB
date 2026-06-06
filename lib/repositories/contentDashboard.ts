import { createAdminClient } from "@/lib/supabase/admin";

export async function getContentDashboardStats() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      summary: {
        topicCount: 3,
        averageCoverageScore: 58,
        completeTopicCount: 0,
        partialTopicCount: 2,
        criticalMissingTopicCount: 1,
        totalQuestions: 2,
        totalPresentations: 1,
        totalActivities: 0,
        total3dModels: 1,
        totalMapTasks: 0,
      },
      areaSummary: [
        {
          area: "10. Sınıf",
          topic_count: 1,
          average_coverage_score: 58,
          complete_topic_count: 0,
          partial_topic_count: 1,
          critical_missing_topic_count: 0,
          total_questions: 1,
          total_presentations: 1,
          total_activities: 0,
          total_3d_models: 0,
          total_map_tasks: 0,
        }
      ],
      topicCoverage: [],
    };
  }

  const supabase = createAdminClient();

  const areaResult = await supabase
    .from("content_area_summary")
    .select("*")
    .order("area", { ascending: true });

  if (areaResult.error) throw new Error(areaResult.error.message);

  const topicResult = await supabase
    .from("content_topic_coverage")
    .select("*")
    .order("area", { ascending: true })
    .order("coverage_score", { ascending: true })
    .limit(200);

  if (topicResult.error) throw new Error(topicResult.error.message);

  const areaSummary = areaResult.data ?? [];
  const topicCoverage = topicResult.data ?? [];

  const summary = {
    topicCount: topicCoverage.length,
    averageCoverageScore: topicCoverage.length
      ? Math.round(topicCoverage.reduce((sum: number, row: any) => sum + Number(row.coverage_score || 0), 0) / topicCoverage.length)
      : 0,
    completeTopicCount: topicCoverage.filter((row: any) => row.coverage_status === "complete").length,
    partialTopicCount: topicCoverage.filter((row: any) => row.coverage_status === "partial").length,
    criticalMissingTopicCount: topicCoverage.filter((row: any) => row.coverage_status === "critical_missing").length,
    totalQuestions: topicCoverage.reduce((sum: number, row: any) => sum + Number(row.approved_question_count || 0), 0),
    totalPresentations: topicCoverage.reduce((sum: number, row: any) => sum + Number(row.published_presentation_count || 0), 0),
    totalActivities: topicCoverage.reduce((sum: number, row: any) => sum + Number(row.approved_activity_count || 0), 0),
    total3dModels: topicCoverage.reduce((sum: number, row: any) => sum + Number(row.public_3d_model_count || 0), 0),
    totalMapTasks: topicCoverage.reduce((sum: number, row: any) => sum + Number(row.public_map_task_count || 0), 0),
  };

  return {
    summary,
    areaSummary,
    topicCoverage,
  };
}

export async function getProductionPriorities(input: {
  area?: string;
  limit?: number;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [
      {
        area: "10. Sınıf",
        topic_title: "Türkiye’de Yer Şekilleri",
        coverage_score: 58,
        coverage_status: "partial",
        suggested_action: "Öncelik 3: Etkinlik üret",
        approved_question_count: 1,
        published_presentation_count: 1,
        approved_activity_count: 0,
        public_3d_model_count: 0,
        public_map_task_count: 0,
      }
    ];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("content_production_priorities")
    .select("*")
    .limit(input.limit ?? 50);

  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}
