import { getSpinSessionId } from "@/lib/session";
import { spinLottery } from "@/lib/supabase-db";
import { findTeam, TEAMS } from "@/lib/teams";

export const runtime = "nodejs";

export async function POST() {
  const sessionId = await getSpinSessionId();
  const selected = TEAMS[Math.floor(Math.random() * TEAMS.length)];
  const team = findTeam(selected.code) ?? selected;
  const result = await spinLottery(sessionId, selected.code);

  if (result.status !== 200) {
    return Response.json({ error: result.error ?? "抽獎失敗，請稍後再試。" }, { status: result.status });
  }

  return Response.json(
    {
      result: result.result,
      teamCode: team.code,
      teamName: team.name,
      prizeTier: result.prizeTier ?? "none",
      spinsUsed: result.spinsUsed,
      spinsRemaining: result.spinsRemaining,
    },
    { status: result.status },
  );
}
