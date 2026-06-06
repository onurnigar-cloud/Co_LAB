export type TestPrintSettings = {
  schoolName: string;
  examTitle: string;
  teacherName?: string;
  durationMinutes?: number;
  scoreLabel?: string;
  showQuestionTags?: boolean;
  showFooterNote?: boolean;
};

export const defaultTestPrintSettings: TestPrintSettings = {
  schoolName: "Co_LAB Dijital Coğrafya Laboratuvarı",
  examTitle: "Coğrafya Çalışma Testi",
  teacherName: "",
  durationMinutes: 40,
  scoreLabel: "Puan",
  showQuestionTags: false,
  showFooterNote: true,
};

export function buildCoverageText(area: string, topic: string, difficulty: string, questionCount: number) {
  const level = difficulty === "Tümü" ? "karma düzey" : difficulty.toLocaleLowerCase("tr") + " düzey";
  return `${area} · ${topic} · ${questionCount} soru · ${level}`;
}
