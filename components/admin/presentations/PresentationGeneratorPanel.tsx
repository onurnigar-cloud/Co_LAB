 "use client";

import { FormEvent, useState } from "react";

type SlideDraft = {
  slideNumber: number;
  title: string;
  layout: string;
  bulletPoints: string[];
  teacherNotes: string;
  studentTask: string | null;
  suggestedVisual: string | null;
  mapOr3DLinkNeeded: boolean;
  coverageTags: string[];
  visualPrompt?: string | null;
  iconPrompt?: string | null;
  animationPreset?: string;
  designNote?: string;
};

type PresentationResult = {
  presentationTitle: string;
  area: string;
  topicTitle: string;
  sourceSummary: string;
  mainConcepts: string[];
  subConcepts: string[];
  coverageChecklist: Array<{
    item: string;
    status: string;
    note: string;
  }>;
  missingConcepts: string[];
  suggestedSlideCount: number;
  slides: SlideDraft[];
  overallCoverageStatus: string;
  adminReviewNote: string;
};

export function PresentationGeneratorPanel() {
  const [sourceTitle, setSourceTitle] = useState("10. Sınıf Coğrafya Ders Notu");
  const [sourceId, setSourceId] = useState("");
  const [areaHint, setAreaHint] = useState("10. Sınıf");
  const [topicHint, setTopicHint] = useState("Türkiye’de Yer Şekilleri");
  const [presentationType, setPresentationType] = useState("Ayrıntılı ders anlatım sunumu");
  const [targetSlideCount, setTargetSlideCount] = useState(24);
  const [manualText, setManualText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<PresentationResult | null>(null);
  const [draftId, setDraftId] = useState<string>("");

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setResult(null);
    setDraftId("");

    try {
      const res = await fetch("/api/admin/presentations/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sourceTitle,
          sourceId: sourceId || undefined,
          areaHint,
          topicHint,
          presentationType,
          manualText: manualText || undefined,
          targetSlideCount
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sunum taslağı üretilemedi.");

      setResult(data.result);
      setDraftId(data.saved?.draft?.id || "");
      setStatus("success");
      setMessage("Sunum taslağı admin kontrolüne kaydedildi.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sunum üretimi sırasında hata oluştu.");
    }
  }

  const missingCount = result?.missingConcepts?.length ?? 0;

  async function downloadPptx() {
    if (!result) return;

    try {
      const res = await fetch("/api/admin/presentations/export-pptx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(
          draftId
            ? { draftId }
            : { draft: result }
        )
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "PPTX indirilemedi.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.presentationTitle.replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ]+/g, "-")}-CoLAB.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "PPTX indirme sırasında hata oluştu.");
    }
  }

  return (
    <div className="grid2">
      <form className="panel" onSubmit={handleGenerate}>
        <h3>AI Sunum Taslağı Üretici</h3>
        <p>PDF metni veya source_chunks üzerinden kapsam kontrollü ders sunumu taslağı oluşturur. Onaylanmadan ziyaretçiye açılmaz.</p>

        <div className="formGrid">
          <label className="full">
            Kaynak Başlığı
            <input value={sourceTitle} onChange={(event) => setSourceTitle(event.target.value)} />
          </label>

          <label>
            Source ID
            <input value={sourceId} onChange={(event) => setSourceId(event.target.value)} placeholder="Supabase source id" />
          </label>

          <label>
            Alan / Sınıf
            <select value={areaHint} onChange={(event) => setAreaHint(event.target.value)}>
              <option>9. Sınıf</option>
              <option>10. Sınıf</option>
              <option>11. Sınıf</option>
              <option>12. Sınıf</option>
              <option>TYT</option>
              <option>AYT</option>
            </select>
          </label>

          <label>
            Konu
            <input value={topicHint} onChange={(event) => setTopicHint(event.target.value)} />
          </label>

          <label>
            Sunum Türü
            <select value={presentationType} onChange={(event) => setPresentationType(event.target.value)}>
              <option>Ayrıntılı ders anlatım sunumu</option>
              <option>Harita yorumlama sunumu</option>
              <option>Sınav tekrar sunumu</option>
              <option>3D model destekli sunum</option>
              <option>Etkinlik temelli sunum</option>
            </select>
          </label>

          <label>
            Hedef Slayt Sayısı
            <select value={targetSlideCount} onChange={(event) => setTargetSlideCount(Number(event.target.value))}>
              <option value={12}>12</option>
              <option value={18}>18</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
              <option value={40}>40</option>
            </select>
          </label>

          <label className="full">
            Manuel Metin / Test Alanı
            <textarea
              value={manualText}
              onChange={(event) => setManualText(event.target.value)}
              rows={8}
              placeholder="sourceId yoksa test etmek için konu metni buraya yapıştırılabilir."
            />
          </label>
        </div>

        <div className="actions">
          <button className="btnPrimary" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sunum taslağı üretiliyor..." : "Sunum Taslağı Üret"}
          </button>
          <button className="btnLight" type="button" disabled={!result} onClick={downloadPptx}>
            PPTX İndir
          </button>
        </div>

        <div className="notice">
          Bu aşama PPTX dosyası üretmez; önce kapsam kontrollü slayt iskeleti üretir. PPTX/Google Slides çıktısı sonraki sürümde bağlanacaktır.
        </div>

        {message && (
          <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
        )}
      </form>

      <div className="panel">
        <h3>Sunum Taslağı / Kapsam Kontrolü</h3>

        {!result && (
          <div className="notice">Henüz sunum taslağı üretilmedi.</div>
        )}

        {result && (
          <div className="list">
            <div className="card">
              <h3>{result.presentationTitle}</h3>
              <p>{result.area} · {result.topicTitle}</p>
              <div className="tagRow">
                {draftId && <span className="tag tagPublic">Sunum taslak ID: {draftId}</span>}
                <span className="tag">Slayt: {result.suggestedSlideCount}</span>
                <span className={result.overallCoverageStatus === "complete" ? "tag tagPublic" : "tag tagDraft"}>
                  {result.overallCoverageStatus}
                </span>
                <span className={missingCount > 0 ? "tag tagAdmin" : "tag tagPublic"}>
                  Eksik kavram: {missingCount}
                </span>
              </div>
            </div>

            <div className="card">
              <h3>Kaynak Özeti</h3>
              <p>{result.sourceSummary}</p>
            </div>

            <div className="card">
              <h3>Ana Kavramlar</h3>
              <p>{result.mainConcepts.join(", ")}</p>
            </div>

            <div className="card">
              <h3>Kapsam Kontrolü</h3>
              <div className="list">
                {result.coverageChecklist.map((item, index) => (
                  <div className="notice" key={`${item.item}-${index}`}>
                    <strong>{item.item}</strong><br />
                    Durum: {item.status}<br />
                    {item.note}
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Slayt İskeleti</h3>
              <div className="list">
                {result.slides.map((slide) => (
                  <article className="card" key={slide.slideNumber}>
                    <h3>{slide.slideNumber}. {slide.title}</h3>
                    <p>{slide.bulletPoints.join(" · ")}</p>
                    <div className="tagRow">
                      <span className="tag">{slide.layout}</span>
                      {slide.animationPreset && <span className="tag tagPublic">Animasyon: {slide.animationPreset}</span>}
                      {slide.mapOr3DLinkNeeded && <span className="tag tagDraft">Harita / 3D gerekli</span>}
                    </div>
                    {slide.visualPrompt && (
                      <div className="notice">
                        <strong>Görsel prompt:</strong><br />
                        {slide.visualPrompt}
                      </div>
                    )}
                    {slide.designNote && (
                      <div className="notice">
                        <strong>Tasarım notu:</strong><br />
                        {slide.designNote}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>

            <div className="notice">
              {result.adminReviewNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
