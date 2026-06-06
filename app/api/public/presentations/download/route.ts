import { NextResponse } from "next/server";
import { z } from "zod";
import { createPresentationDownloadUrl } from "../../../../../lib/repositories/presentationPublish";
import { recordPresentationDownloadEvent } from "../../../../../lib/repositories/presentationAnalytics";

const schema = z.object({
  publicationId: z.string().min(2),
});

export async function POST(request: Request) {
  const body = await request.json();
  const input = schema.parse(body);

  try {
    const result = await createPresentationDownloadUrl(input.publicationId);

    await recordPresentationDownloadEvent({
      publicationId: input.publicationId,
      userAgent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    });

    return NextResponse.json({
      ok: true,
      result,
      security: {
        signedUrl: true,
        sourcePdfVisible: false,
        note: "İndirme bağlantısı geçici olarak oluşturulur.",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Sunum indirme bağlantısı oluşturulamadı.",
      },
      { status: 500 }
    );
  }
}
