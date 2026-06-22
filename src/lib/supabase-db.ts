import type { PrizeTier, TeamPrizeMapping } from "./prize";

type SupabasePrizePoolRow = {
  id: number;
  first_prize_total: number;
  second_prize_total: number;
  third_prize_total: number;
  first_prize_remaining: number;
  second_prize_remaining: number;
  third_prize_remaining: number;
  team_mapping: TeamPrizeMapping[] | string | null;
  is_configured: boolean;
  created_at: string;
  updated_at: string;
};

type SupabaseSpinSessionRow = {
  id: number;
  session_id: string;
  spin_count: number;
  has_won: boolean;
  prize_tier: PrizeTier | null;
};

export type AdminRow = {
  username: string;
  password_hash: string;
};

export type SpinLotteryResult = {
  status: number;
  result?: "win" | "no_win";
  error?: string;
  prizeTier?: PrizeTier;
  spinsUsed?: number;
  spinsRemaining?: number;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1`,
    key,
  };
}

async function supabaseRequest<T>(path: string, init: RequestInit = {}) {
  const { restUrl, key } = getSupabaseConfig();
  const res = await fetch(`${restUrl}${path}`, {
    ...init,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase request failed: ${res.status} ${body}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  const text = await res.text();
  if (!text) {
    return null as T;
  }

  return JSON.parse(text) as T;
}

export async function getPrizePool() {
  const rows = await supabaseRequest<SupabasePrizePoolRow[]>("/prize_pool?id=eq.1&select=*");
  const pool = rows[0];
  if (!pool) {
    throw new Error("Missing prize_pool row with id = 1.");
  }
  return pool;
}

export function parseTeamMapping(row: Pick<SupabasePrizePoolRow, "team_mapping">) {
  if (!row.team_mapping) return [] as TeamPrizeMapping[];
  if (typeof row.team_mapping === "string") {
    return JSON.parse(row.team_mapping) as TeamPrizeMapping[];
  }
  return row.team_mapping;
}

export async function getOrCreateSpinSession(sessionId: string) {
  const existingRows = await supabaseRequest<SupabaseSpinSessionRow[]>(
    `/spin_sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=*`,
  );
  const existingSession = existingRows[0];
  if (existingSession) {
    return existingSession;
  }

  const createdRows = await supabaseRequest<SupabaseSpinSessionRow[]>("/spin_sessions?select=*", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  const createdSession = createdRows[0];
  if (createdSession) {
    return createdSession;
  }

  const rows = await supabaseRequest<SupabaseSpinSessionRow[]>(
    `/spin_sessions?session_id=eq.${encodeURIComponent(sessionId)}&select=*`,
  );
  const session = rows[0];
  if (!session) {
    throw new Error("Unable to create spin session.");
  }
  return session;
}

export async function getAdminByUsername(username: string) {
  const rows = await supabaseRequest<AdminRow[]>(
    `/admins?username=eq.${encodeURIComponent(username)}&select=username,password_hash`,
  );
  return rows[0];
}

export async function savePrizePool(first: number, second: number, third: number, mapping: TeamPrizeMapping[]) {
  await supabaseRequest<SupabasePrizePoolRow[]>("/prize_pool?id=eq.1", {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      first_prize_total: first,
      second_prize_total: second,
      third_prize_total: third,
      first_prize_remaining: first,
      second_prize_remaining: second,
      third_prize_remaining: third,
      team_mapping: mapping,
      is_configured: true,
      updated_at: new Date().toISOString(),
    }),
  });
  await deleteSpinSessions();
}

export async function resetPrizePool(mapping: TeamPrizeMapping[]) {
  await supabaseRequest<SupabasePrizePoolRow[]>("/prize_pool?id=eq.1", {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      first_prize_total: 0,
      second_prize_total: 0,
      third_prize_total: 0,
      first_prize_remaining: 0,
      second_prize_remaining: 0,
      third_prize_remaining: 0,
      team_mapping: mapping,
      is_configured: false,
      updated_at: new Date().toISOString(),
    }),
  });
  await deleteSpinSessions();
}

async function deleteSpinSessions() {
  await supabaseRequest<null>("/spin_sessions?id=not.is.null", {
    method: "DELETE",
    headers: { Prefer: "return=minimal" },
  });
}

export async function spinLottery(sessionId: string, teamCode: string) {
  return supabaseRequest<SpinLotteryResult>("/rpc/spin_lottery", {
    method: "POST",
    body: JSON.stringify({ p_session_id: sessionId, p_team_code: teamCode }),
  });
}
