import crypto from "crypto";

export function sha256Buffer(buffer: Buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function estimateTokenCount(text: string) {
  // Basit yaklaşık hesap: Türkçe metinlerde 1 token yaklaşık 3-4 karakter kabul edilebilir.
  return Math.ceil(text.length / 4);
}

export function chunkText(text: string, maxChars = 6000) {
  const normalized = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  for (let i = 0; i < normalized.length; i += maxChars) {
    chunks.push(normalized.slice(i, i + maxChars));
  }

  return chunks;
}
