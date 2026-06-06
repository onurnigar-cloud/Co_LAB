import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <>
      <header className="topbar">
        <div className="shell nav">
          <Link className="brand" href="/">
            <span className="logo" />
            <span>
              <strong>Co_LAB</strong>
              <span>Yetkisiz Erişim</span>
            </span>
          </Link>

          <Link className="adminBtn" href="/">Ziyaretçi Arayüzü</Link>
        </div>
      </header>

      <main className="shell section">
        <div className="panel">
          <h2>Bu alana erişim yetkiniz yok</h2>
          <p>Admin paneline yalnızca `admin` rolüne sahip kullanıcılar erişebilir.</p>
          <div className="actions">
            <Link className="btnLight" href="/auth/login">Farklı hesapla giriş yap</Link>
            <Link className="btnLight" href="/">Ana sayfaya dön</Link>
          </div>
        </div>
      </main>
    </>
  );
}
