export function extractSketchfabUsername(profileUrlOrUsername: string) {
  const trimmed = profileUrlOrUsername.trim();

  if (!trimmed.includes("sketchfab.com")) {
    return trimmed.replace(/^@/, "").replace(/\/models$/, "");
  }

  const match = trimmed.match(/sketchfab\.com\/([^/?#]+)(?:\/models)?/i);
  return match?.[1] || null;
}

export function extractSketchfabUid(input: string) {
  const trimmed = input.trim();

  const modelPath = trimmed.match(/\/3d-models\/[^/]*-([a-f0-9]{32})(?:[/?#].*)?$/i);
  if (modelPath?.[1]) return modelPath[1];

  const modelPathAlt = trimmed.match(/\/models\/([a-f0-9]{32})(?:[/?#].*)?$/i);
  if (modelPathAlt?.[1]) return modelPathAlt[1];

  if (/^[a-f0-9]{32}$/i.test(trimmed)) return trimmed;

  return null;
}

export function buildSketchfabModelUrl(uid: string) {
  return `https://sketchfab.com/models/${uid}`;
}

export function buildSketchfabEmbedUrl(uid: string) {
  const params = new URLSearchParams({
    autostart: "0",
    ui_infos: "0",
    ui_controls: "1",
    ui_stop: "0",
    ui_watermark: "1",
    dnt: "1"
  });

  return `https://sketchfab.com/models/${uid}/embed?${params.toString()}`;
}

export function sanitizeModelName(input: string) {
  return input
    .replace(/\s+/g, " ")
    .replace(/[-_]+/g, " ")
    .trim();
}
