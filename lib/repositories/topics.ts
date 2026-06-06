import { db } from "../data";
import { createAdminClient } from "../supabase/admin";

export async function listPublishedTopics() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return db.topics;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("status", "published")
    .order("area", { ascending: true });

  if (error) {
    console.error(error.message);
    return db.topics;
  }

  return data;
}
