 "use client";

import { useEffect, useState } from "react";

type Public3DModel = {
  link_id?: string;
  topic_id?: string;
  area?: string;
  class_level?: string;
  topic_title?: string;
  topic_slug?: string;
  model_id: string;
  sketchfab_uid?: string;
  source_url: string;
  embed_url: string;
  display_name: string;
  educational_name?: string | null;
  description?: string | null;
  thumbnail_url?: string | null;
  author_name?: string | null;
  license?: string | null;
  display_order?: number;
  teacher_note?: string | null;
  student_task?: string | null;
  board_mode?: string;
  default_for_topic?: boolean;
};

export function Topic3DBoard() {
  const [area, setArea] = useState("10. Sınıf");
  const [topicSlug, setTopicSlug] = useState("");
  const [models, setModels] = useState<Public3DModel[]>([]);
  const [activeModelId, setActiveModelId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadModels() {
    setStatus("loading");
    setMessage("");

    try {
      const params = new URLSearchParams();
      if (area !== "Tümü") params.set("area", area);
      if (topicSlug.trim()) params.set("topicSlug", topicSlug.trim());

      const res = await fetch(`/api/public/3d/models?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "3D modeller alınamadı.");

      const items: Public3DModel[] = data.models || [];
      setModels(items);

      const defaultModel = items.find((model) => model.default_for_topic) || items[0];
      setActiveModelId(defaultModel?.model_id || "");

      setStatus("success");

      if (!items.length) {
        setMessage("Bu seçim için yayınlanmış 3D model bulunamadı.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "3D model yükleme hatası.");
    }
  }

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeModel = models.find((model) => model.model_id === activeModelId) || models[0];

  return (
    <div className="panel" id="ucboyuttahta">
      <h3>3D Ders Tahtası</h3>
      <p>Konuya bağlı Sketchfab modelleri burada açılır. Birden fazla model varsa seçim yapabilirsiniz.</p>

      <div className="formGrid noPrint">
        <label>
          Alan / Sınıf
          <select value={area} onChange={(event) => setArea(event.target.value)}>
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
          Konu slug
          <input
            value={topicSlug}
            onChange={(event) => setTopicSlug(event.target.value)}
            placeholder="turkiyede-yer-sekilleri"
          />
        </label>
      </div>

      <div className="actions noPrint">
        <button className="btnLight" onClick={loadModels} disabled={status === "loading"}>
          3D Modelleri Getir
        </button>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      {models.length > 1 && (
        <div className="modelChoiceGrid noPrint">
          {models.map((model) => (
            <button
              key={model.model_id}
              className={activeModel?.model_id === model.model_id ? "modelChoice active" : "modelChoice"}
              onClick={() => setActiveModelId(model.model_id)}
            >
              {model.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={model.thumbnail_url} alt={model.display_name} />
              ) : (
                <span>3D</span>
              )}
              <strong>{model.educational_name || model.display_name}</strong>
            </button>
          ))}
        </div>
      )}

      {activeModel ? (
        <div className="threeDBoardLayout">
          <div className="threeDViewerFrame">
            <iframe
              title={activeModel.educational_name || activeModel.display_name}
              src={activeModel.embed_url}
              allow="autoplay; fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          </div>

          <aside className="threeDTaskPanel">
            <div className="tagRow">
              <span className="tag">{activeModel.area}</span>
              <span className="tag">{activeModel.board_mode || "explore"}</span>
            </div>

            <h4>{activeModel.educational_name || activeModel.display_name}</h4>
            <p>{activeModel.description || "Bu 3D model konu gözlemi için hazırlanmıştır."}</p>

            {activeModel.student_task && (
              <div className="notice">
                <strong>Gözlem Görevi</strong><br />
                {activeModel.student_task}
              </div>
            )}

            <div className="notice">
              Modeli döndür, yakınlaştır ve yüzey/şekil ilişkisini gözlemle. Öğretmen yönergesiyle not al.
            </div>
          </aside>
        </div>
      ) : (
        <div className="notice">3D model seçilmedi.</div>
      )}
    </div>
  );
}
