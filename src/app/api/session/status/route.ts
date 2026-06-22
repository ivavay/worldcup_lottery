import { getSpinSessionId } from "@/lib/session";
import { getOrCreateSpinSession } from "@/lib/supabase-db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const sessionId = await getSpinSessionId();
    const session = await getOrCreateSpinSession(sessionId);

    return Response.json({
      spinsUsed: session.spin_count,
      spinsRemaining: Math.max(0, 3 - session.spin_count),
      hasWon: session.has_won,
      prizeTier: session.prize_tier,
    });
  } catch (error) {
    console.error("/api/session/status failed", error);
    return Response.json({ error: "工作階段狀態讀取失敗。" }, { status: 500 });
  }
}
