 "use client";

import { useState } from "react";

type WebVisualCandidate = {
  provider: "wikimedia" | "nasa" | "openverse";
  title: string;
  query: string;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  creator: string | null;
  license: string | null;
  licenseUrl: string | null;
  attributionText: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
  slideFitNote?: string | null;
};

export function WebVisualSearchPanel() {
  const [query, setQuery] = useState("Türkiye yer şekilleri plato vadi delta");
  const [provider, setProvider] = useState<"all" | "wikimedia" | "nasa" | "openverse">("all");
  const [limit, setLimit] = useState(8);
  const [results, setResults] = useState<WebVisualCandidate[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function searchVisuals() {
    setStatus("loading");
    setMessage("");
    setResults([]);

    try {
      const res = await fetch("/api/admin/visuals/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          provider,
          limit
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Görsel arama başarısız.");

      setResults(data.results || []);
      setStatus("success");

      if (!data.results?.length) {
        setMessage("Uygun görsel bulunamadı. Arama terimini daha genel yazın.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Görsel arama hatası.");
    }
  }

  async function approveVisual(candidate: WebVisualCandidate) {
    setMessage("");

    try {
      const res = await fetch("/api/admin/visuals/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ candidate })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Görsel onaylanamadı.");

      setMessage("Görsel atıf bilgisiyle kaydedildi. Sunum slaydına iliştirme sonraki seçim adımında yapılabilir.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Görsel onaylama hatası.");
    }
  }

  function copyAttribution(text: string) {
    navigator.clipboard.writeText(text);
    setMessage("Atıf metni kopyalandı.");
  }

  return (
    <div className="panel">
      <h3>Web Görsel Arama ve Atıf Kontrolü</h3>
      <p>Uygun görseller Wikimedia Commons, NASA Images ve Openverse gibi açık/atıflı kaynaklardan aranır. Nihai kullanım için admin lisans ve kaynak kontrolü yapar.</p>

      <div className="formGrid">
        <label className="full">
          Arama Terimi
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>

        <label>
          Kaynak
          <select value={provider} onChange={(event) => setProvider(event.target.value as any)}>
            <option value="all">Tümü</option>
            <option value="wikimedia">Wikimedia Commons</option>
            <option value="nasa">NASA Images</option>
            <option value="openverse">Openverse</option>
          </select>
        </label>

        <label>
          Sonuç Sayısı
          <select value={limit} onChange={(event) => setLimit(Number(event.target.value))}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </label>
      </div>

      <div className="actions">
        <button className="btnPrimary" onClick={searchVisuals} disabled={status === "loading"}>
          {status === "loading" ? "Görseller aranıyor..." : "Web’de Görsel Ara"}
        </button>
      </div>

      <div className="notice">
        Kaynak görsel doğrudan otomatik kullanılmaz. Önce kalite, konu uyumu, lisans ve atıf bilgisi admin tarafından kontrol edilir.
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      <div className="visualGrid">
        {results.map((item, index) => (
          <article className="visualCard" key={`${item.provider}-${item.imageUrl}-${index}`}>
            <div className="visualThumb">
              {item.thumbnailUrl || item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnailUrl || item.imageUrl || ""} alt={item.title} />
              ) : (
                <span>Önizleme yok</span>
              )}
            </div>

            <div className="visualBody">
              <h4>{item.title}</h4>
              <p>{item.description || item.slideFitNote || "Açıklama bulunamadı."}</p>

              <div className="tagRow">
                <span className="tag">{item.provider}</span>
                <span className="tag">{item.license || "Lisans kontrol"}</span>
                {item.creator && <span className="tag">{item.creator}</span>}
              </div>

              <div className="notice">
                <strong>Atıf:</strong><br />
                {item.attributionText}
              </div>

              <div className="actions">
                {item.sourceUrl && (
                  <a className="btnLight" href={item.sourceUrl} target="_blank" rel="noreferrer">
                    Kaynağı Aç
                  </a>
                )}
                <button className="btnLight" onClick={() => copyAttribution(item.attributionText)}>
                  Atıf Kopyala
                </button>
                <button className="btnPrimary" onClick={() => approveVisual(item)}>
                  Uygun Görsel Olarak Kaydet
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
