import { getOrCreateSpinSession } from "@/lib/db";
import { getSpinSessionId } from "@/lib/session";

export const runtime = "nodejs";

export async function GET() {
  const sessionId = await getSpinSessionId();
  const session = getOrCreateSpinSession(sessionId);

  return Response.json({
    spinsUsed: session.spin_count,
    spinsRemaining: Math.max(0, 3 - session.spin_count),
    hasWon: session.has_won === 1,
    prizeTier: session.prize_tier,
  });
}
