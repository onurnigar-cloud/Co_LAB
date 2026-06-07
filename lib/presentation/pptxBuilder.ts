import pptxgen from "pptxgenjs";
import { colabPresentationTheme as theme } from "./designSystem";
import { getAnimationPlan, getPptxAnimationNote } from "./animationPlan";
import { fetchImageAsDataUri, type PreparedPptxImage } from "./imageFetcher";

export type PptxSlideDraft = {
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

export type PptxSlideVisualAsset = {
  slideNumber: number;
  title: string;
  imageUrl: string | null;
  thumbnailUrl?: string | null;
  sourceUrl?: string | null;
  attributionText?: string | null;
  license?: string | null;
  creator?: string | null;
  usageNote?: string | null;
};

export type PptxPresentationDraft = {
  presentationTitle: string;
  area: string;
  topicTitle: string;
  sourceSummary: string;
  mainConcepts: string[];
  subConcepts: string[];
  missingConcepts: string[];
  suggestedSlideCount: number;
  slides: PptxSlideDraft[];
  overallCoverageStatus: string;
  adminReviewNote: string;
  visualAssetsBySlide?: Record<number, PptxSlideVisualAsset>;
};

function addTopBar(slide: any, title: string, subtitle?: string) {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.38,
    fill: { color: theme.colors.deepNavy },
    line: { color: theme.colors.deepNavy }
  });

  slide.addShape("rect", {
    x: 0,
    y: 0.38,
    w: 13.333,
    h: 0.06,
    fill: { color: theme.colors.turquoise },
    line: { color: theme.colors.turquoise }
  });

  slide.addText("Co_LAB", {
    x: 0.55,
    y: 0.08,
    w: 1.6,
    h: 0.22,
    fontFace: theme.fonts.heading,
    fontSize: 11,
    bold: true,
    color: theme.colors.white,
    margin: 0
  });

  slide.addText(title, {
    x: 2.15,
    y: 0.09,
    w: 7.5,
    h: 0.22,
    fontFace: theme.fonts.body,
    fontSize: 8.5,
    color: theme.colors.mist,
    margin: 0
  });

  if (subtitle) {
    slide.addText(subtitle, {
      x: 9.65,
      y: 0.09,
      w: 3.1,
      h: 0.22,
      fontFace: theme.fonts.body,
      fontSize: 8.5,
      color: theme.colors.sand,
      align: "right",
      margin: 0
    });
  }
}

function addMotif(slide: any) {
  for (let i = 0; i < 7; i++) {
    slide.addShape("arc", {
      x: 8.4 + i * 0.18,
      y: 4.1 + i * 0.05,
      w: 3.8 - i * 0.18,
      h: 1.7 - i * 0.05,
      adjustPoint: 0.3,
      line: { color: theme.colors.turquoise, transparency: 84, width: 0.7 }
    });
  }

  for (let i = 0; i < 9; i++) {
    slide.addShape("line", {
      x: 0.7 + i * 1.35,
      y: 0.65,
      w: 0,
      h: 6.0,
      line: { color: "D8E8ED", transparency: 78, width: 0.4 }
    });
  }
}

function addFooter(slide: any, page: number, note?: string) {
  slide.addText(note || "Co_LAB · Öğretmen onaylı sunum taslağı", {
    x: 0.55,
    y: 7.12,
    w: 7.2,
    h: 0.18,
    fontSize: 7.5,
    color: theme.colors.slate,
    margin: 0
  });

  slide.addText(String(page).padStart(2, "0"), {
    x: 12.2,
    y: 7.09,
    w: 0.6,
    h: 0.2,
    fontSize: 8,
    bold: true,
    color: theme.colors.deepNavy,
    align: "right",
    margin: 0
  });
}

