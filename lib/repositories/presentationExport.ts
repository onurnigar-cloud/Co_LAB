import { createAdminClient } from "@/lib/supabase/admin";
import type { PptxPresentationDraft, PptxSlideVisualAsset } from "@/lib/presentation/pptxBuilder";
import { getApprovedVisualAssetsForDraft } from "@/lib/repositories/webVisualAssets";

function normalizeDraft(row: any, visualRows: any[] = []): PptxPresentationDraft {
  const visualAssetsBySlide: Record<number, PptxSlideVisualAsset> = {};

  for (const row of visualRows) {
    const asset = row.web_visual_assets;
    if (!asset) continue;

    visualAssetsBySlide[Number(row.slide_number)] = {
      slideNumber: Number(row.slide_number),
      title: asset.title,
      imageUrl: asset.image_url,
      thumbnailUrl: asset.thumbnail_url,
      sourceUrl: asset.source_url,
      attributionText: asset.attribution_text,
      license: asset.license,
      creator: asset.creator,
      usageNote: row.usage_note,
    };
  }

  return {
    presentationTitle: row.presentation_title,
    area: row.area,
    topicTitle: row.topic_title,
    sourceSummary: row.source_summary || "",
    mainConcepts: row.main_concepts || [],
    subConcepts: row.sub_concepts || [],
    missingConcepts: row.missing_concepts || [],
    suggestedSlideCount: row.suggested_slide_count || (row.slides?.length ?? 0),
    slides: row.slides || [],
    overallCoverageStatus: row.overall_coverage_status || "needs_review",
    adminReviewNote: row.admin_review_note || "",
    visualAssetsBySlide,
  };
}

export async function getPresentationDraftForExport(draftId: string): Promise<PptxPresentationDraft | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return null;
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const visualRows = await getApprovedVisualAssetsForDraft(draftId);
  return normalizeDraft(data, visualRows);
}

export function sanitizeFileName(input: string) {
  return input
    .toLocaleLowerCase("tr")
    .replace(/[ç]/g, "c")
    .replace(/[ğ]/g, "g")
    .replace(/[ı]/g, "i")
    .replace(/[ö]/g, "o")
    .replace(/[ş]/g, "s")
    .replace(/[ü]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || "colab-sunum";
}
