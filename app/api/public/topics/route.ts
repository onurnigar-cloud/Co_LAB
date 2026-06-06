import { NextResponse } from "next/server";
import { listPublishedTopics } from "../../../../lib/repositories/topics";

export async function GET() {
  const topics = await listPublishedTopics();
  return NextResponse.json({ topics });
}
