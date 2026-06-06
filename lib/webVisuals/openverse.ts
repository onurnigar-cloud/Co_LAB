import { buildAttribution, type WebVisualCandidate } from "@/lib/webVisuals/types";

export async function searchOpenverseImages(query: string, limit = 8): Promise<WebVisualCandidate[]> {
  const params = new URLSearchParams({
    q: query,
    page_size: String(limit),
    mature: "false"
  });

  const url = `https://api.openverse.org/v1/images/?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    throw new Error(`Openverse araması başarısız: ${res.status}`);
  }

  const data = await res.json();
  const results = data?.results || [];

  return results.map((item: any) => {
    const title = item.title || "Openverse görseli";
    const creator = item.creator || null;
    const license = item.license || item.license_version || null;
    const sourceUrl = item.foreign_landing_url || item.url || null;
    const imageUrl = item.url || null;
    const thumbnailUrl = item.thumbnail || imageUrl;

    return {
      provider: "openverse" as const,
      title,
      query,
      thumbnailUrl,
      imageUrl,
      sourceUrl,
      creator,
      license,
      licenseUrl: item.license_url || null,
      attributionText: buildAttribution({
        title,
        creator,
        provider: "Openverse",
        license,
        sourceUrl
      }),
      width: item.width ?? null,
      height: item.height ?? null,
      description: item.description || null,
      slideFitNote: "Openverse CC/public-domain kaynakları listeler; nihai lisans ve atıf admin tarafından kontrol edilmelidir."
    };
  }).filter((item: WebVisualCandidate) => item.imageUrl || item.thumbnailUrl);
}
