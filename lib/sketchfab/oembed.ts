import type { SketchfabModelCandidate } from "@/lib/sketchfab/types";
import { buildSketchfabEmbedUrl, buildSketchfabModelUrl, extractSketchfabUid, sanitizeModelName } from "@/lib/sketchfab/url";

export async function getSketchfabOEmbedCandidate(modelUrlOrUid: string, sourceProfileUrl?: string | null): Promise<SketchfabModelCandidate> {
  const uid = extractSketchfabUid(modelUrlOrUid);

  if (!uid) {
    throw new Error("Geçerli Sketchfab model UID bulunamadı.");
  }

  const sourceUrl = modelUrlOrUid.includes("sketchfab.com")
    ? modelUrlOrUid
    : buildSketchfabModelUrl(uid);

  const endpoint = new URL("https://sketchfab.com/oembed");
  endpoint.searchParams.set("url", sourceUrl);
  endpoint.searchParams.set("maxwidth", "1280");
  endpoint.searchParams.set("maxheight", "720");

  const res = await fetch(endpoint.toString(), {
    headers: {
      "User-Agent": "Co_LAB educational 3D model importer"
    },
    cache: "no-store"
  });

  if (!res.ok) {
    return {
      uid,
      sourceUrl,
      embedUrl: buildSketchfabEmbedUrl(uid),
      originalTitle: `Sketchfab Model ${uid.slice(0, 8)}`,
      displayName: `Sketchfab Model ${uid.slice(0, 8)}`,
      educationalName: null,
      description: null,
      thumbnailUrl: null,
      authorName: null,
      authorUrl: null,
      license: null,
      licenseUrl: null,
      tags: [],
      sourceProfileUrl,
    };
  }

  const data = await res.json();
  const title = sanitizeModelName(data.title || `Sketchfab Model ${uid.slice(0, 8)}`);

  return {
    uid,
    sourceUrl,
    embedUrl: buildSketchfabEmbedUrl(uid),
    oembedHtml: data.html || null,
    originalTitle: title,
    displayName: title,
    educationalName: null,
    description: data.description || null,
    thumbnailUrl: data.thumbnail_url || null,
    authorName: data.author_name || data.provider_name || null,
    authorUrl: data.author_url || null,
    license: null,
    licenseUrl: null,
    tags: [],
    sourceProfileUrl,
  };
}
