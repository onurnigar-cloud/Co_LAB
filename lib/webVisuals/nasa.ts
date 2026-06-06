import { buildAttribution, type WebVisualCandidate } from "./types";

export async function searchNasaImages(query: string, limit = 8): Promise<WebVisualCandidate[]> {
  const params = new URLSearchParams({
    q: query,
    media_type: "image",
    page_size: String(limit)
  });

  const url = `https://images-api.nasa.gov/search?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`NASA Images araması başarısız: ${res.status}`);
  }

  const data = await res.json();
  const items = data?.collection?.items || [];

  return items.map((item: any) => {
    const meta = item.data?.[0] || {};
    const link = item.links?.find((l: any) => l.render === "image") || item.links?.[0];
    const title = meta.title || "NASA görseli";
    const creator = meta.photographer || meta.secondary_creator || meta.center || "NASA";
    const sourceUrl = item.href || null;
    const imageUrl = link?.href || null;

    return {
      provider: "nasa" as const,
      title,
      query,
      thumbnailUrl: imageUrl,
      imageUrl,
      sourceUrl,
      creator,
      license: "NASA Images kullanım koşulları kontrol edilmeli",
      licenseUrl: "https://www.nasa.gov/nasa-brand-center/images-and-media/",
      attributionText: buildAttribution({
        title,
        creator,
        provider: "NASA Images",
        license: "NASA Images",
        sourceUrl
      }),
      width: null,
      height: null,
      description: meta.description || null,
      slideFitNote: "NASA görsellerinde kullanım/atıf koşulları admin tarafından kontrol edilmelidir."
    };
  }).filter((item: WebVisualCandidate) => item.imageUrl);
}