async function addVisualArea(
  slide: any,
  slideDraft: PptxSlideDraft,
  x: number,
  y: number,
  w: number,
  h: number,
  visualAsset?: PptxSlideVisualAsset
) {
  const prepared: PreparedPptxImage | null = visualAsset?.imageUrl
    ? await fetchImageAsDataUri({
        imageUrl: visualAsset.imageUrl,
        attributionText: visualAsset.attributionText,
        sourceUrl: visualAsset.sourceUrl
      })
    : null;

  if (prepared) {
    slide.addShape("roundRect", {
      x,
      y,
      w,
      h,
      rectRadius: 0.12,
      fill: { color: theme.colors.mist },
      line: { color: "C7DBE1", width: 1 }
    });

    slide.addImage({
      data: prepared.dataUri,
      x: x + 0.05,
      y: y + 0.05,
      w: w - 0.1,
      h: h - 0.38
    });

    slide.addShape("rect", {
      x: x + 0.05,
      y: y + h - 0.33,
      w: w - 0.1,
      h: 0.28,
      fill: { color: "FFFFFF", transparency: 10 },
      line: { color: "FFFFFF", transparency: 100 }
    });

    slide.addText((visualAsset?.attributionText || "Görsel atıf bilgisi kayıtlı değil.").slice(0, 180), {
      x: x + 0.16,
      y: y + h - 0.24,
      w: w - 0.32,
      h: 0.12,
      fontSize: 5.7,
      color: theme.colors.slate,
      margin: 0,
      fit: "shrink"
    });

    return;
  }

  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    rectRadius: 0.12,
    fill: { color: theme.colors.mist },
    line: { color: "C7DBE1", width: 1 }
  });

  slide.addShape("rect", {
    x,
    y,
    w,
    h: 0.32,
    fill: { color: theme.colors.atlasBlue, transparency: 5 },
    line: { color: theme.colors.atlasBlue, transparency: 100 }
  });

  slide.addText("GÖRSEL ALANI", {
    x: x + 0.2,
    y: y + 0.09,
    w: w - 0.4,
    h: 0.15,
    fontSize: 7.5,
    bold: true,
    color: theme.colors.white,
    margin: 0
  });

  slide.addText(slideDraft.suggestedVisual || slideDraft.visualPrompt || "Harita / şema / 3D görsel önerisi", {
    x: x + 0.28,
    y: y + 0.72,
    w: w - 0.56,
    h: h - 1.0,
    fontSize: 12,
    color: theme.colors.ink,
    valign: "mid",
    fit: "shrink",
    margin: 0.02
  });
}

function addAnimationNote(slide: any, layout: string, explicitPreset?: string) {
  const plan = getAnimationPlan(layout);
  slide.addShape("roundRect", {
    x: 9.25,
    y: 6.53,
    w: 3.45,
    h: 0.42,
    rectRadius: 0.08,
    fill: { color: "F4FBFF" },
    line: { color: "D9E8EC", width: 0.6 }
  });
  slide.addText(`Animasyon: ${explicitPreset || plan.preset}`, {
    x: 9.38,
    y: 6.65,
    w: 3.1,
    h: 0.12,
    fontSize: 6.8,
    color: theme.colors.slate,
    margin: 0
  });
}

