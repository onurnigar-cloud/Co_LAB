import { createAdminClient } from "@/lib/supabase/admin";

export type SourceProcessRecord = {
  title: string;
  sourceType: "google_drive" | "upload" | "external_url";
  driveFileId?: string | null;
  driveUrl?: string | null;
  fileType?: string | null;
  checksum?: string | null;
  pageCount?: number | null;
  visibility?: "admin" | "teacher" | "public";
  adminOnly?: boolean;
};

export async function upsertSourceRecord(record: SourceProcessRecord) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return {
      id: "local-source-placeholder",
      ...record,
      localOnly: true,
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("sources")
    .insert({
      title: record.title,
      source_type: record.sourceType,
      drive_file_id: record.driveFileId,
      drive_url: record.driveUrl,
      file_type: record.fileType,
      checksum: record.checksum,
      page_count: record.pageCount,
      visibility: record.visibility ?? "admin",
      admin_only: record.adminOnly ?? true,
      last_processed_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function insertSourceChunks(sourceId: string, chunks: Array<{
  chunkIndex: number;
  textContent: string;
  tokenEstimate: number;
}>) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return { inserted: chunks.length, localOnly: true };
  }

  if (chunks.length === 0) {
    return { inserted: 0 };
  }

  const supabase = createAdminClient();

  const rows = chunks.map((chunk) => ({
    source_id: sourceId,
    chunk_index: chunk.chunkIndex,
    text_content: chunk.textContent,
    token_estimate: chunk.tokenEstimate,
  }));

  const { error } = await supabase.from("source_chunks").insert(rows);

  if (error) {
    throw new Error(error.message);
  }

  return { inserted: rows.length };
}
