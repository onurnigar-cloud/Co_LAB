 "use client";

import { useEffect, useMemo, useState } from "react";

type Publication = {
  id: string;
  title: string;
  area: string;
  topic_title: string;
  version: string;
  visibility: "public" | "teacher" | "hidden";
  publication_status: "published" | "hidden" | "archived";
  quality_status: "needs_review" | "approved" | "warning" | "failed";
  quality_score: number;
  slide_count: number | null;
  download_count: number;
  published_at: string;
  last_downloaded_at?: string | null;
};

const CHECK_ITEMS = [
  ["sourceCovered", "Kaynak metindeki temel kavramlar atlanmadı"],
  ["visualQuality", "Görseller konuya uygun ve kaliteli"],
  ["attributionChecked", "Web görsellerinde lisans/atıf kontrol edildi"],
  ["teacherNotesReady", "Öğretmen notları yeterli"],
  ["studentTasksReady", "Öğrenci görevleri/etkileşim alanları uygun"],
  ["formalDesign", "Resmi-modern Co_LAB tasarım dili korunuyor"],
  ["downloadTested", "PPTX indirme testi yapıldı"],
  ["visitorSafe", "Kaynak PDF/admin/AI süreci ziyaretçiye görünmüyor"],
] as const;

export function PublicationQualityPanel() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [area, setArea] = useState("Tümü");
  const [statusFilter, setStatusFilter] = useState("Tümü");
  const [topic, setTopic] = useState("");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [reviewerNote, setReviewerNote] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadAnalytics() {
    try {
      const res = await fetch("/api/admin/presentations/analytics");
      const data = await res.json();
      if (res.ok) setSummary(data.summary);
    } catch {
      // Sessiz geç.
    }
  }

  async function loadPublications() {
    setStatus("loading");
    setMessage("");

    try {
      const params = new URLSearchParams();
      params.set("limit", "100");
      if (area !== "Tümü") params.set("area", area);
      if (statusFilter !== "Tümü") params.set("status", statusFilter);
      if (topic.trim()) params.set("topic", topic.trim());

      const res = await fetch(`/api/admin/presentations/publications?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Yayınlar alınamadı.");

      setPublications(data.publications || []);
      setSelectedId(data.publications?.[0]?.id || selectedId);
      setStatus("success");
      await loadAnalytics();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Yayınları yükleme hatası.");
    }
  }

  useEffect(() => {
    loadPublications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selected = publications.find((item) => item.id === selectedId) || null;

  const areas = useMemo(() => {
    const values = Array.from(new Set(publications.map((p) => p.area).filter(Boolean)));
    return ["Tümü", ...values];
  }, [publications]);

  function toggleCheck(key: string) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function saveQualityCheck() {
    if (!selected) {
      setStatus("error");
      setMessage("Önce bir yayın seçin.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/publications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicationId: selected.id,
          checklist,
          reviewerNote: reviewerNote || null,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kalite kontrol kaydedilemedi.");

      setStatus("success");
      setMessage(`Kalite kontrol kaydedildi. Puan: ${data.result?.score ?? "—"}`);
      await loadPublications();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Kalite kontrol hatası.");
    }
  }

  async function updateStatus(visibility: "public" | "teacher" | "hidden", publicationStatus: "published" | "hidden" | "archived") {
    if (!selected) {
      setStatus("error");
      setMessage("Önce bir yayın seçin.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/publications/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          publicationId: selected.id,
          visibility,
          publicationStatus,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Yayın durumu güncellenemedi.");

      setStatus("success");
      setMessage("Yayın görünürlüğü/durumu güncellendi.");
      await loadPublications();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Durum güncelleme hatası.");
    }
  }

  return (
    <div className="panel">
      <h3>Yayın Kalite Paneli ve Sürüm Yönetimi</h3>
      <p>Yayındaki sunumları, kalite puanlarını, görünürlük durumunu ve indirme istatistiklerini buradan yönetin.</p>

      {summary && (
        <div className="publicationStatsGrid">
          <div className="qualityBox">
            <strong>{summary.totalPublications ?? 0}</strong>
            <span>Toplam yayın</span>
          </div>
          <div className="qualityBox">
            <strong>{summary.published ?? 0}</strong>
            <span>Yayında</span>
          </div>
          <div className="qualityBox">
            <strong>{summary.hidden ?? 0}</strong>
            <span>Gizli</span>
          </div>
          <div className="qualityBox">
            <strong>{summary.totalDownloads ?? 0}</strong>
            <span>İndirme</span>
          </div>
          <div className="qualityBox">
            <strong>{summary.averageQualityScore ?? 0}</strong>
            <span>Ortalama kalite</span>
          </div>
        </div>
      )}

      <div className="formGrid" style={{ marginTop: 16 }}>
        <label>
          Alan
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>

        <label>
          Yayın Durumu
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option>Tümü</option>
            <option>published</option>
            <option>hidden</option>
            <option>archived</option>
          </select>
        </label>

        <label>
          Konu
          <input value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="Harita, yer şekilleri..." />
        </label>
      </div>

      <div className="actions">
        <button className="btnLight" onClick={loadPublications} disabled={status === "loading"}>
          Yayınları Yenile
        </button>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      <div className="publicationManagerGrid">
        <div className="publicationTable">
          {publications.length === 0 && (
            <div className="notice">Yönetilecek yayın bulunamadı.</div>
          )}

          {publications.map((item) => (
            <button
              key={item.id}
              className={item.id === selectedId ? "publicationRow active" : "publicationRow"}
              onClick={() => setSelectedId(item.id)}
            >
              <div>
                <strong>{item.title}</strong>
                <span>{item.area} · {item.topic_title} · v{item.version}</span>
              </div>
              <div className="publicationMiniStats">
                <span>{item.publication_status}</span>
                <span>Kalite: {item.quality_score}</span>
                <span>İndirme: {item.download_count ?? 0}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="publicationDetail">
          {!selected ? (
            <div className="notice">Bir yayın seçin.</div>
          ) : (
            <>
              <div className="card">
                <h3>{selected.title}</h3>
                <p>{selected.area} · {selected.topic_title}</p>
                <div className="tagRow">
                  <span className="tag">{selected.publication_status}</span>
                  <span className="tag">{selected.visibility}</span>
                  <span className="tag">Kalite: {selected.quality_score}</span>
                  <span className="tag">İndirme: {selected.download_count ?? 0}</span>
                  <span className="tag">Slayt: {selected.slide_count ?? "—"}</span>
                </div>
              </div>

              <div className="card">
                <h3>Yayın Kalite Checklist</h3>
                <div className="qualityChecklist">
                  {CHECK_ITEMS.map(([key, label]) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={Boolean(checklist[key])}
                        onChange={() => toggleCheck(key)}
                      />
                      {label}
                    </label>
                  ))}
                </div>

                <label className="full">
                  İnceleme Notu
                  <textarea
                    value={reviewerNote}
                    onChange={(event) => setReviewerNote(event.target.value)}
                    rows={3}
                    placeholder="Yayın kalite değerlendirme notu..."
                  />
                </label>

                <div className="actions">
                  <button className="btnPrimary" onClick={saveQualityCheck} disabled={status === "loading"}>
                    Kalite Kontrolü Kaydet
                  </button>
                </div>
              </div>

              <div className="card">
                <h3>Görünürlük / Yayın Durumu</h3>
                <div className="actions">
                  <button className="btnPrimary" onClick={() => updateStatus("public", "published")}>
                    Public Yayında
                  </button>
                  <button className="btnLight" onClick={() => updateStatus("hidden", "hidden")}>
                    Gizle
                  </button>
                  <button className="btnSecondary" onClick={() => updateStatus("hidden", "archived")}>
                    Arşivle
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