async function addContentSlide(pptx: any, draft: PptxPresentationDraft, slideDraft: PptxSlideDraft) {
  const visualAsset = draft.visualAssetsBySlide?.[slideDraft.slideNumber];
  const slide = pptx.addSlide();
  slide.background = { color: theme.colors.white };

  addMotif(slide);
  addTopBar(slide, draft.presentationTitle, draft.area);
  addFooter(slide, slideDraft.slideNumber);
  addAnimationNote(slide, slideDraft.layout, slideDraft.animationPreset);

  slide.addText(slideDraft.title, {
    x: 0.65,
    y: 0.72,
    w: 6.9,
    h: 0.46,
    fontFace: theme.fonts.heading,
    fontSize: 24,
    bold: true,
    color: theme.colors.deepNavy,
    margin: 0,
    fit: "shrink"
  });

  slide.addShape("rect", {
    x: 0.65,
    y: 1.25,
    w: 1.25,
    h: 0.06,
    fill: { color: theme.colors.turquoise },
    line: { color: theme.colors.turquoise }
  });

  const isVisualHeavy = ["map_analysis", "visual_analysis", "process"].includes(slideDraft.layout);

  if (isVisualHeavy) {
    await addVisualArea(slide, slideDraft, 0.75, 1.55, 6.2, 4.85, visualAsset);

    slide.addShape("roundRect", {
      x: 7.25,
      y: 1.55,
      w: 5.25,
      h: 4.85,
      rectRadius: 0.14,
      fill: { color: "F8FBFC" },
      line: { color: "D5E6EA", width: 1 }
    });

    slide.addText(slideDraft.bulletPoints.map((b) => `• ${b}`).join("\n"), {
      x: 7.55,
      y: 1.85,
      w: 4.65,
      h: 2.0,
      fontFace: theme.fonts.body,
      fontSize: 13,
      color: theme.colors.ink,
      fit: "shrink",
      breakLine: false,
      margin: 0.04
    });

    if (slideDraft.studentTask) {
      slide.addShape("roundRect", {
        x: 7.55,
        y: 4.15,
        w: 4.65,
        h: 1.15,
        rectRadius: 0.1,
        fill: { color: "EFFFFC" },
        line: { color: "BFECE6", width: 1 }
      });
      slide.addText(`Öğrenci görevi: ${slideDraft.studentTask}`, {
        x: 7.78,
        y: 4.42,
        w: 4.18,
        h: 0.52,
        fontSize: 10.5,
        bold: true,
        color: theme.colors.atlasBlue,
        fit: "shrink",
        margin: 0
      });
    }
  } else {
    slide.addShape("roundRect", {
      x: 0.78,
      y: 1.55,
      w: 7.1,
      h: 4.85,
      rectRadius: 0.16,
      fill: { color: "F8FBFC" },
      line: { color: "D5E6EA", width: 1 }
    });

    slide.addText(slideDraft.bulletPoints.map((b) => `• ${b}`).join("\n"), {
      x: 1.12,
      y: 1.9,
      w: 6.4,
      h: 2.5,
      fontFace: theme.fonts.body,
      fontSize: 15,
      color: theme.colors.ink,
      fit: "shrink",
      margin: 0.04
    });

    if (slideDraft.studentTask) {
      slide.addShape("roundRect", {
        x: 1.1,
        y: 4.65,
        w: 6.45,
        h: 1.05,
        rectRadius: 0.1,
        fill: { color: "FFF8E8" },
        line: { color: "E8C072", width: 1 }
      });
      slide.addText(`Görev: ${slideDraft.studentTask}`, {
        x: 1.32,
        y: 4.93,
        w: 5.98,
        h: 0.42,
        fontSize: 11,
        bold: true,
        color: "6B4A0A",
        fit: "shrink",
        margin: 0
      });
    }

    await addVisualArea(slide, slideDraft, 8.25, 1.55, 4.1, 4.85, visualAsset);
  }

  slide.addText(slideDraft.coverageTags?.slice(0, 4).map((t) => `#${t}`).join("   ") || "", {
    x: 0.75,
    y: 6.62,
    w: 7.9,
    h: 0.17,
    fontSize: 7.5,
    color: theme.colors.slate,
    margin: 0
  });
}

