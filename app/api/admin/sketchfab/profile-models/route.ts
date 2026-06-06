import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { scanSketchfabProfile } from "@/lib/sketchfab/profile";
import { bulkUpsertSketchfabModels } from "@/lib/repositories/sketchfabModels";

const schema = z.object({
  profileUrlOrUsername: z.string().default("https://sketchfab.com/onurnigar/models"),
  importToLibrary: z.boolean().default(true),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const scan = await scanSketchfabProfile(input.profileUrlOrUsername);
  const imported = input.importToLibrary && scan.candidates.length
    ? await bulkUpsertSketchfabModels(scan.candidates)
    : [];

  return NextResponse.json({
    ok: true,
    scan,
    importedCount: imported.length,
    imported,
    note: "Profil modelleri içe aktarıldı. Model adları admin panelden düzenlenebilir.",
  });
}
