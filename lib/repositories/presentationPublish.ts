import { createAdminClient } from "../supabase/admin";
import { buildPresentationPptxBuffer } from "../presentation/pptxBuilder";
import { getPresentationDraftForExport, sanitizeFileName } from "./presentationExport";

export async function publishPresentationDraft(input: {
  draftId: string;
  description?: string | null;
  version?: string;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      publication: {
        id: `local-publication-${input.draftId}`,
        presentation_draft_id: input.draftId,
        title: "Local sunum yayını",
        publication_status: "published",
      },
    };
  }

  const supabase = createAdminClient();
  const draft = await getPresentationDraftForExport(input.draftId);

  if (!draft) {
    throw new Error("Sunum taslağı bulunamadı.");
  }

  const buffer = await buildPresentationPptxBuffer(draft);
  const fileName = `${sanitizeFileName(draft.presentationTitle)}-${Date.now()}.pptx`;
  const filePath = `${sanitizeFileName(draft.area || "genel")}/${fileName}`;
  const bucket = "presentation-exports";

  const upload = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      upsert: true,
    });

  if (upload.error) {
    throw new Error(upload.error.message);
  }

  const { data, error } = await supabase
    .from("presentation_publications")
    .insert({
      presentation_draft_id: input.draftId,
      title: draft.presentationTitle,
      area: draft.area,
      topic_title: draft.topicTitle,
      description: input.description || draft.sourceSummary || null,
      slide_count: draft.slides.length,
      version: input.version || "1.0",
      file_bucket: bucket,
      file_path: filePath,
      file_size_bytes: buffer.length,
      visibility: "public",
      publication_status: "published",
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return { publication: data };
}

export async function unpublishPresentation(publicationId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, publicationId };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_publications")
    .update({
      publication_status: "hidden",
      visibility: "hidden",
      updated_at: new Date().toISOString(),
    })
    .eq("id", publicationId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { publication: data };
}

export async function listPublicPresentations(input: {
  area?: string;
  topic?: string;
  limit?: number;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("presentation_publication_stats")
    .select("id, title, area, topic_title, slide_count, version, published_at, download_count, quality_status, quality_score")
    .eq("visibility", "public")
    .eq("publication_status", "published")
    .order("published_at", { ascending: false })
    .limit(input.limit ?? 50);

  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);
  if (input.topic) query = query.ilike("topic_title", `%${input.topic}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function createPresentationDownloadUrl(publicationId: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { url: "#", localOnly: true };
  }

  const supabase = createAdminClient();

  const { data: publication, error } = await supabase
    .from("presentation_publications")
    .select("*")
    .eq("id", publicationId)
    .eq("visibility", "public")
    .eq("publication_status", "published")
    .single();

  if (error) throw new Error(error.message);

  const signed = await supabase.storage
    .from(publication.file_bucket)
    .createSignedUrl(publication.file_path, 60 * 10, {
      download: `${sanitizeFileName(publication.title)}-CoLAB.pptx`,
    });

  if (signed.error) throw new Error(signed.error.message);

  return {
    url: signed.data.signedUrl,
    expiresInSeconds: 600,
    title: publication.title,
  };
}
