import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePublicTest } from "../../../../../lib/repositories/publicTest";

const schema = z.object({
  area: z.string().optional(),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  questionType: z.string().optional(),
  count: z.number().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const input = schema.parse(body);
  const questions = await generatePublicTest(input);

  return NextResponse.json({
    ok: true,
    questions,
    count: questions.length,
    security: {
      answersVisible: false,
      sourcePdfVisible: false,
      driveFileVisible: false,
      note: "Doğru cevap, açıklama, kaynak PDF ve Drive bilgisi public çıktıda yer almaz.",
    },
  });
}
