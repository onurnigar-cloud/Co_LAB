import { buildAttribution, type WebVisualCandidate } from "@/lib/webVisuals/types";

function cleanHtml(input?: string) {
  return (input || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || null;
}

function pickMeta(extmetadata: any, key: string) {
  return cleanHtml(extmetadata?.[key]?.value);
}

export async function searchWikimediaCommons(query: string, limit = 8): Promise<WebVisualCandidate[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url|extmetadata|size",
    iiurlwidth: "1200"
  });

  const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Wikimedia Commons araması başarısız: ${res.status}`);
  }

  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {}) as any[];

  return pages
    .map((page: any) => {
      const info = page.imageinfo?.[0];
      const meta = info?.extmetadata || {};
      const title = cleanHtml(pickMeta(meta, "ObjectName") || page.title?.replace(/^File:/, "")) || "Wikimedia görseli";
      const creator = pickMeta(meta, "Artist") || pickMeta(meta, "Credit");
      const license = pickMeta(meta, "LicenseShortName") || pickMeta(meta, "UsageTerms");
      const licenseUrl = meta?.LicenseUrl?.value || null;
      const sourceUrl = info?.descriptionurl || null;
      const imageUrl = info?.url || null;
      const thumbUrl = info?.thumburl || imageUrl;

      return {
        provider: "wikimedia" as const,
        title,
        query,
        thumbnailUrl: thumbUrl,
        imageUrl,
        sourceUrl,
        creator,
        license,
        licenseUrl,
        attributionText: buildAttribution({
          title,
          creator,
          provider: "Wikimedia Commons",
          license,
          sourceUrl
        }),
        width: info?.width ?? null,
        height: info?.height ?? null,
        description: pickMeta(meta, "ImageDescription"),
        slideFitNote: "Açık lisans bilgisi ve kaynak sayfası admin tarafından kontrol edilmelidir."
      };
    })
    .filter((item) => item.imageUrl || item.thumbnailUrl);
}
