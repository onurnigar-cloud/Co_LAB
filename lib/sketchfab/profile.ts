import type { SketchfabModelCandidate, SketchfabProfileScanResult } from "@/lib/sketchfab/types";
import { getSketchfabOEmbedCandidate } from "@/lib/sketchfab/oembed";
import { extractSketchfabUsername } from "@/lib/sketchfab/url";

async function fetchJson(url: string, token?: string | null) {
  const headers: Record<string, string> = {
    "User-Agent": "Co_LAB educational 3D model importer"
  };

  if (token) headers.Authorization = `Token ${token}`;

  const res = await fetch(url, {
    headers,
    cache: "no-store"
  });

  if (!res.ok) {
    throw new Error(`${url} isteği başarısız: ${res.status}`);
  }

  return res.json();
}

function candidateFromApiItem(item: any, profileUrl: string): SketchfabModelCandidate | null {
  const uid = item.uid || item.id;
  if (!uid) return null;

  const sourceUrl = item.viewerUrl || item.uri || item.url || `https://sketchfab.com/models/${uid}`;
  const title = item.name || item.title || `Sketchfab Model ${String(uid).slice(0, 8)}`;
  const thumb =
    item.thumbnails?.images?.find((img: any) => img.width >= 512)?.url ||
    item.thumbnails?.images?.[0]?.url ||
    null;

  return {
    uid,
    sourceUrl,
    embedUrl: `https://sketchfab.com/models/${uid}/embed?autostart=0&ui_infos=0&ui_controls=1&ui_stop=0&dnt=1`,
    oembedHtml: null,
    originalTitle: title,
    displayName: title,
    educationalName: null,
    description: item.description || null,
    thumbnailUrl: thumb,
    authorName: item.user?.displayName || item.user?.username || null,
    authorUrl: item.user?.profileUrl || null,
    license: item.license?.label || item.license || null,
    licenseUrl: item.license?.url || null,
    tags: Array.isArray(item.tags) ? item.tags.map((t: any) => typeof t === "string" ? t : t.name).filter(Boolean) : [],
    sourceProfileUrl: profileUrl,
  };
}

export async function scanSketchfabProfile(profileUrlOrUsername: string): Promise<SketchfabProfileScanResult> {
  const username = extractSketchfabUsername(profileUrlOrUsername) || process.env.SKETCHFAB_USERNAME || "onurnigar";
  const profileUrl = `https://sketchfab.com/${username}/models`;
  const token = process.env.SKETCHFAB_API_TOKEN || null;
  const warnings: string[] = [];
  const candidates: SketchfabModelCandidate[] = [];

  const endpoints = [
    `https://api.sketchfab.com/v3/users/${encodeURIComponent(username)}/models?sort_by=-publishedAt`,
    `https://api.sketchfab.com/v3/search?type=models&user=${encodeURIComponent(username)}`
  ];

  for (const endpoint of endpoints) {
    try {
      const data = await fetchJson(endpoint, token);
      const items = data.results || data.models || data.collection || [];

      for (const item of items) {
        const candidate = candidateFromApiItem(item, profileUrl);
        if (candidate && !candidates.some((c) => c.uid === candidate.uid)) {
          candidates.push(candidate);
        }
      }

      if (candidates.length > 0) {
        return { username, profileUrl, candidates, warnings };
      }
    } catch (error) {
      warnings.push(error instanceof Error ? error.message : "Sketchfab profil tarama hatası.");
    }
  }

  warnings.push("Profil toplu taraması sonuç vermedi. Tek tek model URL'si ekleme yöntemi kullanılabilir.");

  return { username, profileUrl, candidates, warnings };
}

export async function importSketchfabModelUrl(modelUrlOrUid: string, sourceProfileUrl?: string | null) {
  return getSketchfabOEmbedCandidate(modelUrlOrUid, sourceProfileUrl);
}
