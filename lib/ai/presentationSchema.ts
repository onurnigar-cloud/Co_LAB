export const presentationGenerationJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentationTitle: {
      type: "string"
    },
    area: {
      type: "string"
    },
    topicTitle: {
      type: "string"
    },
    sourceSummary: {
      type: "string"
    },
    mainConcepts: {
      type: "array",
      items: { type: "string" }
    },
    subConcepts: {
      type: "array",
      items: { type: "string" }
    },
    coverageChecklist: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          item: { type: "string" },
          status: { type: "string", enum: ["covered", "missing", "needs_review"] },
          note: { type: "string" }
        },
        required: ["item", "status", "note"]
      }
    },
    missingConcepts: {
      type: "array",
      items: { type: "string" }
    },
    suggestedSlideCount: {
      type: "number"
    },
    slides: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          slideNumber: { type: "number" },
          title: { type: "string" },
          layout: {
            type: "string",
            enum: [
              "title",
              "concept_explanation",
              "map_analysis",
              "visual_analysis",
              "comparison",
              "cause_effect",
              "process",
              "activity",
              "summary",
              "assessment"
            ]
          },
          bulletPoints: {
            type: "array",
            items: { type: "string" }
          },
          teacherNotes: {
            type: "string"
          },
          studentTask: {
            type: ["string", "null"]
          },
          suggestedVisual: {
            type: ["string", "null"]
          },
          mapOr3DLinkNeeded: {
            type: "boolean"
          },
          coverageTags: {
            type: "array",
            items: { type: "string" }
          },
          visualPrompt: {
            type: ["string", "null"]
          },
          iconPrompt: {
            type: ["string", "null"]
          },
          animationPreset: {
            type: "string",
            enum: [
              "softFadeSequence",
              "mapReveal",
              "processFlow",
              "comparisonWipe",
              "conceptZoom",
              "activityFocus",
              "noAnimation"
            ]
          },
          designNote: {
            type: "string"
          }
        },
        required: [
          "slideNumber",
          "title",
          "layout",
          "bulletPoints",
          "teacherNotes",
          "studentTask",
          "suggestedVisual",
          "mapOr3DLinkNeeded",
          "coverageTags",
          "visualPrompt",
          "iconPrompt",
          "animationPreset",
          "designNote"
        ]
      }
    },
    overallCoverageStatus: {
      type: "string",
      enum: ["complete", "missing_concepts", "needs_review"]
    },
    adminReviewNote: {
      type: "string"
    }
  },
  required: [
    "presentationTitle",
    "area",
    "topicTitle",
    "sourceSummary",
    "mainConcepts",
    "subConcepts",
    "coverageChecklist",
    "missingConcepts",
    "suggestedSlideCount",
    "slides",
    "overallCoverageStatus",
    "adminReviewNote"
  ]
} as const;

export type PresentationSlideDraft = {
  slideNumber: number;
  title: string;
  layout:
    | "title"
    | "concept_explanation"
    | "map_analysis"
    | "visual_analysis"
    | "comparison"
    | "cause_effect"
    | "process"
    | "activity"
    | "summary"
    | "assessment";
  bulletPoints: string[];
  teacherNotes: string;
  studentTask: string | null;
  suggestedVisual: string | null;
  mapOr3DLinkNeeded: boolean;
  coverageTags: string[];
  visualPrompt: string | null;
  iconPrompt: string | null;
  animationPreset:
    | "softFadeSequence"
    | "mapReveal"
    | "processFlow"
    | "comparisonWipe"
    | "conceptZoom"
    | "activityFocus"
    | "noAnimation";
  designNote: string;
};

export type PresentationGenerationResult = {
  presentationTitle: string;
  area: string;
  topicTitle: string;
  sourceSummary: string;
  mainConcepts: string[];
  subConcepts: string[];
  coverageChecklist: Array<{
    item: string;
    status: "covered" | "missing" | "needs_review";
    note: string;
  }>;
  missingConcepts: string[];
  suggestedSlideCount: number;
  slides: PresentationSlideDraft[];
  overallCoverageStatus: "complete" | "missing_concepts" | "needs_review";
  adminReviewNote: string;
};
