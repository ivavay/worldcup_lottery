import { getDb, getOrCreateSpinSession, getPrizePool, parseTeamMapping } from "@/lib/db";
import { getRemainingColumn } from "@/lib/prize";
import { getSpinSessionId } from "@/lib/session";
import { findTeam, TEAMS } from "@/lib/teams";

export const runtime = "nodejs";

export async function POST() {
  const sessionId = await getSpinSessionId();
  const db = getDb();

  const result = db.transaction(() => {
    const session = getOrCreateSpinSession(sessionId);
    if (session.has_won === 1) {
      return { status: 403, body: { error: "已中獎，本次工作階段已結束。" } };
    }
    if (session.spin_count >= 3) {
      return { status: 403, body: { error: "抽獎次數已用完。" } };
    }

    const pool = getPrizePool();
    if (pool.is_configured !== 1) {
      return { status: 400, body: { error: "管理員尚未設定獎池。" } };
    }

    const index = Math.floor(Math.random() * TEAMS.length);
    const selected = TEAMS[index];
    const mapping = parseTeamMapping(pool).find((item) => item.teamCode === selected.code);
    const prizeTier = mapping?.prize ?? "none";
    const remainingColumn = getRemainingColumn(prizeTier);
    const remaining = remainingColumn ? Number(pool[remainingColumn]) : 0;
    const team = findTeam(selected.code) ?? selected;

    if (remainingColumn && remaining > 0) {
      db.prepare(`UPDATE prize_pool SET ${remainingColumn} = ${remainingColumn} - 1, updated_at = CURRENT_TIMESTAMP WHERE id = 1`).run();
      db.prepare(
        "UPDATE spin_sessions SET spin_count = spin_count + 1, has_won = 1, prize_tier = ?, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?",
      ).run(prizeTier, sessionId);

      return {
        status: 200,
        body: {
          result: "win",
          teamCode: team.code,
          teamName: team.name,
          prizeTier,
          spinsUsed: session.spin_count + 1,
          spinsRemaining: 0,
        },
      };
    }

    db.prepare("UPDATE spin_sessions SET spin_count = spin_count + 1, updated_at = CURRENT_TIMESTAMP WHERE session_id = ?").run(sessionId);
    const spinsUsed = session.spin_count + 1;
    return {
      status: 200,
      body: {
        result: "no_win",
        teamCode: team.code,
        teamName: team.name,
        prizeTier: "none",
        spinsUsed,
        spinsRemaining: Math.max(0, 3 - spinsUsed),
      },
    };
  })();

  return Response.json(result.body, { status: result.status });
}
