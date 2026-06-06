import { NextResponse } from "next/server";
import { listPublicQuestionTopics } from "@/lib/repositories/publicTest";

export async function GET() {
  const topics = await listPublicQuestionTopics();

  return NextResponse.json({
    ok: true,
    topics,
    security: {
      sourcePdfVisible: false,
      answersVisible: false,
      note: "Bu endpoint yalnızca public test konu özetlerini döndürür.",
    },
  });
}
