export type WebVisualProvider = "wikimedia" | "nasa" | "openverse" | "all";

export type WebVisualCandidate = {
  provider: "wikimedia" | "nasa" | "openverse";
  title: string;
  query: string;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  sourceUrl: string | null;
  creator: string | null;
  license: string | null;
  licenseUrl: string | null;
  attributionText: string;
  width?: number | null;
  height?: number | null;
  description?: string | null;
  slideFitNote?: string | null;
};

export type WebVisualSearchInput = {
  query: string;
  provider?: WebVisualProvider;
  limit?: number;
  safeMode?: boolean;
};

export function buildAttribution(params: {
  title: string;
  creator?: string | null;
  provider: string;
  license?: string | null;
  sourceUrl?: string | null;
}) {
  const creator = params.creator || "Bilinmeyen üretici";
  const license = params.license || "Lisans bilgisi kontrol edilmeli";
  const source = params.sourceUrl || "Kaynak URL yok";
  return `${params.title} — ${creator} — ${params.provider} — ${license} — ${source}`;
}
