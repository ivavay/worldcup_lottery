import { getDb } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/session";
import { TEAMS } from "@/lib/teams";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "未登入。" }, { status: 401 });
  }

  const resetMapping = TEAMS.map((team) => ({
  teamCode: team.code,
  prize: "none",
}));

  const db = getDb();
  db.transaction(() => {
    db.prepare(
      `UPDATE prize_pool
       SET  first_prize_total = 0, 
            second_prize_total = 0, 
            third_prize_total = 0,
            first_prize_remaining = 0,
            second_prize_remaining = 0,
            third_prize_remaining = 0,
            team_mapping = ?,
            is_configured = 0,
            updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
    ).run(JSON.stringify(resetMapping));
    db.prepare("DELETE FROM spin_sessions").run();
  })();

  return Response.json({ success: true });
}
