import { getPrizePool } from "@/lib/supabase-db";

export const runtime = "nodejs";

export async function GET() {
  const pool = await getPrizePool();
  return Response.json({
    isConfigured: pool.is_configured,
    firstPrizeRemaining: pool.first_prize_remaining,
    secondPrizeRemaining: pool.second_prize_remaining,
    thirdPrizeRemaining: pool.third_prize_remaining,
  });
}
