import { createAdminClient } from "@/lib/supabase/admin";
import type { PresentationGenerationResult } from "@/lib/ai/presentationSchema";

export async function getSourceChunksForPresentation(sourceId: string, limit = 12) {
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

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function savePresentationDraft(params: {
  sourceId?: string | null;
  sourceTitle: string;
  presentationType: string;
  result: PresentationGenerationResult;
}) {
  const { sourceId, sourceTitle, presentationType, result } = params;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      draft: {
        id: "local-presentation-draft",
        source_id: sourceId,
        source_title: sourceTitle,
        presentation_type: presentationType,
        ...result,
      },
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_drafts")
    .insert({
      source_id: sourceId || null,
      source_title: sourceTitle,
      area: result.area,
      topic_title: result.topicTitle,
      presentation_type: presentationType,
      presentation_title: result.presentationTitle,
      source_summary: result.sourceSummary,
      main_concepts: result.mainConcepts,
      sub_concepts: result.subConcepts,
      coverage_checklist: result.coverageChecklist,
      missing_concepts: result.missingConcepts,
      suggested_slide_count: result.suggestedSlideCount,
      slides: result.slides,
      overall_coverage_status: result.overallCoverageStatus,
      admin_review_note: result.adminReviewNote,
      approval_status: "needs_review",
      visibility: "admin",
      version: "0.1",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { draft: data };
}

export async function listPresentationDrafts(filter: {
  status?: "needs_review" | "approved" | "rejected";
  topic?: string;
  limit?: number;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("presentation_drafts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(filter.limit ?? 20);

  if (filter.status) query = query.eq("approval_status", filter.status);
  if (filter.topic) query = query.ilike("topic_title", `%${filter.topic}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function updatePresentationDraft(input: {
  draftId: string;
  presentationTitle: string;
  slides: any[];
  mainConcepts: string[];
  subConcepts: string[];
  missingConcepts: string[];
  adminReviewNote?: string | null;
  overallCoverageStatus: string;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, draftId: input.draftId };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_drafts")
    .update({
      presentation_title: input.presentationTitle,
      slides: input.slides,
      main_concepts: input.mainConcepts,
      sub_concepts: input.subConcepts,
      missing_concepts: input.missingConcepts,
      admin_review_note: input.adminReviewNote,
      overall_coverage_status: input.overallCoverageStatus,
    })
    .eq("id", input.draftId)
    .eq("approval_status", "needs_review")
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { draft: data };
}

export async function approvePresentationDraft(draftId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, presentationId: `local-presentation-${draftId}` };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("approve_presentation_draft", {
    draft_id: draftId,
  });

  if (error) throw new Error(error.message);

  return { presentationId: data };
}


export async function getPresentationDraftDetail(draftId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return null;
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function savePresentationPreviewEdits(input: {
  draftId: string;
  presentationTitle: string;
  slides: any[];
  adminReviewNote?: string | null;
  overallCoverageStatus?: string;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      draftId: input.draftId,
      slides: input.slides,
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_drafts")
    .update({
      presentation_title: input.presentationTitle,
      slides: input.slides,
      admin_review_note: input.adminReviewNote || null,
      overall_coverage_status: input.overallCoverageStatus || "needs_review",
    })
    .eq("id", input.draftId)
    .eq("approval_status", "needs_review")
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { draft: data };
}
