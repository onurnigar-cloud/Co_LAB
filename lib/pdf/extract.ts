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

type PdfParseResult = {
  text?: string;
  numpages?: number;
};

type PdfParseFn = (buffer: Buffer) => Promise<PdfParseResult>;

function loadPdfParse(): PdfParseFn {
  // pdf-parse ana paketi Next/Vercel build sırasında test PDF dosyası okumaya çalışabiliyor.
  // Bu nedenle import dosya başında değil, yalnızca server-side işlem sırasında lazy require ile yapılır.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const pdfParse = require("pdf-parse/lib/pdf-parse.js") as PdfParseFn;
  return pdfParse;
}

export async function extractPdfText(buffer: Buffer): Promise<ExtractedPdf> {
  const checksum = sha256Buffer(buffer);

  try {
    const pdfParse = loadPdfParse();
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
  } catch {
    return {
      checksum,
      pageCount: null,
      text: "",
      chunks: [],
    };
  }
}
