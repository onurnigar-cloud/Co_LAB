import Link from "next/link";

export function VisitorHeader() {
  return (
    <header className="topbar">
      <div className="shell nav">
        <Link className="brand" href="/">
          <span className="logo" />
          <span>
            <strong>Co_LAB</strong>
            <span>Dijital Coğrafya Laboratuvarı</span>
          </span>
        </Link>

        <nav className="menu">
          <a href="#derslik">Derslik</a>
          <a href="#sunumlar">Sunumlar</a>
          <a href="#testolustur">Test Oluştur</a>
          <a href="#tahta">3D Tahta</a>
          <a href="#cikti">Çıktılar</a>
        </nav>

        <Link className="adminBtn" href="/admin">Admin Paneli</Link>
      </div>
    </header>
  );
}
