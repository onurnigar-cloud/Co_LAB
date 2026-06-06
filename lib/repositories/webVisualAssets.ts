import { createAdminClient } from "@/lib/supabase/admin";
import type { WebVisualCandidate } from "@/lib/webVisuals/types";

export async function saveWebVisualCandidate(candidate: WebVisualCandidate) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      asset: {
        id: `local-visual-${Date.now()}`,
        ...candidate,
        approval_status: "approved",
      },
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("web_visual_assets")
    .insert({
      provider: candidate.provider,
      query: candidate.query,
      title: candidate.title,
      thumbnail_url: candidate.thumbnailUrl,
      image_url: candidate.imageUrl,
      source_url: candidate.sourceUrl,
      creator: candidate.creator,
      license: candidate.license,
      license_url: candidate.licenseUrl,
      attribution_text: candidate.attributionText,
      width: candidate.width,
      height: candidate.height,
      description: candidate.description,
      slide_fit_note: candidate.slideFitNote,
      approval_status: "approved",
      approved_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { asset: data };
}

export async function attachVisualToPresentationSlide(input: {
  presentationDraftId: string;
  slideNumber: number;
  visualAssetId: string;
  usageNote?: string | null;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, attached: input };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_slide_visuals")
    .insert({
      presentation_draft_id: input.presentationDraftId,
      slide_number: input.slideNumber,
      visual_asset_id: input.visualAssetId,
      usage_note: input.usageNote || null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { attached: data };
}

export async function getApprovedVisualAssetsForDraft(draftId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [];
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_slide_visuals")
    .select("slide_number, usage_note, web_visual_assets(*)")
    .eq("presentation_draft_id", draftId)
    .order("slide_number", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
}
