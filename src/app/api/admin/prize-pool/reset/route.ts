import { getDb } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/session";

export const runtime = "nodejs";

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "未登入。" }, { status: 401 });
  }

  const db = getDb();
  db.transaction(() => {
    db.prepare(
      `UPDATE prize_pool
       SET first_prize_remaining = first_prize_total,
           second_prize_remaining = second_prize_total,
           third_prize_remaining = third_prize_total,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
    ).run();
    db.prepare("DELETE FROM spin_sessions").run();
  })();

  return Response.json({ success: true });
}
