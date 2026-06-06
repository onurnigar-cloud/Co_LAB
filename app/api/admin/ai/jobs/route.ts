import { NextResponse } from "next/server";

export async function POST() {
  // v2.1 placeholder.
  // v2.5 ve sonrası: OpenAI API + Supabase ai_jobs tablosuna bağlanacak.
  return NextResponse.json({
    status: "queued_placeholder",
    message: "AI job endpoint placeholder. Gerçek AI entegrasyonu sonraki sürümde bağlanacak.",
  });
}
