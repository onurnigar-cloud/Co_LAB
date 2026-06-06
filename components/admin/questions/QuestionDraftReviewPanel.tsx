 "use client";

import { useEffect, useMemo, useState } from "react";

type DraftQuestion = {
  id: string;
  source_title?: string;
  area: string;
  class_level?: string | null;
  topic_title: string;
  difficulty: string;
  question_type: string;
  stem: string;
  options: string[];
  correct_answer?: string | null;
  explanation?: string | null;
  confidence?: number | null;
  needs_review?: boolean;
  approval_status: string;
};

function normalizeOptions(options: unknown): string[] {
  if (Array.isArray(options)) return options.map(String);
  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch {
      return options.split("\n").map((x) => x.trim()).filter(Boolean);
    }
  }
  return [];
}

export function QuestionDraftReviewPanel() {
  const [drafts, setDrafts] = useState<DraftQuestion[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [areaFilter, setAreaFilter] = useState("Tümü");
  const [topicFilter, setTopicFilter] = useState("");

  const selectedCount = selectedIds.length;

  async function loadDrafts() {
    setStatus("loading");
    setMessage("");

    try {
      const params = new URLSearchParams();
      params.set("status", "needs_review");
      params.set("limit", "50");
      if (areaFilter !== "Tümü") params.set("area", areaFilter);
      if (topicFilter.trim()) params.set("topic", topicFilter.trim());

      const res = await fetch(`/api/admin/questions/drafts?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Taslaklar alınamadı.");
      }

      setDrafts((data.drafts || []).map((draft: any) => ({
        ...draft,
        options: normalizeOptions(draft.options),
      })));
      setSelectedIds([]);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Taslaklar yüklenirken hata oluştu.");
    }
  }

  useEffect(() => {
    loadDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSelected(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function updateDraftLocal(id: string, patch: Partial<DraftQuestion>) {
    setDrafts((prev) => prev.map((draft) => draft.id === id ? { ...draft, ...patch } : draft));
  }

  function updateOptionLocal(id: string, optionIndex: number, value: string) {
    setDrafts((prev) => prev.map((draft) => {
      if (draft.id !== id) return draft;
      const options = [...normalizeOptions(draft.options)];
      options[optionIndex] = value;
      return { ...draft, options };
    }));
  }

  async function saveDraft(draft: DraftQuestion) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/questions/drafts/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: draft.id,
          stem: draft.stem,
          options: normalizeOptions(draft.options),
          correctAnswer: draft.correct_answer || null,
          explanation: draft.explanation || null,
          area: draft.area,
          classLevel: draft.class_level || null,
          topicTitle: draft.topic_title,
          difficulty: draft.difficulty,
          questionType: draft.question_type,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Taslak güncellenemedi.");

      setStatus("success");
      setMessage("Taslak güncellendi.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Taslak güncelleme hatası.");
    }
  }

  async function rejectDraft(id: string) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/questions/drafts/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Taslak reddedilemedi.");

      setDrafts((prev) => prev.filter((draft) => draft.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      setStatus("success");
      setMessage("Taslak reddedildi.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Reddetme hatası.");
    }
  }

  async function approveSelected() {
    if (selectedIds.length === 0) {
      setMessage("Önce onaylanacak taslakları seçin.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/questions/drafts/bulk-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftIds: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Toplu onay başarısız.");

      setDrafts((prev) => prev.filter((draft) => !selectedIds.includes(draft.id)));
      setSelectedIds([]);
      setStatus("success");
      setMessage("Seçili taslaklar question_bank tablosuna aktarıldı.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Toplu onay hatası.");
    }
  }

  const stats = useMemo(() => {
    const highConfidence = drafts.filter((draft) => Number(draft.confidence || 0) >= 0.8).length;
    const needsReview = drafts.filter((draft) => draft.needs_review).length;
    return { highConfidence, needsReview };
  }, [drafts]);

  return (
    <div className="panel">
      <h3>Soru Onay Paneli</h3>
      <p>AI’nin çıkardığı sorular burada düzenlenir, reddedilir veya soru havuzuna onaylanarak aktarılır.</p>

      <div className="formGrid">
        <label>
          Alan filtresi
          <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
            <option>Tümü</option>
            <option>9. Sınıf</option>
            <option>10. Sınıf</option>
            <option>11. Sınıf</option>
            <option>12. Sınıf</option>
            <option>TYT</option>
            <option>AYT</option>
          </select>
        </label>

        <label>
          Konu filtresi
          <input value={topicFilter} onChange={(event) => setTopicFilter(event.target.value)} placeholder="Türkiye’de Yer Şekilleri" />
        </label>
      </div>

      <div className="actions">
        <button className="btnLight" onClick={loadDrafts} disabled={status === "loading"}>
          Taslakları Yenile
        </button>
        <button className="btnPrimary" onClick={approveSelected} disabled={status === "loading" || selectedCount === 0}>
          Seçilenleri Onayla ({selectedCount})
        </button>
      </div>

      <div className="tagRow">
        <span className="tag">Toplam taslak: {drafts.length}</span>
        <span className="tag tagPublic">Güven yüksek: {stats.highConfidence}</span>
        <span className="tag tagDraft">Kontrol gerekli: {stats.needsReview}</span>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      <div className="list" style={{ marginTop: 18 }}>
        {drafts.length === 0 && (
          <div className="notice">Kontrol bekleyen soru taslağı yok.</div>
        )}

        {drafts.map((draft, index) => (
          <article className="card" key={draft.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <h3 style={{ margin: 0 }}>Taslak {index + 1}</h3>
              <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(draft.id)}
                  onChange={() => toggleSelected(draft.id)}
                  style={{ width: 18, height: 18 }}
                />
                Onay için seç
              </label>
            </div>

            <div className="formGrid" style={{ marginTop: 14 }}>
              <label className="full">
                Soru kökü
                <textarea
                  value={draft.stem}
                  onChange={(event) => updateDraftLocal(draft.id, { stem: event.target.value })}
                  rows={4}
                />
              </label>

              {normalizeOptions(draft.options).map((option, optionIndex) => (
                <label key={`${draft.id}-option-${optionIndex}`}>
                  Seçenek {String.fromCharCode(65 + optionIndex)}
                  <input value={option} onChange={(event) => updateOptionLocal(draft.id, optionIndex, event.target.value)} />
                </label>
              ))}

              <label>
                Doğru cevap
                <input
                  value={draft.correct_answer || ""}
                  onChange={(event) => updateDraftLocal(draft.id, { correct_answer: event.target.value })}
                  placeholder="A / B / C veya metin cevap"
                />
              </label>

              <label>
                Zorluk
                <select value={draft.difficulty} onChange={(event) => updateDraftLocal(draft.id, { difficulty: event.target.value })}>
                  <option>Kolay</option>
                  <option>Orta</option>
                  <option>Zor</option>
                </select>
              </label>

              <label>
                Alan
                <select value={draft.area} onChange={(event) => updateDraftLocal(draft.id, { area: event.target.value })}>
                  <option>9. Sınıf</option>
                  <option>10. Sınıf</option>
                  <option>11. Sınıf</option>
                  <option>12. Sınıf</option>
                  <option>TYT</option>
                  <option>AYT</option>
                </select>
              </label>

              <label>
                Sınıf düzeyi
                <input
                  value={draft.class_level || ""}
                  onChange={(event) => updateDraftLocal(draft.id, { class_level: event.target.value })}
                  placeholder="9 / 10 / 11 / 12 / TYT / AYT"
                />
              </label>

              <label>
                Konu
                <input
                  value={draft.topic_title}
                  onChange={(event) => updateDraftLocal(draft.id, { topic_title: event.target.value })}
                />
              </label>

              <label>
                Soru tipi
                <select value={draft.question_type} onChange={(event) => updateDraftLocal(draft.id, { question_type: event.target.value })}>
                  <option>Çoktan seçmeli</option>
                  <option>Açık uçlu</option>
                  <option>Doğru yanlış</option>
                  <option>Eşleştirme</option>
                  <option>Kısa cevap</option>
                </select>
              </label>

              <label className="full">
                Açıklama
                <textarea
                  value={draft.explanation || ""}
                  onChange={(event) => updateDraftLocal(draft.id, { explanation: event.target.value })}
                  rows={3}
                />
              </label>
            </div>

            <div className="tagRow">
              <span className="tag">Güven: {Math.round(Number(draft.confidence || 0) * 100)}%</span>
              <span className={draft.needs_review ? "tag tagDraft" : "tag tagPublic"}>
                {draft.needs_review ? "Kontrol gerekli" : "Kontrol tamam"}
              </span>
              <span className="tag tagAdmin">Cevap ziyaretçiden gizli</span>
            </div>

            <div className="actions">
              <button className="btnLight" onClick={() => saveDraft(draft)} disabled={status === "loading"}>
                Değişiklikleri Kaydet
              </button>
              <button className="btnLight" onClick={() => toggleSelected(draft.id)}>
                {selectedIds.includes(draft.id) ? "Seçimi Kaldır" : "Onay İçin Seç"}
              </button>
              <button className="btnSecondary" onClick={() => rejectDraft(draft.id)} disabled={status === "loading"}>
                Reddet
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
