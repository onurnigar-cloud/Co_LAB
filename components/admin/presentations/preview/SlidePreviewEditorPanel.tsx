 "use client";

import { useMemo, useState } from "react";

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

type VisualRow = {
  slide_number: number;
  usage_note?: string | null;
  web_visual_assets?: {
    title: string;
    image_url: string | null;
    thumbnail_url: string | null;
    attribution_text: string;
    license?: string | null;
  } | null;
};

type DraftRecord = {
  id: string;
  presentation_title: string;
  area: string;
  topic_title: string;
  source_summary?: string | null;
  main_concepts?: string[];
  sub_concepts?: string[];
  missing_concepts?: string[];
  slides: SlideDraft[];
  overall_coverage_status: string;
  admin_review_note?: string | null;
};

function normalizeSlides(slides: unknown): SlideDraft[] {
  if (!Array.isArray(slides)) return [];

  return slides.map((slide: any, index) => ({
    slideNumber: Number(slide.slideNumber || index + 1),
    title: String(slide.title || `Slayt ${index + 1}`),
    layout: String(slide.layout || "concept_explanation"),
    bulletPoints: Array.isArray(slide.bulletPoints) ? slide.bulletPoints.map(String) : [],
    teacherNotes: String(slide.teacherNotes || ""),
    studentTask: slide.studentTask ?? null,
    suggestedVisual: slide.suggestedVisual ?? null,
    mapOr3DLinkNeeded: Boolean(slide.mapOr3DLinkNeeded),
    coverageTags: Array.isArray(slide.coverageTags) ? slide.coverageTags.map(String) : [],
    visualPrompt: slide.visualPrompt ?? null,
    iconPrompt: slide.iconPrompt ?? null,
    animationPreset: slide.animationPreset || "softFadeSequence",
    designNote: slide.designNote || "",
  }));
}

