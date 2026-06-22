import { getSpinSessionId } from "@/lib/session";
import { getOrCreateSpinSession } from "@/lib/supabase-db";

export const runtime = "nodejs";

export async function GET() {
  const sessionId = await getSpinSessionId();
  const session = await getOrCreateSpinSession(sessionId);

  return Response.json({
    spinsUsed: session.spin_count,
    spinsRemaining: Math.max(0, 3 - session.spin_count),
    hasWon: session.has_won,
    prizeTier: session.prize_tier,
  });
}
