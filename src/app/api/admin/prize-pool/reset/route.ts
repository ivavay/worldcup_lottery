import { isAdminAuthenticated } from "@/lib/session";
import { resetPrizePool } from "@/lib/supabase-db";
import { TEAMS } from "@/lib/teams";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "未登入。" }, { status: 401 });
  }

  const resetMapping = TEAMS.map((team) => ({
    teamCode: team.code,
    prize: "none" as const,
  }));

  await resetPrizePool(resetMapping);

  return Response.json({ success: true });
}
