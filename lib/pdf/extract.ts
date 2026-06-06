import { chunkText, estimateTokenCount, sha256Buffer } from "./fingerprint";

export type ExtractedPdf = {
  checksum: string;
  pageCount: number | null;
  text: string;
  chunks: Array<{
    chunkIndex: number;
    textContent: string;
    tokenEstimate: number;
  }>;
};

export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdf> {
  const checksum = sha256Buffer(buffer);

  try {
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(buffer);
    const text = parsed.text ?? "";
    const chunks = chunkText(text).map((chunk, index) => ({
      chunkIndex: index,
      textContent: chunk,
      tokenEstimate: estimateTokenCount(chunk),
    }));

    return {
      checksum,
      pageCount: parsed.numpages ?? null,
      text,
      chunks,
    };
  } catch (error) {
    // PDF parse bazı serverless ortamlarda sorun çıkarırsa işlemi tamamen durdurmamak için güvenli fallback.
    return {
      checksum,
      pageCount: null,
      text: "",
      chunks: [],
    };
  }
}
