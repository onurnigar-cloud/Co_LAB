import { NextResponse } from "next/server";
import { z } from "zod";
import { extractDriveFileId, downloadDriveFileAsBuffer, getDriveFileMetadata } from "@/lib/google/drive";
import { extractPdfText } from "@/lib/pdf/extract";
import { upsertSourceRecord, insertSourceChunks } from "@/lib/repositories/sources";
import { requireAdminApi } from "@/lib/security/adminApi";

const schema = z.object({
  title: z.string().min(2),
  driveUrlOrId: z.string().min(10),
  fileType: z.string().default("pdf"),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);
  const fileId = extractDriveFileId(input.driveUrlOrId);

  if (!fileId) {
    return NextResponse.json({ error: "Geçerli Google Drive dosya ID bulunamadı." }, { status: 400 });
  }

  try {
    const metadata = await getDriveFileMetadata(fileId);
    const buffer = await downloadDriveFileAsBuffer(fileId);
    const extracted = await extractPdfText(buffer);

    const source = await upsertSourceRecord({
      title: input.title || metadata.name || "Co_LAB Kaynak PDF",
      sourceType: "google_drive",
      driveFileId: fileId,
      driveUrl: null,
      fileType: input.fileType,
      checksum: extracted.checksum,
      pageCount: extracted.pageCount,
      visibility: "admin",
      adminOnly: true,
    });

    const chunksResult = await insertSourceChunks(String((source as any).id), extracted.chunks);

    return NextResponse.json({
      ok: true,
      source,
      fileId,
      metadata: {
        name: metadata.name,
        mimeType: metadata.mimeType,
        size: metadata.size,
        modifiedTime: metadata.modifiedTime,
      },
      processing: {
        checksum: extracted.checksum,
        pageCount: extracted.pageCount,
        textLength: extracted.text.length,
        chunkCount: extracted.chunks.length,
        chunksInserted: chunksResult.inserted,
      },
      visitorVisible: false,
      securityNote: "Kaynak PDF ziyaretçiye açılmaz. Metin parçaları yalnızca admin/AI işlemleri için saklanır.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        fileId,
        error: error instanceof Error ? error.message : "Kaynak işleme sırasında hata oluştu.",
      },
      { status: 500 }
    );
  }
}
