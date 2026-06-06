import { searchAiArchive, decideArchiveAction } from "../aiArchive";
import { createAdminClient } from "../supabase/admin";

type ArchiveInput = {
  area?: string;
  topic?: string;
  contentType?: string;
};

export async function searchArchive(input: ArchiveInput) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    const matches = searchAiArchive(input);
    return decideArchiveAction(matches);
  }

  const supabase = createAdminClient();
  let query = supabase.from("ai_library").select("*").limit(20);

  if (input.area && input.area !== "Tümü") query = query.eq("area", input.area);
  if (input.contentType && input.contentType !== "Tümü") query = query.eq("content_type", input.contentType);
  if (input.topic) query = query.ilike("topic_title", `%${input.topic}%`);

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    const matches = searchAiArchive(input);
    return decideArchiveAction(matches);
  }

  return {
    action: data && data.length > 0 ? "reuse_or_adapt" : "generate_new",
    message: data && data.length > 0 ? "Arşivde uygun içerik bulundu." : "Arşivde uygun içerik bulunamadı.",
    matches: data ?? [],
  };
}
