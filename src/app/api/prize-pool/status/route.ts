import { getPrizePool } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const pool = getPrizePool();
  return Response.json({
    isConfigured: pool.is_configured === 1,
    firstPrizeRemaining: pool.first_prize_remaining,
    secondPrizeRemaining: pool.second_prize_remaining,
    thirdPrizeRemaining: pool.third_prize_remaining,
  });
}
