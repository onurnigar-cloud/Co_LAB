import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/security/adminApi";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    return NextResponse.json({
      ok: true,
      assets: [],
      localOnly: true,
      note: "Supabase bağlı değil; onaylı görsel listesi boş döndürüldü."
    });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  const supabase = createAdminClient();
  let q = supabase
    .from("web_visual_assets")
    .select("*")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })
    .limit(50);

  if (query) q = q.ilike("title", `%${query}%`);

  const { data, error } = await q;

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    assets: data ?? [],
  });
}
