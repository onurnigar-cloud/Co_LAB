 "use client";

import { useEffect, useMemo, useState } from "react";

type PublicPresentation = {
  id: string;
  title: string;
  area: string;
  topic_title: string;
  description?: string | null;
  slide_count: number | null;
  version: string;
  published_at: string;
  download_count?: number | null;
  quality_status?: string | null;
  quality_score?: number | null;
};

export function PublicPresentationLibrary() {
  const [presentations, setPresentations] = useState<PublicPresentation[]>([]);
  const [area, setArea] = useState("Tümü");
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadPresentations() {
    setStatus("loading");
    setMessage("");

    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      if (area !== "Tümü") params.set("area", area);
      if (topic.trim()) params.set("topic", topic.trim());

      const res = await fetch(`/api/public/presentations?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sunumlar alınamadı.");

      setPresentations(data.presentations || []);
      setStatus("success");

      if (!data.presentations?.length) {
        setMessage("Bu seçim için yayında sunum bulunamadı.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sunumlar yüklenirken hata oluştu.");
    }
  }

  useEffect(() => {
    loadPresentations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const areas = useMemo(() => {
    const values = Array.from(new Set(presentations.map((p) => p.area).filter(Boolean)));
    return ["Tümü", ...values];
  }, [presentations]);

  async function downloadPresentation(item: PublicPresentation) {
    setMessage("");

    try {
      const res = await fetch("/api/public/presentations/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicationId: item.id
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "İndirme bağlantısı oluşturulamadı.");

      if (data.result?.url && data.result.url !== "#") {
        window.open(data.result.url, "_blank", "noopener,noreferrer");
      } else {
        setMessage("Yerel modda örnek indirme bağlantısı oluşturuldu.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sunum indirme hatası.");
    }
  }

  return (
    <div className="panel" id="sunumlar">
      <h3>Sunum Kütüphanesi</h3>
      <p>Admin tarafından onaylanmış ve yayına alınmış Co_LAB sunumları burada listelenir.</p>

      <div className="formGrid noPrint">
        <label>
          Alan / Sınıf
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>

        <label>
          Konu arama
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Yer şekilleri, harita..." />
        </label>
      </div>

      <div className="actions noPrint">
        <button className="btnLight" onClick={loadPresentations} disabled={status === "loading"}>
          Sunumları Getir
        </button>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      <div className="presentationLibraryGrid">
        {presentations.map((item) => (
          <article className="presentationPublicCard" key={item.id}>
            <div className="presentationCoverMini">
              <span>Co_LAB</span>
              <strong>{item.area}</strong>
            </div>

            <div>
              <h4>{item.title}</h4>
              <p>{item.description || `${item.topic_title} konusu için hazırlanmış Co_LAB sunumu.`}</p>

              <div className="tagRow">
                <span className="tag">{item.area}</span>
                <span className="tag">{item.topic_title}</span>
                <span className="tag">Slayt: {item.slide_count ?? "—"}</span>
                <span className="tag">İndirme: {item.download_count ?? 0}</span>
                <span className="tag">v{item.version}</span>
              </div>

              <div className="actions">
                <button className="btnPrimary" onClick={() => downloadPresentation(item)}>
                  PPTX İndir
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
