import { NextResponse } from "next/server";
import { z } from "zod";
import { extractDriveFileId, getDriveFileMetadata } from "@/lib/google/drive";
import { requireAdminApi } from "@/lib/security/adminApi";

const schema = z.object({
  driveUrlOrId: z.string().min(10),
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

    return NextResponse.json({
      fileId,
      metadata,
      visitorVisible: false,
      securityNote: "Bu kaynak dosya ziyaretçiye doğrudan gösterilmez.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        fileId,
        error: error instanceof Error ? error.message : "Google Drive metadata okunamadı.",
        visitorVisible: false,
      },
      { status: 500 }
    );
  }
}
