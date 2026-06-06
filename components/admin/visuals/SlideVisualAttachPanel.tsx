 "use client";

import { useState } from "react";

type ApprovedAsset = {
  id: string;
  title: string;
  provider: string;
  thumbnail_url: string | null;
  image_url: string | null;
  source_url: string | null;
  license: string | null;
  attribution_text: string;
};

export function SlideVisualAttachPanel() {
  const [draftId, setDraftId] = useState("");
  const [slideNumber, setSlideNumber] = useState(1);
  const [usageNote, setUsageNote] = useState("");
  const [assets, setAssets] = useState<ApprovedAsset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadApprovedAssets() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/visuals/list-approved");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Onaylı görseller alınamadı.");

      setAssets(data.assets || []);
      setStatus("success");

      if (data.assets?.[0]) {
        setSelectedAssetId(data.assets[0].id);
      }

      if (!data.assets?.length) {
        setMessage("Onaylı görsel bulunamadı. Önce web görsel arama panelinden uygun bir görsel kaydedin.");
      }
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Görseller alınırken hata oluştu.");
    }
  }

  async function attachVisual() {
    if (!draftId || !selectedAssetId) {
      setStatus("error");
      setMessage("Sunum taslak ID ve görsel seçimi gereklidir.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/visuals/attach-to-slide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          presentationDraftId: draftId,
          slideNumber,
          visualAssetId: selectedAssetId,
          usageNote: usageNote || null
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Görsel slayta bağlanamadı.");

      setStatus("success");
      setMessage("Görsel slayta bağlandı. PPTX export sırasında görsel slayta gömülecek.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Görsel bağlama hatası.");
    }
  }

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  return (
    <div className="panel">
      <h3>Onaylı Görseli Slayta Bağla</h3>
      <p>Kaydedilmiş web görselleri belirli bir sunum taslağındaki slayta bağlanır. PPTX export sırasında görsel ve atıf slayta gömülür.</p>

      <div className="formGrid">
        <label className="full">
          Sunum Taslak ID
          <input
            value={draftId}
            onChange={(event) => setDraftId(event.target.value)}
            placeholder="presentation_drafts.id"
          />
        </label>

        <label>
          Slayt Numarası
          <input
            type="number"
            min={1}
            value={slideNumber}
            onChange={(event) => setSlideNumber(Number(event.target.value))}
          />
        </label>

        <label>
          Onaylı Görsel
          <select value={selectedAssetId} onChange={(event) => setSelectedAssetId(event.target.value)}>
            <option value="">Görsel seç</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.title}
              </option>
            ))}
          </select>
        </label>

        <label className="full">
          Kullanım Notu
          <input
            value={usageNote}
            onChange={(event) => setUsageNote(event.target.value)}
            placeholder="Örn. Slayt 4 harita analizi görseli"
          />
        </label>
      </div>

      <div className="actions">
        <button className="btnLight" onClick={loadApprovedAssets} disabled={status === "loading"}>
          Onaylı Görselleri Yükle
        </button>
        <button className="btnPrimary" onClick={attachVisual} disabled={status === "loading"}>
          Slayta Bağla
        </button>
      </div>

      {selectedAsset && (
        <div className="visualCard" style={{ marginTop: 14 }}>
          <div className="visualThumb">
            {selectedAsset.thumbnail_url || selectedAsset.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={selectedAsset.thumbnail_url || selectedAsset.image_url || ""} alt={selectedAsset.title} />
            ) : (
              <span>Önizleme yok</span>
            )}
          </div>
          <div className="visualBody">
            <h4>{selectedAsset.title}</h4>
            <div className="tagRow">
              <span className="tag">{selectedAsset.provider}</span>
              <span className="tag">{selectedAsset.license || "Lisans kontrol"}</span>
            </div>
            <div className="notice">
              <strong>Atıf:</strong><br />
              {selectedAsset.attribution_text}
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}
    </div>
  );
}
