import { NextRequest, NextResponse } from "next/server";
import { getChatSession } from "@/lib/ai/analytics";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ messages: [] });
  }

  try {
    const messages = await getChatSession(token);
    return NextResponse.json({ messages: messages || [] });
  } catch (err) {
    console.error("GET /api/chat/history error", err);
    return NextResponse.json({ messages: [] });
  }
}
