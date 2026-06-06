import { db } from "./data";

type ArchiveSearchInput = {
  area?: string;
  topic?: string;
  contentType?: string;
};

export function searchAiArchive(input: ArchiveSearchInput) {
  return db.aiLibrary.filter((item: any) => {
    const areaMatch = !input.area || input.area === "Tümü" || item.area === input.area;
    const topicMatch = !input.topic || item.topic?.toLocaleLowerCase("tr").includes(input.topic.toLocaleLowerCase("tr"));
    const typeMatch = !input.contentType || input.contentType === "Tümü" || item.contentType === input.contentType;
    return areaMatch && topicMatch && typeMatch;
  });
}

// Gerçek sistemde bu dosya OpenAI embeddings / semantic search ile genişletilecek.
export function decideArchiveAction(matches: any[]) {
  if (matches.length > 0) {
    return {
      action: "reuse_or_adapt",
      message: "Arşivde uygun içerik bulundu. Yeniden üretim yerine arşivden getir veya uyarlanmış sürüm oluştur.",
      matches,
    };
  }

  return {
    action: "generate_new",
    message: "Arşivde uygun içerik bulunamadı. Yeni AI üretimi başlatılabilir.",
    matches: [],
  };
}
