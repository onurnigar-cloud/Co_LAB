 "use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      router.replace(next);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Giriş sırasında hata oluştu.");
    }
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Admin Girişi</h2>
      <p>Co_LAB admin paneline erişmek için Supabase Auth hesabınızla giriş yapın.</p>

      <div className="formGrid">
        <label className="full">
          E-posta
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
          />
        </label>

        <label className="full">
          Şifre
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
        </label>
      </div>

      {status === "error" && (
        <div className="notice noticeDanger">{message}</div>
      )}

      <div className="actions">
        <button className="btnPrimary" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </div>
    </form>
  );
}
