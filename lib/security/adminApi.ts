import { NextResponse } from "next/server";
import { createClient } from "../supabase/server";

export async function requireAdminApi() {
  const envReady = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  // Local kurulumda env yoksa endpoint'leri dokümantasyon/test amaçlı bloke etmiyoruz.
  // Canlı sistemde env mutlaka tanımlı olmalı.
  if (!envReady) {
    return { ok: true, devMode: true, user: null, profile: null };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Giriş gerekli." }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      ok: false,
      response: NextResponse.json({ error: "Admin yetkisi gerekli." }, { status: 403 }),
    };
  }

  return { ok: true, devMode: false, user, profile };
}
