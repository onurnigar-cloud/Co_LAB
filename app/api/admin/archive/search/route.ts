import { NextResponse } from "next/server";
import { z } from "zod";
import { searchArchive } from "@/lib/repositories/archive";

const schema = z.object({
  area: z.string().optional(),
  topic: z.string().optional(),
  contentType: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const input = schema.parse(body);
  const result = await searchArchive(input);

  return NextResponse.json(result);
}