export function SlidePreviewEditorPanel() {
  const [draftId, setDraftId] = useState("");
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const [slides, setSlides] = useState<SlideDraft[]>([]);
  const [visuals, setVisuals] = useState<VisualRow[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [message, setMessage] = useState("");

  async function loadDraft() {
    if (!draftId.trim()) {
      setStatus("error");
      setMessage("Sunum taslak ID gereklidir.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/drafts/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ draftId })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Sunum taslağı alınamadı.");

      setDraft(data.draft);
      setSlides(normalizeSlides(data.draft?.slides));
      setVisuals(data.visuals || []);
      setActiveIndex(0);
      setStatus("success");
      setMessage("Sunum taslağı yüklendi.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Sunum taslağı yükleme hatası.");
    }
  }

  const activeSlide = slides[activeIndex];
  const activeVisual = useMemo(() => {
    if (!activeSlide) return null;
    return visuals.find((item) => Number(item.slide_number) === Number(activeSlide.slideNumber)) || null;
  }, [activeSlide, visuals]);

  const quality = useMemo(() => {
    const total = slides.length || 1;
    const withVisual = slides.filter((slide) =>
      visuals.some((v) => Number(v.slide_number) === Number(slide.slideNumber)) || slide.suggestedVisual
    ).length;
    const withTask = slides.filter((slide) => slide.studentTask).length;
    const withNotes = slides.filter((slide) => slide.teacherNotes?.trim()).length;
    const missingTitle = slides.filter((slide) => !slide.title.trim()).length;
    const missingContent = slides.filter((slide) => slide.bulletPoints.length === 0).length;

    return {
      visualRate: Math.round((withVisual / total) * 100),
      taskRate: Math.round((withTask / total) * 100),
      notesRate: Math.round((withNotes / total) * 100),
      missingTitle,
      missingContent,
    };
  }, [slides, visuals]);

  function updateSlide(index: number, patch: Partial<SlideDraft>) {
    setSlides((prev) => prev.map((slide, i) => i === index ? { ...slide, ...patch } : slide));
  }

  function updateBullet(index: number, bulletIndex: number, value: string) {
    setSlides((prev) => prev.map((slide, i) => {
      if (i !== index) return slide;
      const bulletPoints = [...slide.bulletPoints];
      bulletPoints[bulletIndex] = value;
      return { ...slide, bulletPoints };
    }));
  }

  function addBullet(index: number) {
    setSlides((prev) => prev.map((slide, i) => {
      if (i !== index) return slide;
      return { ...slide, bulletPoints: [...slide.bulletPoints, "Yeni madde"] };
    }));
  }

  function removeBullet(index: number, bulletIndex: number) {
    setSlides((prev) => prev.map((slide, i) => {
      if (i !== index) return slide;
      return { ...slide, bulletPoints: slide.bulletPoints.filter((_, b) => b !== bulletIndex) };
    }));
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];

    const normalized = next.map((slide, i) => ({ ...slide, slideNumber: i + 1 }));
    setSlides(normalized);
    setActiveIndex(target);
  }

  function duplicateSlide(index: number) {
    const source = slides[index];
    const next = [
      ...slides.slice(0, index + 1),
      {
        ...source,
        title: `${source.title} - Kopya`,
        slideNumber: index + 2,
      },
      ...slides.slice(index + 1)
    ].map((slide, i) => ({ ...slide, slideNumber: i + 1 }));

    setSlides(next);
    setActiveIndex(index + 1);
  }

  function deleteSlide(index: number) {
    const next = slides
      .filter((_, i) => i !== index)
      .map((slide, i) => ({ ...slide, slideNumber: i + 1 }));

    setSlides(next);
    setActiveIndex(Math.max(0, Math.min(index, next.length - 1)));
  }

  async function savePreview() {
    if (!draft) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/admin/presentations/drafts/save-preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          draftId: draft.id,
          presentationTitle: draft.presentation_title,
          slides,
          adminReviewNote: draft.admin_review_note || "",
          overallCoverageStatus: draft.overall_coverage_status || "needs_review"
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Önizleme düzenlemeleri kaydedilemedi.");

      setStatus("success");
      setMessage("Slayt düzenlemeleri kaydedildi.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Kaydetme hatası.");
    }
  }

  async function downloadEditedPptx() {
    if (!draft) return;

    try {
      const exportDraft = {
        presentationTitle: draft.presentation_title,
        area: draft.area,
        topicTitle: draft.topic_title,
        sourceSummary: draft.source_summary || "",
        mainConcepts: draft.main_concepts || [],
        subConcepts: draft.sub_concepts || [],
        missingConcepts: draft.missing_concepts || [],
        suggestedSlideCount: slides.length,
        slides,
        overallCoverageStatus: draft.overall_coverage_status || "needs_review",
        adminReviewNote: draft.admin_review_note || ""
      };

      const res = await fetch("/api/admin/presentations/export-pptx", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ draft: exportDraft })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "PPTX export başarısız.");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${draft.presentation_title.replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ]+/g, "-")}-CoLAB-preview.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "PPTX indirme hatası.");
    }
  }

  return (
    <div className="panel">
      <h3>Slayt Önizleme ve Kalite Kontrol Editörü</h3>
      <p>PPTX indirmeden önce slayt başlıkları, maddeler, görevler, görseller ve sıra burada kontrol edilir.</p>

      <div className="formGrid">
        <label className="full">
          Sunum Taslak ID
          <input
            value={draftId}
            onChange={(event) => setDraftId(event.target.value)}
            placeholder="presentation_drafts.id"
          />
        </label>
      </div>

      <div className="actions">
        <button className="btnLight" onClick={loadDraft} disabled={status === "loading"}>
          Taslağı Yükle
        </button>
        <button className="btnLight" onClick={savePreview} disabled={!draft || status === "loading"}>
          Düzenlemeleri Kaydet
        </button>
        <button className="btnPrimary" onClick={downloadEditedPptx} disabled={!draft}>
          Önizlenen Sürümü PPTX İndir
        </button>
      </div>

      {message && (
        <div className={status === "error" ? "notice noticeDanger" : "notice"}>{message}</div>
      )}

      {draft && (
        <div className="previewQualityGrid">
          <div className="qualityBox">
            <strong>{slides.length}</strong>
            <span>Slayt</span>
          </div>
          <div className="qualityBox">
            <strong>{quality.visualRate}%</strong>
            <span>Görsel destek</span>
          </div>
          <div className="qualityBox">
            <strong>{quality.taskRate}%</strong>
            <span>Öğrenci görevi</span>
          </div>
          <div className="qualityBox">
            <strong>{quality.notesRate}%</strong>
            <span>Öğretmen notu</span>
          </div>
          <div className={quality.missingContent ? "qualityBox danger" : "qualityBox"}>
            <strong>{quality.missingContent}</strong>
            <span>İçeriği eksik</span>
          </div>
        </div>
      )}

      {draft && (
        <div className="slideEditorLayout">
          <aside className="slideNavigator">
            {slides.map((slide, index) => (
              <button
                key={`${slide.slideNumber}-${slide.title}`}
                className={index === activeIndex ? "slideNavItem active" : "slideNavItem"}
                onClick={() => setActiveIndex(index)}
              >
                <span>{slide.slideNumber}</span>
                <strong>{slide.title}</strong>
                <small>{slide.layout}</small>
              </button>
            ))}
          </aside>

          <section className="slidePreviewWorkspace">
            {activeSlide ? (
              <>
                <div className="slidePreviewCard">
                  <div className="slidePreviewTop">
                    <span>Co_LAB</span>
                    <em>{draft.area}</em>
                  </div>

                  <div className="slidePreviewBody">
                    <div className="slidePreviewContent">
                      <h2>{activeSlide.title}</h2>
                      <ul>
                        {activeSlide.bulletPoints.map((bullet, index) => (
                          <li key={`${activeSlide.slideNumber}-bullet-${index}`}>{bullet}</li>
                        ))}
                      </ul>

                      {activeSlide.studentTask && (
                        <div className="slideTaskBox">
                          <strong>Öğrenci görevi</strong>
                          <p>{activeSlide.studentTask}</p>
                        </div>
                      )}
                    </div>

                    <div className="slideVisualBox">
                      {activeVisual?.web_visual_assets?.thumbnail_url || activeVisual?.web_visual_assets?.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeVisual.web_visual_assets.thumbnail_url || activeVisual.web_visual_assets.image_url || ""}
                          alt={activeVisual.web_visual_assets.title}
                        />
                      ) : (
                        <div>
                          <strong>Görsel Alanı</strong>
                          <p>{activeSlide.suggestedVisual || activeSlide.visualPrompt || "Harita / şema / 3D model önerisi"}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="slidePreviewFooter">
                    <span>{activeSlide.animationPreset || "softFadeSequence"}</span>
                    <span>{activeSlide.coverageTags?.slice(0, 3).join(" · ")}</span>
                  </div>
                </div>

                <div className="slideEditForm">
                  <div className="actions">
                    <button className="btnLight" onClick={() => moveSlide(activeIndex, -1)}>Yukarı Taşı</button>
                    <button className="btnLight" onClick={() => moveSlide(activeIndex, 1)}>Aşağı Taşı</button>
                    <button className="btnLight" onClick={() => duplicateSlide(activeIndex)}>Kopyala</button>
                    <button className="btnSecondary" onClick={() => deleteSlide(activeIndex)}>Sil</button>
                  </div>

                  <div className="formGrid">
                    <label className="full">
                      Slayt Başlığı
                      <input
                        value={activeSlide.title}
                        onChange={(event) => updateSlide(activeIndex, { title: event.target.value })}
                      />
                    </label>

                    <label>
                      Slayt Düzeni
                      <select
                        value={activeSlide.layout}
                        onChange={(event) => updateSlide(activeIndex, { layout: event.target.value })}
                      >
                        <option>title</option>
                        <option>concept_explanation</option>
                        <option>map_analysis</option>
                        <option>visual_analysis</option>
                        <option>comparison</option>
                        <option>cause_effect</option>
                        <option>process</option>
                        <option>activity</option>
                        <option>summary</option>
                        <option>assessment</option>
                      </select>
                    </label>

                    <label>
                      Animasyon Preset
                      <select
                        value={activeSlide.animationPreset || "softFadeSequence"}
                        onChange={(event) => updateSlide(activeIndex, { animationPreset: event.target.value })}
                      >
                        <option>softFadeSequence</option>
                        <option>mapReveal</option>
                        <option>processFlow</option>
                        <option>comparisonWipe</option>
                        <option>conceptZoom</option>
                        <option>activityFocus</option>
                        <option>noAnimation</option>
                      </select>
                    </label>

                    <label className="full">
                      Öğretmen Notu
                      <textarea
                        value={activeSlide.teacherNotes}
                        onChange={(event) => updateSlide(activeIndex, { teacherNotes: event.target.value })}
                        rows={3}
                      />
                    </label>

                    <label className="full">
                      Öğrenci Görevi
                      <textarea
                        value={activeSlide.studentTask || ""}
                        onChange={(event) => updateSlide(activeIndex, { studentTask: event.target.value || null })}
                        rows={2}
                      />
                    </label>

                    <label className="full">
                      Görsel Prompt / Öneri
                      <textarea
                        value={activeSlide.visualPrompt || activeSlide.suggestedVisual || ""}
                        onChange={(event) => updateSlide(activeIndex, { visualPrompt: event.target.value })}
                        rows={3}
                      />
                    </label>
                  </div>

                  <div className="list" style={{ marginTop: 14 }}>
                    <strong>Slayt Maddeleri</strong>
                    {activeSlide.bulletPoints.map((bullet, bulletIndex) => (
                      <div className="bulletEditRow" key={`${activeSlide.slideNumber}-edit-${bulletIndex}`}>
                        <input
                          value={bullet}
                          onChange={(event) => updateBullet(activeIndex, bulletIndex, event.target.value)}
                        />
                        <button className="btnLight" onClick={() => removeBullet(activeIndex, bulletIndex)}>Sil</button>
                      </div>
                    ))}
                    <button className="btnLight" onClick={() => addBullet(activeIndex)}>Madde Ekle</button>
                  </div>

                  {activeVisual?.web_visual_assets && (
                    <div className="notice">
                      <strong>Bağlı görsel:</strong><br />
                      {activeVisual.web_visual_assets.title}<br />
                      <small>{activeVisual.web_visual_assets.attribution_text}</small>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="notice">Önizlenecek slayt bulunamadı.</div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
