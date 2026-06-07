import { createAdminClient } from "../supabase/admin";

export type PublicationStatus = "published" | "hidden" | "archived";
export type PublicationVisibility = "public" | "teacher" | "hidden";
export type QualityStatus = "needs_review" | "approved" | "warning" | "failed";

export async function listAdminPublications(input: {
  area?: string;
  topic?: string;
  status?: PublicationStatus | "Tümü";
  limit?: number;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [
      {
        id: "local-publication-1",
        title: "Türkiye’de Yer Şekilleri",
        area: "10. Sınıf",
        topic_title: "Türkiye’de Yer Şekilleri",
        version: "1.0",
        visibility: "public",
        publication_status: "published",
        quality_status: "needs_review",
        quality_score: 72,
        slide_count: 24,
        download_count: 0,
        published_at: new Date().toISOString(),
      }
    ];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("presentation_publication_stats")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(input.limit ?? 100);

  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);
  if (input.topic) query = query.ilike("topic_title", `%${input.topic}%`);
  if (input.status && input.status !== "Tümü") query = query.eq("publication_status", input.status);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function updatePublicationStatus(input: {
  publicationId: string;
  visibility: PublicationVisibility;
  publicationStatus: PublicationStatus;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, ...input };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_publications")
    .update({
      visibility: input.visibility,
      publication_status: input.publicationStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.publicationId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { publication: data };
}

export async function savePublicationQualityCheck(input: {
  publicationId: string;
  checklist: Record<string, boolean>;
  reviewerNote?: string | null;
}) {
  const values = Object.values(input.checklist);
  const score = values.length === 0
    ? 0
    : Math.round((values.filter(Boolean).length / values.length) * 100);

  const status: QualityStatus =
    score >= 90 ? "approved" :
    score >= 70 ? "warning" :
    "failed";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      score,
      status,
      publicationId: input.publicationId,
    };
  }

  const supabase = createAdminClient();

  const inserted = await supabase
    .from("presentation_quality_checks")
    .insert({
      publication_id: input.publicationId,
      checklist: input.checklist,
      score,
      status,
      reviewer_note: input.reviewerNote || null,
    })
    .select("*")
    .single();

  if (inserted.error) throw new Error(inserted.error.message);

  const updated = await supabase
    .from("presentation_publications")
    .update({
      quality_score: score,
      quality_status: status,
      quality_note: input.reviewerNote || null,
      last_quality_review_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.publicationId)
    .select("*")
    .single();

  if (updated.error) throw new Error(updated.error.message);

  return {
    qualityCheck: inserted.data,
    publication: updated.data,
    score,
    status,
  };
}

export async function recordPresentationDownloadEvent(input: {
  publicationId: string;
  userAgent?: string | null;
  referrer?: string | null;
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, publicationId: input.publicationId };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_download_events")
    .insert({
      publication_id: input.publicationId,
      user_agent: input.userAgent || null,
      referrer: input.referrer || null,
      metadata: {},
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { event: data };
}

export async function getPublicationAnalyticsSummary() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      totalPublications: 1,
      published: 1,
      hidden: 0,
      totalDownloads: 0,
      averageQualityScore: 72,
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("presentation_publication_stats")
    .select("*");

  if (error) throw new Error(error.message);

  const rows = data ?? [];
  const totalDownloads = rows.reduce((sum: number, row: any) => sum + Number(row.download_count || 0), 0);
  const qualityRows = rows.filter((row: any) => typeof row.quality_score === "number");
  const averageQualityScore = qualityRows.length
    ? Math.round(qualityRows.reduce((sum: number, row: any) => sum + Number(row.quality_score || 0), 0) / qualityRows.length)
    : 0;

  return {
    totalPublications: rows.length,
    published: rows.filter((row: any) => row.publication_status === "published").length,
    hidden: rows.filter((row: any) => row.publication_status === "hidden").length,
    archived: rows.filter((row: any) => row.publication_status === "archived").length,
    totalDownloads,
    averageQualityScore,
  };
}
