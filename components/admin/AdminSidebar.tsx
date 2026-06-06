import Link from "next/link";

export function AdminSidebar() {
  return (
    <aside className="adminSide">
      <Link className="brand" href="/">
        <span className="logo" />
        <span>
          <strong>Co_LAB</strong>
          <span>Admin Paneli</span>
        </span>
      </Link>

      <nav className="adminNav" style={{ marginTop: 24 }}>
        <a href="#dashboard">Genel Bakış</a>
        <a href="#archive">AI Kütüphane / Arşiv</a>
        <a href="#sources">Kaynak PDF / Drive</a>
        <a href="#questions">Soru Havuzu</a>
        <a href="#presentations">AI Sunum Üretici</a>
        <a href="#security">Cevap Anahtarı Güvenliği</a>
        <a href="/auth/logout">Çıkış Yap</a>
      </nav>

      <div className="notice" style={{ marginTop: 18 }}>
        Bu panel v2.1 iskeletidir. Gerçek auth, Supabase ve OpenAI entegrasyonu sonraki sürümlerde bağlanacaktır.
      </div>
    </aside>
  );
}
