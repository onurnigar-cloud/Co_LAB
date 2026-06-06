export type PreparedPptxImage = {
  dataUri: string;
  contentType: string;
  attributionText?: string | null;
  sourceUrl?: string | null;
};

function guessContentType(url: string, headerType?: string | null) {
  if (headerType?.startsWith("image/")) return headerType.split(";")[0];

  const clean = url.split("?")[0].toLowerCase();
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";

  return "image/jpeg";
}

export async function fetchImageAsDataUri(input: {
  imageUrl: string;
  attributionText?: string | null;
  sourceUrl?: string | null;
}): Promise<PreparedPptxImage | null> {
  try {
    const res = await fetch(input.imageUrl, {
      headers: {
        "User-Agent": "Co_LAB educational presentation builder"
      },
      cache: "no-store"
    });

    if (!res.ok) return null;

    const contentType = guessContentType(input.imageUrl, res.headers.get("content-type"));
    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      dataUri: `data:${contentType};base64,${base64}`,
      contentType,
      attributionText: input.attributionText,
      sourceUrl: input.sourceUrl
    };
  } catch {
    return null;
  }
}
