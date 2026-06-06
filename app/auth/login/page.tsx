import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { hasSupabaseEnv } from "@/lib/auth/admin";

export default function LoginPage() {
  const envReady = hasSupabaseEnv();

  return (
    <>
      <header className="topbar">
        <div className="shell nav">
          <Link className="brand" href="/">
            <span className="logo" />
            <span>
              <strong>Co_LAB</strong>
              <span>Admin Girişi</span>
            </span>
          </Link>

          <Link className="adminBtn" href="/">Ziyaretçi Arayüzü</Link>
        </div>
      </header>

      <main className="shell section">
        {!envReady ? (
          <div className="panel">
            <h2>Supabase ayarları eksik</h2>
            <p>
              Admin girişi için `.env.local` dosyasında Supabase değişkenleri tanımlanmalıdır.
            </p>
            <div className="notice">
              Gerekli değerler: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
            </div>
          </div>
        ) : (
          <Suspense fallback={<div className="panel">Giriş formu yükleniyor...</div>}>
            <LoginForm />
          </Suspense>
        )}
      </main>
    </>
  );
}
