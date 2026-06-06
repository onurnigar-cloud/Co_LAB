import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/security/adminApi";
import { searchWebVisuals } from "@/lib/webVisuals/search";

const schema = z.object({
  query: z.string().min(2),
  provider: z.enum(["wikimedia", "nasa", "openverse", "all"]).default("all"),
  limit: z.number().min(1).max(20).default(8),
});

export async function POST(request: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const body = await request.json();
  const input = schema.parse(body);

  const results = await searchWebVisuals(input);

  return NextResponse.json({
    ok: true,
    results,
    security: {
      visitorVisible: false,
      note: "Görseller admin seçimi ve lisans/atıf kontrolü yapılmadan sunuma gömülmez.",
    },
  });
}
