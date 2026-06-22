import { generatePrizeMapping } from "@/lib/prize";
import { isAdminAuthenticated } from "@/lib/session";
import { getPrizePool, parseTeamMapping, savePrizePool } from "@/lib/supabase-db";

export const runtime = "nodejs";

async function guard() {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "未登入。" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const pool = await getPrizePool();

  return Response.json({
    firstPrizeTotal: pool.first_prize_total,
    secondPrizeTotal: pool.second_prize_total,
    thirdPrizeTotal: pool.third_prize_total,
    firstPrizeRemaining: pool.first_prize_remaining,
    secondPrizeRemaining: pool.second_prize_remaining,
    thirdPrizeRemaining: pool.third_prize_remaining,
    isConfigured: pool.is_configured,
    mapping: parseTeamMapping(pool),
  });
}

export async function POST(request: Request) {
  const denied = await guard();
  if (denied) return denied;

  const body = (await request.json().catch(() => null)) as {
    firstPrize?: number;
    secondPrize?: number;
    thirdPrize?: number;
  } | null;

  const first = Number(body?.firstPrize ?? -1);
  const second = Number(body?.secondPrize ?? -1);
  const third = Number(body?.thirdPrize ?? -1);

  if ([first, second, third].some((value) => !Number.isInteger(value) || value < 0 || value > 10)) {
    return Response.json({ error: "各獎項名額需為 0 到 10 的整數。" }, { status: 400 });
  }
  if (first + second + third > 48) {
    return Response.json({ error: "總名額不可超過 48。" }, { status: 400 });
  }

  const mapping = generatePrizeMapping(first, second, third);
  await savePrizePool(first, second, third, mapping);

  return Response.json({ success: true });
}
