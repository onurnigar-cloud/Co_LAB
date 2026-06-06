import { createAdminClient } from "@/lib/supabase/admin";
import type { SketchfabModelCandidate } from "@/lib/sketchfab/types";

export async function upsertSketchfabModel(candidate: SketchfabModelCandidate) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      localOnly: true,
      model: {
        id: `local-model-${candidate.uid}`,
        sketchfab_uid: candidate.uid,
        display_name: candidate.displayName,
        educational_name: candidate.educationalName,
        embed_url: candidate.embedUrl,
        source_url: candidate.sourceUrl,
        thumbnail_url: candidate.thumbnailUrl,
        visibility: "admin",
        model_status: "draft",
      },
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sketchfab_model_library")
    .upsert({
      sketchfab_uid: candidate.uid,
      source_url: candidate.sourceUrl,
      embed_url: candidate.embedUrl,
      oembed_html: candidate.oembedHtml || null,
      original_title: candidate.originalTitle,
      display_name: candidate.displayName,
      educational_name: candidate.educationalName || null,
      description: candidate.description || null,
      thumbnail_url: candidate.thumbnailUrl || null,
      author_name: candidate.authorName || null,
      author_url: candidate.authorUrl || null,
      license: candidate.license || null,
      license_url: candidate.licenseUrl || null,
      tags: candidate.tags || [],
      source_profile_url: candidate.sourceProfileUrl || "https://sketchfab.com/onurnigar/models",
      updated_at: new Date().toISOString(),
    }, {
      onConflict: "sketchfab_uid",
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { model: data };
}

export async function bulkUpsertSketchfabModels(candidates: SketchfabModelCandidate[]) {
  const results = [];

  for (const candidate of candidates) {
    results.push(await upsertSketchfabModel(candidate));
  }

  return results;
}

export async function listSketchfabModels(input: {
  status?: string;
  visibility?: string;
  query?: string;
  limit?: number;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("sketchfab_model_library")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(input.limit ?? 100);

  if (input.status && input.status !== "Tümü") query = query.eq("model_status", input.status);
  if (input.visibility && input.visibility !== "Tümü") query = query.eq("visibility", input.visibility);
  if (input.query) query = query.ilike("display_name", `%${input.query}%`);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}

export async function updateSketchfabModel(input: {
  modelId: string;
  displayName: string;
  educationalName?: string | null;
  description?: string | null;
  modelStatus: "draft" | "ready" | "hidden" | "archived";
  visibility: "admin" | "teacher" | "public" | "hidden";
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, modelId: input.modelId, ...input };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sketchfab_model_library")
    .update({
      display_name: input.displayName,
      educational_name: input.educationalName || null,
      description: input.description || null,
      model_status: input.modelStatus,
      visibility: input.visibility,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.modelId)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { model: data };
}

export async function attachSketchfabModelToTopic(input: {
  modelId: string;
  topicId: string;
  displayOrder?: number;
  teacherNote?: string | null;
  studentTask?: string | null;
  boardMode?: "explore" | "guided_observation" | "compare" | "assessment";
  defaultForTopic?: boolean;
  visibility?: "admin" | "teacher" | "public" | "hidden";
}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { localOnly: true, attachment: input };
  }

  const supabase = createAdminClient();

  if (input.defaultForTopic) {
    await supabase
      .from("topic_3d_model_links")
      .update({ default_for_topic: false })
      .eq("topic_id", input.topicId);
  }

  const { data, error } = await supabase
    .from("topic_3d_model_links")
    .upsert({
      topic_id: input.topicId,
      sketchfab_model_id: input.modelId,
      display_order: input.displayOrder ?? 1,
      teacher_note: input.teacherNote || null,
      student_task: input.studentTask || null,
      board_mode: input.boardMode || "explore",
      default_for_topic: input.defaultForTopic ?? false,
      visibility: input.visibility || "public",
    }, {
      onConflict: "topic_id,sketchfab_model_id"
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return { attachment: data };
}

export async function listPublic3DModels(input: {
  topicSlug?: string;
  topicId?: string;
  area?: string;
} = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return [
      {
        model_id: "local-plato",
        topic_title: "Türkiye’de Yer Şekilleri",
        area: "10. Sınıf",
        display_name: "Plato Modeli",
        educational_name: "Plato",
        description: "Sketchfab üzerinden konuya bağlı 3D model.",
        embed_url: "https://sketchfab.com/models/95d05c602eab4dcba20b53481c17c70f/embed?autostart=0&ui_infos=0&ui_controls=1&ui_stop=0&dnt=1",
        source_url: "https://sketchfab.com/3d-models/plato-95d05c602eab4dcba20b53481c17c70f",
        student_task: "Modeli döndürerek plato yüzeyini ve çevresindeki eğim farklarını gözlemleyin.",
        board_mode: "guided_observation",
        default_for_topic: true,
      }
    ];
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("public_topic_3d_models")
    .select("*")
    .order("display_order", { ascending: true });

  if (input.topicId) query = query.eq("topic_id", input.topicId);
  if (input.topicSlug) query = query.eq("topic_slug", input.topicSlug);
  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data ?? [];
}