export async function buildPresentationPptxBuffer(draft: PptxPresentationDraft) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Co_LAB";
  pptx.company = "Co_LAB";
  pptx.subject = draft.topicTitle;
  pptx.title = draft.presentationTitle;
  pptx.theme = {
    headFontFace: theme.fonts.heading,
    bodyFontFace: theme.fonts.body
  };

  const cover = pptx.addSlide();
  cover.background = { color: theme.colors.deepNavy };
  addMotif(cover);

  cover.addText("Co_LAB", {
    x: 0.75,
    y: 0.7,
    w: 2.2,
    h: 0.45,
    fontFace: theme.fonts.heading,
    fontSize: 22,
    bold: true,
    color: theme.colors.turquoise,
    margin: 0
  });

  cover.addText(draft.presentationTitle, {
    x: 0.75,
    y: 2.05,
    w: 8.9,
    h: 1.1,
    fontFace: theme.fonts.heading,
    fontSize: 38,
    bold: true,
    color: theme.colors.white,
    fit: "shrink",
    margin: 0
  });

  cover.addText(`${draft.area} · ${draft.topicTitle}`, {
    x: 0.78,
    y: 3.33,
    w: 7.2,
    h: 0.28,
    fontSize: 15,
    color: theme.colors.sand,
    margin: 0
  });

  cover.addShape("roundRect", {
    x: 0.78,
    y: 4.35,
    w: 5.8,
    h: 1.15,
    rectRadius: 0.12,
    fill: { color: "FFFFFF", transparency: 92 },
    line: { color: theme.colors.turquoise, transparency: 30 }
  });

  cover.addText("Resmi · Modern · Görsel destekli coğrafya sunumu", {
    x: 1.05,
    y: 4.75,
    w: 5.25,
    h: 0.22,
    fontSize: 13,
    bold: true,
    color: theme.colors.mist,
    margin: 0
  });

  cover.addText(getPptxAnimationNote(), {
    x: 0.78,
    y: 6.75,
    w: 11.8,
    h: 0.25,
    fontSize: 7.5,
    color: "BFD3DA",
    margin: 0
  });

  for (const slideDraft of draft.slides) {
    await addContentSlide(pptx, draft, slideDraft);
  }

  const summary = pptx.addSlide();
  summary.background = { color: theme.colors.white };
  addMotif(summary);
  addTopBar(summary, draft.presentationTitle, "Kapsam Kontrolü");
  addFooter(summary, draft.slides.length + 2, "Co_LAB · Kapsam kontrol slaydı");

  summary.addText("Kapsam ve Kontrol", {
    x: 0.75,
    y: 0.82,
    w: 6,
    h: 0.45,
    fontFace: theme.fonts.heading,
    fontSize: 28,
    bold: true,
    color: theme.colors.deepNavy,
    margin: 0
  });

  summary.addText("Ana kavramlar", {
    x: 0.85,
    y: 1.55,
    w: 2.6,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: theme.colors.atlasBlue,
    margin: 0
  });

  summary.addText(draft.mainConcepts.map((c) => `• ${c}`).join("\n"), {
    x: 0.9,
    y: 1.9,
    w: 5.2,
    h: 2.1,
    fontSize: 12,
    color: theme.colors.ink,
    fit: "shrink"
  });

  summary.addText("Eksik / kontrol gerektiren kavramlar", {
    x: 6.85,
    y: 1.55,
    w: 4.8,
    h: 0.2,
    fontSize: 12,
    bold: true,
    color: draft.missingConcepts.length ? theme.colors.warning : theme.colors.success,
    margin: 0
  });

  summary.addText((draft.missingConcepts.length ? draft.missingConcepts : ["Eksik kavram bildirilmedi."]).map((c) => `• ${c}`).join("\n"), {
    x: 6.9,
    y: 1.9,
    w: 5.2,
    h: 2.1,
    fontSize: 12,
    color: theme.colors.ink,
    fit: "shrink"
  });

  summary.addShape("roundRect", {
    x: 0.9,
    y: 4.65,
    w: 11.5,
    h: 1.05,
    rectRadius: 0.1,
    fill: { color: "F8FBFC" },
    line: { color: "D5E6EA", width: 1 }
  });

  summary.addText(draft.adminReviewNote || "Admin kontrol notu bulunmuyor.", {
    x: 1.15,
    y: 4.95,
    w: 11.0,
    h: 0.4,
    fontSize: 11,
    color: theme.colors.slate,
    fit: "shrink"
  });

  const arrayBuffer = await pptx.write({ outputType: "arraybuffer" });
  return Buffer.from(arrayBuffer as ArrayBuffer);
}
