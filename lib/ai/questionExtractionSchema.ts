export const questionExtractionJsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceSummary: {
      type: "string",
      description: "İşlenen kaynak metnin kısa özeti."
    },
    detectedTopics: {
      type: "array",
      items: { type: "string" },
      description: "Kaynak metinde tespit edilen konu başlıkları."
    },
    embeddedAnswerKeyDetected: {
      type: "boolean",
      description: "Metinde cevap anahtarı veya yanıt listesi tespit edilip edilmediği."
    },
    answerKeyStartHint: {
      type: ["string", "null"],
      description: "Cevap anahtarının başladığı sayfa/bölüm tahmini. Bilinmiyorsa null."
    },
    questions: {
      type: "array",
      description: "Kaynak metinden çıkarılan sorular.",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          stem: { type: "string" },
          options: {
            type: "array",
            items: { type: "string" }
          },
          correctAnswer: {
            type: ["string", "null"],
            description: "Doğru cevap. Ziyaretçiye gösterilmeyecek. Bilinmiyorsa null."
          },
          explanation: {
            type: ["string", "null"],
            description: "Kısa açıklama. Bilinmiyorsa null."
          },
          area: {
            type: "string",
            description: "9. Sınıf, 10. Sınıf, 11. Sınıf, 12. Sınıf, TYT veya AYT."
          },
          classLevel: {
            type: ["string", "null"]
          },
          topicTitle: {
            type: "string"
          },
          difficulty: {
            type: "string",
            enum: ["Kolay", "Orta", "Zor"]
          },
          questionType: {
            type: "string",
            enum: ["Çoktan seçmeli", "Açık uçlu", "Doğru yanlış", "Eşleştirme", "Kısa cevap"]
          },
          confidence: {
            type: "number",
            minimum: 0,
            maximum: 1
          },
          needsReview: {
            type: "boolean"
          }
        },
        required: [
          "stem",
          "options",
          "correctAnswer",
          "explanation",
          "area",
          "classLevel",
          "topicTitle",
          "difficulty",
          "questionType",
          "confidence",
          "needsReview"
        ]
      }
    }
  },
  required: [
    "sourceSummary",
    "detectedTopics",
    "embeddedAnswerKeyDetected",
    "answerKeyStartHint",
    "questions"
  ]
} as const;

export type ExtractedQuestion = {
  stem: string;
  options: string[];
  correctAnswer: string | null;
  explanation: string | null;
  area: string;
  classLevel: string | null;
  topicTitle: string;
  difficulty: "Kolay" | "Orta" | "Zor";
  questionType: "Çoktan seçmeli" | "Açık uçlu" | "Doğru yanlış" | "Eşleştirme" | "Kısa cevap";
  confidence: number;
  needsReview: boolean;
};

export type QuestionExtractionResult = {
  sourceSummary: string;
  detectedTopics: string[];
  embeddedAnswerKeyDetected: boolean;
  answerKeyStartHint: string | null;
  questions: ExtractedQuestion[];
};
