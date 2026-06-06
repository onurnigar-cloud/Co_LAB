import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";

export function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );
}

export async function getCurrentUserProfile() {
  if (!hasSupabaseEnv()) {
    return {
      user: null,
      profile: null,
      envMissing: true,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      profile: null,
      envMissing: false,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .single();

  return {
    user,
    profile,
    envMissing: false,
  };
}

export async function requireAdmin() {
  const result = await getCurrentUserProfile();

  if (result.envMissing) {
    return result;
  }

  if (!result.user) {
    redirect("/auth/login?next=/admin");
  }

  if (result.profile?.role !== "admin") {
    redirect("/unauthorized");
  }

  return result;
}
