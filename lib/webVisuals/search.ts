import { searchNasaImages } from "./nasa";
import { searchOpenverseImages } from "./openverse";
import { searchWikimediaCommons } from "./wikimedia";
import type { WebVisualCandidate, WebVisualSearchInput } from "./types";

function uniqueByImageUrl(items: WebVisualCandidate[]) {
  const seen = new Set<string>();
  const unique: WebVisualCandidate[] = [];

  for (const item of items) {
    const key = item.imageUrl || item.thumbnailUrl || item.sourceUrl || item.title;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  return unique;
}

export async function searchWebVisuals(input: WebVisualSearchInput) {
  const provider = input.provider || "all";
  const limit = input.limit ?? 8;

  const tasks: Array<Promise<WebVisualCandidate[]>> = [];

  if (provider === "all" || provider === "wikimedia") {
    tasks.push(searchWikimediaCommons(input.query, limit));
  }

  if (provider === "all" || provider === "nasa") {
    tasks.push(searchNasaImages(input.query, limit));
  }

  if (provider === "all" || provider === "openverse") {
    tasks.push(searchOpenverseImages(input.query, limit));
  }

  const settled = await Promise.allSettled(tasks);
  const results = settled.flatMap((result) => result.status === "fulfilled" ? result.value : []);

  return uniqueByImageUrl(results).slice(0, limit * (provider === "all" ? 3 : 1));
}
