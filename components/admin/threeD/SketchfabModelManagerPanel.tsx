 "use client";

import { useEffect, useState } from "react";

type SketchfabModel = {
  id: string;
  sketchfab_uid: string;
  source_url: string;
  embed_url: string;
  original_title: string | null;
  display_name: string;
  educational_name: string | null;
  description: string | null;
  thumbnail_url: string | null;
  author_name: string | null;
  license: string | null;
  model_status: "draft" | "ready" | "hidden" | "archived";
  visibility: "admin" | "teacher" | "public" | "hidden";
};

export function SketchfabModelManagerPanel() {
  const [profileUrl, setProfileUrl] = useState("https://sketchfab.com/onurnigar/models");
  const [manualUrl, setManualUrl] = useState("https://sketchfab.com/3d-models/plato-95d05c602eab4dcba20b53481c17c70f");
  const [models, setModels] = useState<SketchfabModel[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [studentTask, setStudentTask] = useState("Modeli döndürerek temel yeryüzü şekli özelliklerini gözlemleyin.");
  const [teacherNote, setTeacherNote] = useState("");
  const [boardMode, setBoardMode] = useState<"explore" | "guided_observation" | "compare" | "assessment">("guided_observation");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadModels() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/sketchfab/models?limit=100");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Modeller alınamadı.");

      setModels(data.models || []);
      if (data.models?.[0] && !selectedId) setSelectedId(data.models[0].id);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Model listesi yükleme hatası.");
    }
  }

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function scanProfile() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/sketchfab/profile-models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          profileUrlOrUsername: profileUrl,
          importToLibrary: true
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sketchfab profil taraması başarısız.");

      const warnings = data.scan?.warnings?.length ? ` Uyarı: ${data.scan.warnings.join(" | ")}` : "";
      setMessage(`${data.importedCount || 0} model kütüphaneye alındı.${warnings}`);
      setStatus("success");
      await loadModels();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Profil tarama hatası.");
    }
  }

  async function importManualModel() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/sketchfab/import-model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelUrlOrUid: manualUrl,
          sourceProfileUrl: profileUrl
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Model eklenemedi.");

      setMessage("Model Sketchfab kütüphanesine eklendi. Adını düzenleyip ready/public yapabilirsiniz.");
      setStatus("success");
      await loadModels();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Model ekleme hatası.");
    }
  }

  function updateLocalModel(id: string, patch: Partial<SketchfabModel>) {
    setModels((prev) => prev.map((model) => model.id === id ? { ...model, ...patch } : model));
  }

  async function saveModel(model: SketchfabModel) {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/sketchfab/models/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelId: model.id,
          displayName: model.display_name,
          educationalName: model.educational_name || null,
          description: model.description || null,
          modelStatus: model.model_status,
          visibility: model.visibility
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Model güncellenemedi.");

      setMessage("Model bilgileri güncellendi.");
      setStatus("success");
      await loadModels();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Model kaydetme hatası.");
    }
  }

  async function attachToTopic() {
    if (!selectedId || !topicId) {
      setStatus("error");
      setMessage("Konuya bağlamak için model ve topic ID gereklidir.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/sketchfab/models/attach-topic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          modelId: selectedId,
          topicId,
          studentTask: studentTask || null,
          teacherNote: teacherNote || null,
          boardMode,
          defaultForTopic: true,
          visibility: "public"
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Model konuya bağlanamadı.");

      setMessage("Model konuya bağlandı. Ziyaretçi 3D tahtasında görünebilir.");
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Konuya bağlama hatası.");
    }
  }

  const selected = models.find((model) => model.id === selectedId) || null;

  return (
    <div className="panel">
      <h2>Sketchfab Model Kütüphanesi</h2>
      <p>Modeller varsayılan olarak senin Sketchfab profilinden alınır. İsimlerini burada ders diline göre düzenleyip konulara bağlayabilirsin.</p>

      <div className="grid2">
        <div className="panel innerPanel">
          <h3>Profil Modellerini Tara</h3>
          <div className="formGrid">
            <label className="full">
              Sketchfab Profil Linki
              <input value={profileUrl} onChange={(event) => setProfileUrl(event.target.value)} />
            </label>
          </div>
          <div className="actions">
            <button className="btnPrimary" onClick={scanProfile} disabled={status === "loading"}>
              Profil Modellerini İçe Al
            </button>
          </div>
          <div className="notice">
            Profil taraması API kısıtına takılırsa tek model URL’si ekleme yöntemi kullanılabilir.
          </div>
        </div>

        <div className="panel innerPanel">
          <h3>Tek Model URL Ekle</h3>
          <div className="formGrid">
            <label className="full">
              Model Linki / UID
              <input value={manualUrl} onChange={(event) => setManualUrl(event.target.value)} />
            </label>
          </div>
          <div className="actions">
            <button className="btnLight" onClick={importManualModel} disabled={status === "loading"}>
              Modeli Ekle
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      <div className="modelManagerGrid">
        <aside className="modelList">
          {models.length === 0 && (
            <div className="notice">Henüz model yok.</div>
          )}

          {models.map((model) => (
            <button
              key={model.id}
              className={selectedId === model.id ? "modelListItem active" : "modelListItem"}
              onClick={() => setSelectedId(model.id)}
            >
              <span>{model.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={model.thumbnail_url} alt={model.display_name} />
              ) : "3D"}</span>
              <strong>{model.display_name}</strong>
              <small>{model.model_status} · {model.visibility}</small>
            </button>
          ))}
        </aside>

        <section className="modelEditor">
          {!selected ? (
            <div className="notice">Düzenlenecek model seçin.</div>
          ) : (
            <>
              <div className="sketchfabEmbedPreview">
                <iframe
                  title={selected.display_name}
                  src={selected.embed_url}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                />
              </div>

              <div className="formGrid">
                <label>
                  Görünen Ad
                  <input
                    value={selected.display_name}
                    onChange={(event) => updateLocalModel(selected.id, { display_name: event.target.value })}
                  />
                </label>

                <label>
                  Eğitsel Ad
                  <input
                    value={selected.educational_name || ""}
                    onChange={(event) => updateLocalModel(selected.id, { educational_name: event.target.value })}
                    placeholder="Örn. Plato, Delta, Vadi"
                  />
                </label>

                <label>
                  Durum
                  <select
                    value={selected.model_status}
                    onChange={(event) => updateLocalModel(selected.id, { model_status: event.target.value as any })}
                  >
                    <option>draft</option>
                    <option>ready</option>
                    <option>hidden</option>
                    <option>archived</option>
                  </select>
                </label>

                <label>
                  Görünürlük
                  <select
                    value={selected.visibility}
                    onChange={(event) => updateLocalModel(selected.id, { visibility: event.target.value as any })}
                  >
                    <option>admin</option>
                    <option>teacher</option>
                    <option>public</option>
                    <option>hidden</option>
                  </select>
                </label>

                <label className="full">
                  Açıklama
                  <textarea
                    value={selected.description || ""}
                    onChange={(event) => updateLocalModel(selected.id, { description: event.target.value })}
                    rows={3}
                  />
                </label>
              </div>

              <div className="actions">
                <button className="btnPrimary" onClick={() => saveModel(selected)}>
                  Model Bilgilerini Kaydet
                </button>
                <a className="btnLight" href={selected.source_url} target="_blank" rel="noreferrer">
                  Sketchfab’da Aç
                </a>
              </div>

              <div className="panel innerPanel" style={{ marginTop: 16 }}>
                <h3>Konuya Bağla</h3>
                <div className="formGrid">
                  <label>
                    Topic ID
                    <input
                      value={topicId}
                      onChange={(event) => setTopicId(event.target.value)}
                      placeholder="topics.id"
                    />
                  </label>

                  <label>
                    3D Tahta Modu
                    <select value={boardMode} onChange={(event) => setBoardMode(event.target.value as any)}>
                      <option>explore</option>
                      <option>guided_observation</option>
                      <option>compare</option>
                      <option>assessment</option>
                    </select>
                  </label>

                  <label className="full">
                    Öğrenci Görevi
                    <textarea
                      value={studentTask}
                      onChange={(event) => setStudentTask(event.target.value)}
                      rows={3}
                    />
                  </label>

                  <label className="full">
                    Öğretmen Notu
                    <textarea
                      value={teacherNote}
                      onChange={(event) => setTeacherNote(event.target.value)}
                      rows={3}
                    />
                  </label>
                </div>

                <div className="actions">
                  <button className="btnPrimary" onClick={attachToTopic}>
                    Seçili Modeli Konuya Bağla
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
