 "use client";

import { useState } from "react";

export function PresentationPublishPanel() {
  const [draftId, setDraftId] = useState("");
  const [description, setDescription] = useState("");
  const [version, setVersion] = useState("1.0");
  const [publicationId, setPublicationId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function publishPresentation() {
    if (!draftId.trim()) {
      setStatus("error");
      setMessage("Yayına almak için sunum taslak ID gereklidir.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          draftId,
          description: description || null,
          version
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sunum yayına alınamadı.");

      const pub = data.result?.publication;
      setPublicationId(pub?.id || "");
      setStatus("success");
      setMessage("Sunum PPTX olarak üretildi, storage alanına yüklendi ve ziyaretçi kütüphanesinde yayına alındı.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Yayınlama hatası.");
    }
  }

  async function unpublishPresentation() {
    if (!publicationId.trim()) {
      setStatus("error");
      setMessage("Yayından kaldırmak için publication ID gereklidir.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/unpublish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicationId
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sunum yayından kaldırılamadı.");

      setStatus("success");
      setMessage("Sunum yayından kaldırıldı.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Yayından kaldırma hatası.");
    }
  }

  return (
    <div className="panel">
      <h3>Sunumu Yayına Al / Yayından Kaldır</h3>
      <p>Önizleme ve kalite kontrolü tamamlanan sunum, PPTX olarak üretilip ziyaretçi kütüphanesinde yayınlanır.</p>

      <div className="formGrid">
        <label>
          Sunum Taslak ID
          <input
            value={draftId}
            onChange={(event) => setDraftId(event.target.value)}
            placeholder="presentation_drafts.id"
          />
        </label>

        <label>
          Sürüm
          <input value={version} onChange={(event) => setVersion(event.target.value)} />
        </label>

        <label className="full">
          Ziyaretçi Açıklaması
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="Bu sunumun ziyaretçiye görünecek kısa açıklaması."
          />
        </label>
      </div>

      <div className="actions">
        <button className="btnPrimary" onClick={publishPresentation} disabled={status === "loading"}>
          Yayına Al
        </button>
      </div>

      {publicationId && (
        <div className="notice">
          <strong>Publication ID:</strong> {publicationId}
        </div>
      )}

      <div className="formGrid" style={{ marginTop: 16 }}>
        <label className="full">
          Yayından Kaldırılacak Publication ID
          <input
            value={publicationId}
            onChange={(event) => setPublicationId(event.target.value)}
            placeholder="presentation_publications.id"
          />
        </label>
      </div>

      <div className="actions">
        <button className="btnSecondary" onClick={unpublishPresentation} disabled={status === "loading"}>
          Yayından Kaldır
        </button>
      </div>

      <div className="notice">
        Yayına alınan sunumda kaynak PDF ve admin taslak süreci görünmez. Ziyaretçi yalnızca onaylı PPTX dosyasını indirir.
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}
    </div>
  );
}
